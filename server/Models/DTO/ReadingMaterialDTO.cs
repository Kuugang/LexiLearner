using System.Text.Json.Serialization;

namespace LexiLearner.Models.DTO
{
  public class ReadingMaterialDTO
  {
    public class FromJson { 
      [JsonPropertyName("grade_level")]
      public int? Grade_Level { get; set; }
      [JsonPropertyName("complexity")]
      public string? Complexity { get; set; }
      [JsonPropertyName("title")]
      public required string Title { get; set; }
      [JsonPropertyName("author")]
      public required string Author { get; set; }
      [JsonPropertyName("genre")]
      public required List<string> Genre { get; set; }
      [JsonPropertyName("description")]
      public required string Description { get; set; }
      [JsonPropertyName("word_count")]
      public int? Word_Count { get; set; }
      [JsonPropertyName("passage")]
      public required string Passage { get; set; }
     [JsonPropertyName("questions")]
      public required List<object> Questions { get; set; } 
    }
    public class Create
    {
      public required Guid Id { get; set; }
      public required List<string> Genres { get; set; }
      public required string Author { get; set; }
      public required string Title { get; set; }
      public required string Cover { get; set; }
      public required string Description { get; set; }
      public required string Content { get; set; }
      public required bool IsDepEd { get; set; }
    }
    
    public class Read()
    {
      public Guid? Id { get; set; }
      public List<string>? Genre { get; set; }
      public string? Title { get; set; }
    }
  }
  
  public class ReadingMaterialResponseDTO(ReadingMaterial readingMaterial)
  {
    public Guid Id { get; set; } = readingMaterial.Id;
    public List<string> Genres { get; set; } = [.. readingMaterial.ReadingMaterialGenres.Select(rg => rg.Genre.Name)];
    public string Author { get; set; } = readingMaterial.Author;
    public string Title { get; set; } = readingMaterial.Title;
    public string Cover { get; set; } = readingMaterial.Cover;
    public float Difficulty { get; set; } = readingMaterial.Difficulty;
    public string? Description { get; set; } = readingMaterial.Description;
    public string? Content { get; set; } = readingMaterial.Content;
  }
}