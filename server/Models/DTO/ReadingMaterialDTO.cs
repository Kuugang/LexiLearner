namespace LexiLearner.Models.DTO
{
  public class ReadingMaterialDTO
  {
    public class Create
    {
      public required Guid Id { get; set; }
      public required string Genre { get; set; }
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
      public string? Genre { get; set; }
      public string? Title { get; set; }
    }
  }
  
  public class ReadingMaterialResponseDTO(ReadingMaterial readingMaterial)
  {
    public required Guid Id { get; set; } = readingMaterial.Id;
    public required Genre Genre { get; set; } = readingMaterial.Genre;
    public required string Author { get; set; } = readingMaterial.Author;
    public required string Title { get; set; } = readingMaterial.Title;
    public required string Cover { get; set; } = readingMaterial.Cover;
    public required float Difficulty { get; set; } = readingMaterial.Difficulty;
    public string? Description { get; set; } = readingMaterial.Description;
    public string? Content { get; set; } = readingMaterial.Content;
    public DateTime? CreatedAt { get; set; } = readingMaterial.CreatedAt;
    public bool? IsDepEd { get; set; } = readingMaterial.IsDepEd;
  }
}