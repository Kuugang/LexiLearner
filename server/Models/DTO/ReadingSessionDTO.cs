namespace LexiLearner.Models.DTO
{
    public class ReadingSessionDTO
    {
        public Guid Id { set; get; } = Guid.NewGuid();
        public Guid PupilId { get; set; }
        public Guid ReadingMaterialId { get; set; }
        public float CompletionPercentage { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime CompletedAt { get; set; }

        public ReadingSessionDTO(ReadingSession readingSession)
        {
            Id = readingSession.Id;
            PupilId = readingSession.PupilId;
            ReadingMaterialId = readingSession.ReadingMaterialId;
            CompletionPercentage = readingSession.CompletionPercentage;
            StartedAt = readingSession.StartedAt;
            CompletedAt = readingSession.CompletedAt;
        }

        public class Update
        {
            public float? CompletionPercentage {  get; set; }
            public DateTime? CompletedAt { get; set; }

        }
    }
}