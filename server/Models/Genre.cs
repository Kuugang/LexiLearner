namespace LexiLearner.Models
{
    public class Genre
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required string Name { get; set; }
        public List<ReadingContent> ReadingContents { get; set; } = new();
    }
}
