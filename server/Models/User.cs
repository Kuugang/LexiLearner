using System.ComponentModel.DataAnnotations;

using Microsoft.AspNetCore.Identity;

namespace LexiLearner.Models
{
    public class User : IdentityUser
    {
        [StringLength(64)]
        public required string FirstName { get; set; }
        [StringLength(64)]
        public required string LastName { get; set; }

        public Pupil? Pupil { get; set; }
        public Teacher? Teacher { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
    }
}
