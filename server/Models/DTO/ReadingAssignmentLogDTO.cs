namespace LexiLearner.Models.DTO
{
    public class ReadingAssignmentLogDTO
    {
        public Guid Id { get; set; }
        public Guid ReadingMaterialAssignmentId { get; set; }
        public Guid MinigameLogId { get; set; }
        public string Result { get; set; }
        public DateTime CompletedAt { get; set; }

        public ReadingAssignmentLogDTO() { }
        public ReadingAssignmentLogDTO(ReadingAssignmentLog readingAssignmentLog)
        {
            Id = readingAssignmentLog.Id;
            ReadingMaterialAssignmentId = readingAssignmentLog.ReadingMaterialAssignmentId;
            MinigameLogId = readingAssignmentLog.MinigameLogId;
            Result = readingAssignmentLog.MinigameLog.Result;
            CompletedAt = readingAssignmentLog.CompletedAt;
        }
    }
}