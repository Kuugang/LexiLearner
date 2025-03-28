using System.ComponentModel.DataAnnotations;

namespace LexiLearner.Models.DTO
{

    public class UpdateProfileDTO
    {
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public int? Age { get; set; }
        public int? GradeLevel { get; set; }
        public bool? TwoFactorEnabled { get; set; }
    }
    
    public class PupilProfileDTO{
        public Guid Id { get; set; }
        
        public UserDTO User { get; set; } = null!;

        public int? Age { get; set; }
        public int? GradeLevel { get; set; }
        public int? Level { get; set; }

        public PupilProfileDTO(User user, Pupil pupil)
        {
            Id = pupil.Id;
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
		public string Id { get; set; }
		public string Email { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Username { get; set; }
		public bool TwoFactorEnabled { get; set; }
		public string PhoneNumber { get; set; }

        public UserDTO(){}

        public UserDTO(User user){
            Id = user.Id;
            Email = user.Email;  
            FirstName = user.FirstName;
            LastName = user.LastName;
            Username = user.UserName;
            TwoFactorEnabled  = user.TwoFactorEnabled;
            PhoneNumber = user.PhoneNumber;
        }
	}
}
