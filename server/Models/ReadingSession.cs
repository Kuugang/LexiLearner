using System.ComponentModel.DataAnnotations.Schema;


namespace LexiLearner.Models
{
    public class ReadingSession
    {
        public Guid Id { set; get; } = Guid.NewGuid();

        public required Guid PupilId { get; set; }
        [ForeignKey("PupilId")]
        public required Pupil Pupil { get; set; }

        public required Guid ReadingMaterialId { get; set; }
        [ForeignKey("ReadingMaterialId")]
        public required ReadingMaterial ReadingMaterial { get; set; }

        public required float CompletionPercentage { get; set; }

        //To get the duration CompletedAt - StartedAt
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime CompletedAt { get; set; }
    }
}
