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

        
        //Can only be used when role is initially null
        public Roles? Role {get; set;}  
    }
    
    public class PupilProfileDTO{
        public Guid Id { get; set; }
        
        public object User { get; set; } = null!;

        public int? Age { get; set; }
        public int? GradeLevel { get; set; }
        public int? Level { get; set; }

        public PupilProfileDTO(User user, Pupil pupil, bool Public = false)
        {
            Id = pupil.Id;

            if(Public){
                User = new PublicProfileDTO(user);
            }else{
                User = new PrivateProfileDTO(user);
            }

            Age = pupil.Age;
            GradeLevel = pupil.GradeLevel;
            Level = pupil.Level;
        }
    }

    public class TeacherProfileDTO{
        public Guid Id { get; set; }
        public string UserId { get; set; }
        
        public object User { get; set; } = null!;

        public TeacherProfileDTO(User user, Teacher teacher, bool Public = false){
            Id = teacher.Id;
            UserId = user.Id;

            if(Public){
                User = new PublicProfileDTO(user);
            }else{
                User = new PrivateProfileDTO(user);
            }
        }
    }


	public class PrivateProfileDTO
	{
		public string Id { get; set; }
		public string Email { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Username { get; set; }
		public bool TwoFactorEnabled { get; set; }
		public string PhoneNumber { get; set; }

        public PrivateProfileDTO(){}

        public PrivateProfileDTO(User user){
            FirstName = user.FirstName;
            LastName = user.LastName;
            Username = user.UserName;
            
            Id = user.Id;
            Email = user.Email;  
            TwoFactorEnabled  = user.TwoFactorEnabled;
            PhoneNumber = user.PhoneNumber;
        }
	}

	public class PublicProfileDTO 
	{
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Username { get; set; }

        public PublicProfileDTO(){}

        public PublicProfileDTO(User user){
            FirstName = user.FirstName;
            LastName = user.LastName;
            Username = user.UserName;
        }
	}
}
