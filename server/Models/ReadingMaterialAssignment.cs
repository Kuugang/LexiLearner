using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LexiLearner.Models
{

    public class ReadingMaterialAssignment
    {
        public required Guid Id { get; set; }

        public required Guid ClassroomId { get; set; }
        [ForeignKey("ClassroomId")]
        public required Classroom Classroom { get; set; }
        public required Guid ReadingMaterialId { get; set; }
        [ForeignKey("ReadingMaterialId")]
        public required ReadingMaterial ReadingMaterial { get; set; }
        public required Guid MinigameId { get; set; }
        [ForeignKey("MinigameId")]
        public required Minigame Minigame { get; set; }

        [StringLength(64)]
        public required string Title { get; set; }

        [StringLength(255)]
        public required string Description { get; set; }

        public required bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public ICollection<ReadingAssignmentLog> ReadingAssignmentLogs { get; set; } = new List<ReadingAssignmentLog>();
    }
}
