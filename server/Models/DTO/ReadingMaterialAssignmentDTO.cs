namespace LexiLearner.Models.DTO
{
    public class ReadingMaterialAssignmentDTO
    {
        public Guid Id { get; set; }
        public Guid ClassroomId { get; set; }
        public Guid ReadingMaterialId { get; set; }
        public Guid MinigameId { get; set; }
        public MinigameType MinigameType { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Cover { get; set; }
        
        public ReadingMaterialAssignmentDTO(ReadingMaterialAssignment ReadingMaterialAssignment)
        {
            Id = ReadingMaterialAssignment.Id;
            ClassroomId = ReadingMaterialAssignment.ClassroomId;
            ReadingMaterialId = ReadingMaterialAssignment.ReadingMaterialId;
            MinigameId = ReadingMaterialAssignment.MinigameId;
            Title = ReadingMaterialAssignment.Title;
            Description = ReadingMaterialAssignment.Description;
            IsActive = ReadingMaterialAssignment.IsActive;
            CreatedAt = ReadingMaterialAssignment.CreatedAt;
            UpdatedAt = ReadingMaterialAssignment.UpdatedAt;
            Cover = ReadingMaterialAssignment.ReadingMaterial.Cover;
            MinigameType = ReadingMaterialAssignment.Minigame.MinigameType;
        }
        
        public class Create
        {
            public required MinigameType MinigameType { get; set; }
            public required Guid ReadingMaterialId { get; set; }
            public required string Title { get; set; }
            public required string Description { get; set; }
        }
        
        public class Update
        {
            public MinigameType? MinigameType { get; set; }
            public Guid? ReadingMaterialId { get; set; }
            public string? Title { get; set; }
            public string? Description { get; set; }
            public bool? IsActive { get; set; }
        }
    }
}