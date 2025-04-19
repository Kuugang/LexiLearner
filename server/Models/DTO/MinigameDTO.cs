using StackExchange.Redis;

namespace LexiLearner.Models.DTO
{
  public class MinigameDTO
  {
    public Guid Id { get; set; }
    public MinigameType MinigameType { get; set; }
    public string MetaData { get; set; }
    public class TwoTruthsOneLieChoiceObj
    {
      public required string choice { get; set; }
      public required Boolean answer { get; set; }
    }
    public class Create {
      //public required MinigameType MinigameType { get; set; }
      public required Guid ReadingMaterialId { get; set; }
      public class WordsFromLetters : Create
      {
        //public MinigameType MinigameType { get; set; } = MinigameType.WordsFromLetters;
        public required List<string> letters { get; set; }
        public required List<string> words { get; set; }
      }

      public class WordHunt : Create
      {
        //public MinigameType MinigameType { get; set; } = MinigameType.WordHunt;
        public required List<string> correct {  get; set; }
        public required List<string> wrong { get; set; }
        public List<string> combined { get; set; } 
      }


      public class FillInTheBlanks : Create
      {
        //public MinigameType MinigameType { get; set; } = MinigameType.FillInTheBlanks;
        public required List<string> phrases { get; set; }
        public required string correctAnswer { get; set; }
        public required List<string> choices { get; set; }
      }

      public class SentenceRearrangement : Create
      {
        //public MinigameType MinigameType { get; set; } = MinigameType.SentenceRearrangement;
        public required List<string> correctAnswer { get; set; }
        public required List<string> parts { get; set; }
      }

      public class TwoTruthsOneLie : Create
      {
        //public MinigameType MinigameType { get; set; } = MinigameType.TwoTruthsOneLie;
        public List<TwoTruthsOneLieChoiceObj> choices { get; set; }
      }
    }
  }
}
