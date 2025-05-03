using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models
{
    public class ClassroomEnrollment
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required Guid PupilId { get; set; }
        [ForeignKey("PupilId")]
        public required Pupil Pupil { get; set; }

        public required Guid ClassroomId { get; set; }
        [ForeignKey("ClassroomId")]
        public required Classroom Classroom { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
