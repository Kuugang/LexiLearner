using System.ComponentModel.DataAnnotations.Schema;
namespace LexiLearner.Models
{
    public class ReadingContent
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required string Title { get; set; }
        public required string Cover { get; set; }
        public required string Content { get; set; }

        public required Guid GenreId { get; set; }
        [ForeignKey("GenreId")]
        public required Genre Genre { get; set; }

        public required float Difficulty { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
