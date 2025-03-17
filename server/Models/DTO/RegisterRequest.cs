using System.ComponentModel.DataAnnotations;

namespace LexiLearn.Models.DTO
{
    public enum Roles
    {
        Pupil,
        Teacher,
    }

    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EnumDataType(typeof(Roles), ErrorMessage = "User Role must be either 'Pupil', or 'Teacher'")]
        public required string Role{ get; set; }
    }
}
