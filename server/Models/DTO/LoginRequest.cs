using System.ComponentModel.DataAnnotations;

namespace LexiLearner.Models.DTO
{
    public class LoginRequest 
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public required string Password { get; set; }
    }
}
