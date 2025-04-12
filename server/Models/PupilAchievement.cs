using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models
{

    public class PupilAchievement
    {
        public required Guid Id { get; set; } = Guid.NewGuid();

        public required Guid PupilId { get; set; }
        [ForeignKey("PupilId")]
        public required Pupil Pupil { get; set; }


        public required Guid AchievementId { get; set; }
        [ForeignKey("AchievementId")]
        public required Achievement Achievement { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
