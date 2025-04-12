using System.ComponentModel.DataAnnotations;

namespace LexiLearner.Models
{
    public class Genre
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [StringLength(64)]
        public required string Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
