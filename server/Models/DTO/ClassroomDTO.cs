using System.ComponentModel.DataAnnotations;

namespace LexiLearner.Models.DTO{
    public class ClassroomDTO{
        public Guid Id { get; set; }
        public Guid TeacherId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string JoinCode { get; set; }
        public int? PupilCount { get; set; }

        public ClassroomDTO(Classroom classroom)
        {
            Id = classroom.Id;
            TeacherId = classroom.TeacherId;
            Name = classroom.Name;
            Description = classroom.Description;
            CreatedAt = classroom.CreatedAt;
            UpdatedAt = classroom.UpdatedAt;
            JoinCode = classroom.JoinCode;
            PupilCount = classroom.ClassroomEnrollments?.Count ?? 0;
        }
        public class ReadClassroom{ 
            public ReadClassroom() { // ning suon rakos tomnam food nako DD:

            }

            public ReadClassroom(Classroom classroom) {
                TeacherId = classroom.TeacherId;
                Name = classroom.Name;
                Description = classroom.Description;
                CreatedAt = classroom.CreatedAt;
                UpdatedAt = classroom.UpdatedAt;
            }
            public Guid? TeacherId {get;set;}
            public string? Name{get;set;}

            public string? Description { get; set; }

            public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
            public DateTime? UpdatedAt { get; set; }
        }

        public class CreateClassroom{
            [Required]
            public required string Name{get;set;}

            public string? Description { get; set; }

            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
            public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        }

        public class UpdateClassroom{
            
            public string? Name{get;set;}

            public string? Description { get; set; }
            public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
        }

    }
}