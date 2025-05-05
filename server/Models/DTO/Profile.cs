using Org.BouncyCastle.Utilities.Zlib;

namespace LexiLearner.Models.DTO
{
    public class UpdateProfileDTO
    {
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public IFormFile? Avatar { get; set; }
        public int? Age { get; set; }
        public int? GradeLevel { get; set; }
        public bool? TwoFactorEnabled { get; set; }

        //Can only be used when role is initially null
        public Roles? Role { get; set; }
    }

    public class ProfileDTO
    {
        public string? Id { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string UserName { get; set; }
        public bool? TwoFactorEnabled { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Avatar { get; set; }
        public string Role { get; set; }

        public int? Age { get; set; }
        public int? GradeLevel { get; set; }
        public int? Level { get; set; }

        public ProfileDTO() { }

        public ProfileDTO(User user, Pupil pupil, bool Public = false)
        {
            SetupFields(user, Public);
            Age = pupil.Age;
            GradeLevel = pupil.GradeLevel;
            Level = pupil.Level;
            Role = Roles.Pupil.ToString();
        }

        public ProfileDTO(User user, Teacher teacher, bool Public = false)
        {
            SetupFields(user, Public);
            Role = Roles.Teacher.ToString();
        }

        private void SetupFields(User user, bool Public)
        {
            UserName = user.UserName;
            Avatar = user.Avatar;

            if (Public) return;

            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Email = user.Email;
            TwoFactorEnabled = user.TwoFactorEnabled;
            PhoneNumber = user.PhoneNumber;
        }
    }
    
    public class LoginStreakDTO
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }
        public DateTime LastLoginDate { get; set; }
        
        public LoginStreakDTO(LoginStreak streak)
        {
          Id = streak.Id;
          UserId = streak.UserId;
          CurrentStreak = streak.CurrentStreak;
          LongestStreak = streak.LongestStreak;
          LastLoginDate = streak.LastLoginDate;
        }
    }
}
