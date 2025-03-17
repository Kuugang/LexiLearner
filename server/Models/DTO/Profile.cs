using System.ComponentModel.DataAnnotations;

namespace LexiLearn.Models.DTO
{

    public enum Role
    {
        Pupil,
        Teacher,
    }

    public class UpdateProfileDTO
    {

        [Required]
        [EnumDataType(typeof(Role), ErrorMessage = "User Role must be either 'Pupil', or 'Teacher'")]
        public required string Role{ get; set; }

        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? Age { get; set; }
        public int? GradeLevel { get; set; }
    }
    
    public class PupilProfileDTO{
        public Guid Id { get; set; }
        public string UserId { get; set; }
        
        public UserDTO User { get; set; } = null!;

        public int? Age { get; set; }
        public int? GradeLevel { get; set; }
        public int? Level { get; set; }

        public PupilProfileDTO(User user, Pupil pupil)
        {
            Id = pupil.Id;
            UserId = user.Id;
            User = new UserDTO(user);
            Age = pupil.Age;
            GradeLevel = pupil.GradeLevel;
            Level = pupil.Level;
        }
    }

    public class TeacherProfileDTO{
        public Guid Id { get; set; }
        public string UserId { get; set; }
        
        public UserDTO User { get; set; } = null!;

        public TeacherProfileDTO(User user, Teacher teacher){
            Id = teacher.Id;
            UserId = user.Id;
            User = new UserDTO(user);
        }
    }

    public class UserDTO
    {
        public string Id { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;

        public UserDTO(User user){
            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Email = user.Email;
        }
    }
}
