using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models
{
    public class ReadingMaterial
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required Guid GenreId { get; set; }
        [ForeignKey("GenreId")]
        public required Genre Genre { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 5)]
        public required string Title { get; set; }

        [Required]
        [StringLength(500)]
        public required string Description { get; set; }

        [Required]
        [StringLength(255)]
        public required string Cover { get; set; }

        [Required]
        [DataType(DataType.MultilineText)]
        public required string Content { get; set; }

        [Range(0.0, 10)]
        public required float Difficulty { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

