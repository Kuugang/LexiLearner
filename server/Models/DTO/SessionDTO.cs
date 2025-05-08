namespace LexiLearner.Models.DTO
{
    public class SessionDTO
    {
        public Guid Id { get; set; } = new Guid();
        public string UserId { get; set; }
        public int Duration { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime EndAt { get; set; }
        
        public SessionDTO(Session session)
        {
            Id = session.Id;
            UserId = session.UserId;
            Duration = session.Duration ?? 0;
            CreatedAt = session.CreatedAt;
            EndAt = session.EndAt;
        }
    }
}