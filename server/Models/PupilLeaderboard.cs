using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models
{
    public class PupilLeaderboard
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required Guid PupilId { get; set; }
        [ForeignKey("PupilId")]
        public required Pupil Pupil { get; set; }
        public int Level { get; set; }
        public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    }
}