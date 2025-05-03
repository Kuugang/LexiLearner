namespace LexiLearner.Models.DTO{
    public class ClassroomEnrollmentDTO{
        public class JoinClassroom() {
            public required Guid? PupilId {get;set;}
            public required Guid? TeacherId{get; set;}
            public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        }
}}

