namespace LexiLearn.Models.DTO
{
    public enum Providers 
    {
        Google,
        Facebook,
    }

    public class TokenAuthDTO
    {
        public Providers Provider { get; set; }
        public string Token { get; set; }
    }
}

