using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models
{
    public class ReadingAssignmentLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required Guid ReadingMaterialAssignmentId { get; set; }
        [ForeignKey("ReadingMaterialAssignmentId")]
        public required ReadingMaterialAssignment ReadingMaterialAssignment { get; set; }
        public required Guid MinigameLogId { get; set; }
        [ForeignKey("MinigameLogId")]
        public required MinigameLog MinigameLog { get; set; }
        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    }
}