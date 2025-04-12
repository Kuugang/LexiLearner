using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace LexiLearner.Models
{

    public class Classroom
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid TeacherId { get; set; }

        [ForeignKey("TeacherId")]
        public required Teacher Teacher { get; set; }

        [StringLength(64, MinimumLength = 10)]
        public required string Name { get; set; }

        [StringLength(100)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; }
    }
}
