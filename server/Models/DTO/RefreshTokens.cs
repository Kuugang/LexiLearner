namespace LexiLearner.Models.DTO
{
    public class RefreshTokensDTO
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
    }
}
