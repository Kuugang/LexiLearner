namespace LexiLearn.Models.DTO{
    public class GoogleAuthResponseDTO
    {
        public string AccessToken { get; set; }  // JWT token for session
        public string RefreshToken { get; set; } // Optional refresh token
    }
}
