using System.ComponentModel.DataAnnotations;

namespace LexiLearner.Models.DTO{
    public class ClassroomDTO{
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

            [Required]
            public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;
            public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        }

        public class UpdateClassroom{
            
            public string? Name{get;set;}

            public string? Description { get; set; }
            [Required]
            public required DateTime UpdatedAt { get; set; }
        }

    }
}