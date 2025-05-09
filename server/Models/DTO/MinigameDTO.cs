using System.Text.Json.Serialization;

namespace LexiLearner.Models.DTO
{
    public class MinigameDTO
    {
        public Guid Id { get; set; }
        public MinigameType MinigameType { get; set; }
        public string MetaData { get; set; }
        public int MaxScore { get; set; }

        public MinigameDTO() { }

        public MinigameDTO(Minigame minigame)
        {
            Id = minigame.Id;
            MinigameType = minigame.MinigameType;
            MetaData = minigame.MetaData;
            MaxScore = minigame.MaxScore;
        }


        public abstract class Create
        {
            [JsonIgnore]
            public Guid ReadingMaterialId { get; set; }

            [JsonPropertyName("ReadingMaterialId")]
            public required Guid ReadingMaterialSetter
            {
                set => ReadingMaterialId = value;
            }

            public required int MaxScore { get; set; }
        }
        public class WordsFromLettersGame : MinigameDTO.Create
        {
            //public MinigameType MinigameType { get; set; } = MinigameType.WordsFromLetters;
            public required List<string> letters { get; set; }
            public required List<string> words { get; set; }
        }

        public class WordHuntGame : MinigameDTO.Create
        {
            //public MinigameType MinigameType { get; set; } = MinigameType.WordHunt;
            public required List<string> correct { get; set; }
            public required List<string> wrong { get; set; }
            public List<string> combined { get; set; }
        }


        public class FillInTheBlanksGame : MinigameDTO.Create
        {
            //public MinigameType MinigameType { get; set; } = MinigameType.FillInTheBlanks;
            public required string question { get; set; }
            public required string correctAnswer { get; set; }
            public required List<string> choices { get; set; }
            public required List<string> explanation { get; set; }
        }

        public class SentenceRearrangementGame : MinigameDTO.Create
        {
            //public MinigameType MinigameType { get; set; } = MinigameType.SentenceRearrangement;
            public required List<string> correctAnswer { get; set; }
            public required List<string> parts { get; set; }
            public required string explanation { get; set; }
        }

        public class TwoTruthsOneLieGame : MinigameDTO.Create
        {
            //public MinigameType MinigameType { get; set; } = MinigameType.TwoTruthsOneLie;
            public required List<TwoTruthsOneLieChoiceObj> choices { get; set; }
            public required string explanation { get; set; }
        }

        public class TwoTruthsOneLieChoiceObj
        {
            public required string choice { get; set; }
            public required bool answer { get; set; }
        }
    }
}
