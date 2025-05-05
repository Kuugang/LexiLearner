using LexiLearner.Models.DTO;

namespace LexiLearner.Data.DTO
{
    // minigames
    public class WordsFromLettersGame
    {
        public required List<string> letters { get; set; }
        public required List<string> words { get; set; }
    }

    public class WordHuntGame
    {
        public required List<string> correct { get; set; }
        public required List<string> wrong { get; set; }
        public List<string> combined { get; set; }
    }


    public class FillInTheBlanksGame
    {
        public required string question { get; set; }
        public required string correctAnswer { get; set; }
        public required List<string> choices { get; set; }
        public required List<string> explanation { get; set; }
    }

    public class SentenceRearrangementGame
    {
        public required List<string> correctAnswer { get; set; }
        public required List<string> parts { get; set; }
        public required string explanation { get; set; }
    }

    public class TwoTruthsOneLieGame
    {
        public required List<MinigameDTO.TwoTruthsOneLieChoiceObj> choices { get; set; }
        public required string explanation { get; set; }
    }
    
    public class JsonMinigame
    {
        public required List<WordsFromLettersGame> WordsFromLetters { get; set; }
        public required List<FillInTheBlanksGame> FillInTheBlanks { get; set; }
        public required List<SentenceRearrangementGame> SentenceRearrangement { get; set; }
        public required List<WordHuntGame> WordHunt { get; set; }
        public required List<TwoTruthsOneLieGame> TwoTruthsOneLie { get; set; }
    }
}