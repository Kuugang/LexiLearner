using System.Diagnostics;
using System.Text.Json;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using LexiLearner.Services;
using Microsoft.EntityFrameworkCore;

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
      }
      
      if (!context.ReadingMaterial.Any())
      {
        var json = File.ReadAllText(".\\Data\\Seed\\all_complete_data.json");
        var materialsDTO = JsonSerializer.Deserialize<List<ReadingMaterialDTO.FromJson>>(json);

        if (materialsDTO != null)
        {
          var passageGenre = await genreService.GetGenreByName("Passage");
          if (passageGenre == null)
          {
            passageGenre = await genreService.Create("Passage");
          }
          
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
                  if(newGenre == null)
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
          }
      
          await context.ReadingMaterial.AddRangeAsync(materials);
          await context.SaveChangesAsync();
        }
      }

      if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
    }
  }
}
