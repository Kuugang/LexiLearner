using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models
{
    public class ReadingAssignmentLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required Guid ReadingAssignmentId { get; set; }
        [ForeignKey("ReadingAssignmentId")]
        public required ReadingMaterialAssignment ReadingAssignment { get; set; }
        public required Guid MinigameLogId { get; set; }
        [ForeignKey("MinigameLogId")]
        public required MinigameLog MinigameLog { get; set; }
        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    }
}