using Microsoft.AspNetCore.Identity;

namespace LexiLearner.Models
{
    public class User : IdentityUser
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }

        public Pupil? Pupil { get; set; }
        public Teacher? Teacher { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
    }
}
