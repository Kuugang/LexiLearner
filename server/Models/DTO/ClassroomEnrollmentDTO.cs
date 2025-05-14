namespace LexiLearner.Models.DTO{
    public class ClassroomEnrollmentDTO{
        public Guid Id { get; set; }
        public Guid PupilId { get; set; }
        public Guid ClassroomId { get; set; }
        public DateTime CreatedAt { get; set; }
        public ClassroomEnrollmentDTO(ClassroomEnrollment ce)
        {
            Id = ce.Id;
            PupilId = ce.PupilId;
            ClassroomId = ce.ClassroomId;
            CreatedAt = ce.CreatedAt;
        }
        public class JoinClassroom() {
            public required Guid? PupilId {get;set;}
            public required Guid? TeacherId{get; set;}
            public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        }
        
        public class Leaderboard
        {
            public Guid Id { get; set; }
            public Guid PupilId { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public Guid ClassroomId { get; set; }
            public int Level { get; set; }
            
            public Leaderboard(ClassroomEnrollment ce)
            {
                Id = ce.Id;
                PupilId = ce.PupilId;
                FirstName = ce.Pupil.User.FirstName;
                LastName = ce.Pupil.User.LastName;
                ClassroomId = ce.ClassroomId;
                Level = ce.Pupil.Level;
            }
        }
}}

