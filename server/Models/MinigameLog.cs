using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models
{

    public class MinigameLog
    {
        public required Guid Id { get; set; } = Guid.NewGuid();

        public required Guid MinigameId { get; set; }
        [ForeignKey("MinigameId")]
        public required Minigame Minigame { get; set; }

        public required Guid PupilId { get; set; }
        [ForeignKey("PupilId")]
        public required Pupil Pupil { get; set; }

        public required string Result { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
