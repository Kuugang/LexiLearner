namespace LexiLearner.Models.DTO
{
    public class CompleteReadingSessionDTO
    {
        public List<PupilAchievement>? Achievements { get; set; }
        public List<ReadingMaterial>? Recommendations { get; set; }
        public int Level { get; set; }
    }
}
