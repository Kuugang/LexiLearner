namespace LexiLearner.Models.DTO
{
    public class JWTDTO
    {
        public string Token { get; set; }


        public JWTDTO() {

        }

        public JWTDTO(string Token){
            this.Token = Token;
        }
    }
}
