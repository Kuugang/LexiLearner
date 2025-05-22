namespace LexiLearner.Models.DTO
{
    public class JWTDTO
    {
        public string AccessToken { get; set; }
        public RefreshToken RefreshToken { get; set; }


        public JWTDTO()
        {

        }

        public JWTDTO(string Token, RefreshToken RefreshToken)
        {
            this.AccessToken = Token;
            this.RefreshToken = RefreshToken;
        }
    }
}
