using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models
{

    public enum MinigameType
    {
        WordsFromLetters,
        FillInTheBlanks,
        SentenceRearrangement,
        WordHunt,
        TwoTruthsOneLie,
    }

    public class Minigame
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required Guid ReadingMaterialId { get; set; }
        [ForeignKey("ReadingMaterialId")]
        public required ReadingMaterial ReadingMaterial { get; set; }

        public required MinigameType MinigameType { get; set; }

        public required String MetaData { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
