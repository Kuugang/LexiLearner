using System.ComponentModel.DataAnnotations.Schema;

namespace LexiLearner.Models.DTO
{
  public class MinigameLogDTO
  {
    public required Guid Id { get; set; };
    public required Guid MinigameId { get; set; }
    public required Guid PupilId { get; set; }
    public required string Result { get; set; }
    public DateTime CreatedAt { get; set; }

    public class Create
    {
      public required Guid PupilId { get; set; }
      public required Guid MinigameId { get; set;  }
      public required int Duration { get; set; }
      public required int Score { get; set; }
      public class WordsFromLetters : Create
      {
        public required List<string> correctAnswers { get; set; }
        public required List<string> incorrectAnswers { get; set; }
        public required int streak { get; set; }
      }

      public class WordHunt : Create
      {
        public required List<string> wordsFound { get; set; }
        public required List<string> incorrectAttempts { get; set; }
        public required int streak { get; set; }
      }

      public class FillInTheBlanks : Create
      {
        public required List<List<string>> answers { get; set; }
        public required int streak { get; set; }
      }

      public class SentenceRearrangement : Create
      {
        public required List<List<int>> answers { get; set; }
      }

      public class TwoTruthsOneLie : Create
      {
        public required List<string> roundResults { get; set; }
        public required int streak { get; set; }
      }
    }
  }
}
