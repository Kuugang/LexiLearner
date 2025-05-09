using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models
{
    public class Pupil
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public required string UserId { get; set; }

        [Required]
        [ForeignKey("UserId")]
        public required User User { get; set; }

        public int? Age { get; set; }

        public int? GradeLevel { get; set; }

        public int Level { get; set; } = 0;
    }
}
