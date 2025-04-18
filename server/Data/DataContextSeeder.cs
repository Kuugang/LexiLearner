using System.Diagnostics;
using System.Text.Json;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

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
          new Genre { Name = "Novel" }
        };
        
        await context.Genre.AddRangeAsync(genres);
      }
      
      if (!context.ReadingMaterial.Any())
      {
        var json = File.ReadAllText(".\\Data\\Seed\\all_passages.json");
        var materialsDTO = JsonSerializer.Deserialize<List<ReadingMaterialDTO.FromJson>>(json);

        if (materialsDTO != null) 
        {
          var genre = await genreService.GetGenreByName("Passage");
          if (genre == null)
          {
            genre = await genreService.Create("Passage");
          }

          var materials = materialsDTO.Select(dto => new ReadingMaterial
          {
            Grade_Level = (int)(dto.Grade_Level != null ? dto.Grade_Level : 6),
            Genre = genre,
            GenreId = genre.Id,
            Author = dto.Author,
            Title = dto.Title,
            Description = dto.Description,
            Content = dto.Passage,
            Difficulty = (float)readabilityService.CalculateFleschScore(dto.Passage),
            Cover = "",
            IsDepEd = true
          });

          await context.ReadingMaterial.AddRangeAsync(materials);
        }
      }

      if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
    }
  }
}
