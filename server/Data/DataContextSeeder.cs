using System.Text.Json;
using LexiLearner.Data.DTO;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using LexiLearner.Services;
using Microsoft.AspNetCore.StaticAssets;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Ocsp;

namespace LexiLearner.Data
{
    public class DataContextSeeder
    {
        public static async Task LoadMaterialsAsync(DataContext context, IGenreService genreService, IReadabilityService readabilityService)
        {
            if (!context.Genre.Any())
            {
                var genres = new List<Genre>()
                {
                new Genre { Name = "Science Fiction" },
                new Genre { Name = "Mystery" },
                new Genre { Name = "Supernatural" },
                new Genre { Name = "Fantasy" },
                new Genre { Name = "Political Intrigue" },
                new Genre { Name = "Paranormal" },
                new Genre { Name = "Romance" },
                new Genre { Name = "Horror" },
                new Genre { Name = "Thriller" },
                new Genre { Name = "Coming of Age" },
                new Genre { Name = "Historical Fiction" },
                new Genre { Name = "Drama" },
                new Genre { Name = "Adventure" },
                new Genre { Name = "Comedy" },
                new Genre { Name = "Metafiction" },
                new Genre { Name = "Short story" },
                new Genre { Name = "Passage" },
                new Genre { Name = "Novel" },
                };

                await context.Genre.AddRangeAsync(genres);
                await context.SaveChangesAsync();
            }

            if (!context.ReadingMaterial.Any())
            {
                var materialPath = Path.Combine("Data", "Seed", "all_complete_data.json");
                var materialjson = File.ReadAllText(materialPath);
                var materialsDTO = JsonSerializer.Deserialize<List<ReadingMaterialDTO.FromJson>>(materialjson);



                if (materialsDTO != null)
                {
                    var passageGenre = await genreService.GetGenreByName("Passage");

                    // Use a dictionary to track genres by name
                    var genreDictionary = new Dictionary<string, Genre>();

                    // Load all existing genres into the dictionary
                    foreach (var existingGenre in await context.Genre.AsQueryable().ToListAsync())
                    {
                        genreDictionary[existingGenre.Name] = existingGenre;
                    }

                    var materials = new List<ReadingMaterial>();
                    foreach (var dto in materialsDTO)
                    {
                        var readingMaterial = new ReadingMaterial
                        {
                            Grade_Level = (int)(dto.Grade_Level != null ? dto.Grade_Level : 6),
                            Author = dto.Author,
                            Title = dto.Title,
                            Description = dto.Description,
                            Content = dto.Passage,
                            Difficulty = (float)readabilityService.CalculateFleschScore(dto.Passage),
                            Cover = "",
                            IsDepEd = true,
                            ReadingMaterialGenres = new List<ReadingMaterialGenre>()
                        };

                        if (dto.Genre != null && dto.Genre.Any())
                        {
                            foreach (var genreName in dto.Genre.Distinct())
                            {
                                Genre genre;
                                if (!genreDictionary.TryGetValue(genreName, out genre))
                                {
                                    // Genre doesn't exist, create and add to dictionary
                                    var newGenre = await genreService.GetGenreByName(genreName);
                                    if (newGenre == null)
                                    {
                                        newGenre = await genreService.Create(genreName);
                                    }
                                    genre = newGenre;
                                    genreDictionary[genreName] = genre;
                                }

                                readingMaterial.ReadingMaterialGenres.Add(new ReadingMaterialGenre
                                {
                                    GenreId = genre.Id,
                                    Genre = genre
                                });
                            }
                        }
                        // Add the "Passage" genre
                        readingMaterial.ReadingMaterialGenres.Add(new ReadingMaterialGenre
                        {
                            GenreId = passageGenre.Id,
                            Genre = passageGenre
                        });
                        materials.Add(readingMaterial);

                        // Adding minigames for the readingmaterial
                        List<Minigame> minigamesList = [];

                        minigamesList.AddRange(CreateMinigamesList(dto.Minigames.WordHunt, MinigameType.WordHunt, readingMaterial));
                        minigamesList.AddRange(CreateMinigamesList(dto.Minigames.FillInTheBlanks, MinigameType.FillInTheBlanks, readingMaterial));
                        minigamesList.AddRange(CreateMinigamesList(dto.Minigames.SentenceRearrangement, MinigameType.SentenceRearrangement, readingMaterial));
                        minigamesList.AddRange(CreateMinigamesList(dto.Minigames.TwoTruthsOneLie, MinigameType.TwoTruthsOneLie, readingMaterial));
                        minigamesList.AddRange(CreateMinigamesList(dto.Minigames.WordsFromLetters, MinigameType.WordsFromLetters, readingMaterial));

                        await context.AddRangeAsync(minigamesList);
                        await context.SaveChangesAsync();
                    }

                    await context.ReadingMaterial.AddRangeAsync(materials);
                    await context.SaveChangesAsync();
                }
            }

            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }

        public static async Task LoadAchievementsAsync(DataContext context)
        {
            if (!context.Achievement.Any())
            {
                var path = Path.Combine("Data", "Seed", "achievements.json");
                var json = File.ReadAllText(path);
                var achievementsDTO = JsonSerializer.Deserialize<List<AchievementDTO.FromJson>>(json);

                var allAchievements = new List<Achievement>();
                if (achievementsDTO != null)
                {
                    foreach (var dto in achievementsDTO)
                    {
                        var achievement = new Achievement
                        {
                            Name = dto.Name,
                            Description = dto.Description,
                            Badge = dto.Badge
                        };
                        allAchievements.Add(achievement);
                    }

                    await context.Achievement.AddRangeAsync(allAchievements);
                    await context.SaveChangesAsync();
                }
            }

            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }

        private static IEnumerable<Minigame> CreateMinigamesList<T>(IEnumerable<T> items, MinigameType type, ReadingMaterial readingMaterial)
        {
            var jsonOptions = new JsonSerializerOptions { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var maxScores = GetMaxScore(type, items);
            return items.Zip(maxScores, (item, maxScore) => new Minigame
            {
                ReadingMaterial = readingMaterial,
                ReadingMaterialId = readingMaterial.Id,
                MinigameType = type,
                MetaData = JsonSerializer.Serialize(item, jsonOptions),
                MaxScore = maxScore
            });
        }

        private static List<int> GetMaxScore<T>(MinigameType type, IEnumerable<T> items)
        {
            List<int> maxScores = [];

            foreach (var item in items)
            {
                int score = 0;

                switch (type)
                {
                    case MinigameType.FillInTheBlanks:
                    case MinigameType.SentenceRearrangement:
                    case MinigameType.TwoTruthsOneLie:
                        score = 1;
                        break;
                    case MinigameType.WordsFromLetters:
                        var wfl = item as WordsFromLettersGame;

                        if (wfl != null)
                        {
                            score = wfl.words.Count;
                        }

                        break;
                    case MinigameType.WordHunt:
                        var wh = item as WordHuntGame;

                        if (wh != null)
                        {
                            score = wh.correct.Count;
                        }

                        break;
                }

                maxScores.Add(score);
            }

            return maxScores;
        }
    }
}
