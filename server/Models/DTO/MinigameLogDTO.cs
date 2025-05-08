using System.Text.Json;
using System.Text.Json.Serialization;

namespace LexiLearner.Models.DTO
{
    public class MinigameLogDTO
    {
        public Guid Id { get; set; }
        public Guid MinigameId { get; set; }
        public Guid PupilId { get; set; }
        public JsonElement Result { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid ReadingSessionId { get; set; }

        public MinigameLogDTO() { }
        public MinigameLogDTO(MinigameLog minigameLog)
        {
            Id = minigameLog.Id;
            MinigameId = minigameLog.MinigameId;
            PupilId = minigameLog.PupilId;
            Result = JsonSerializer.Deserialize<JsonElement>(minigameLog.Result);
            CreatedAt = minigameLog.CreatedAt;
            ReadingSessionId = minigameLog.ReadingSessionId;
        }

        public class Create
        {
            [JsonIgnore]
            public Guid PupilId { get; set; }

            [JsonPropertyName("PupilId")]
            public required Guid PupilIdSetter
            {
                set => PupilId = value;
            }

            [JsonIgnore]
            public Guid MinigameId { get; set; }
            [JsonPropertyName("MinigameId")]
            public required Guid MinigameIdSetter
            {
                set => MinigameId = value;
            }

            [JsonIgnore]
            public Guid ReadingSessionId { get; set; }
            [JsonPropertyName("ReadingSessionId")]
            public required Guid ReadingSessionIdSetter
            {
                set => ReadingSessionId = value;
            }
            public required int duration { get; set; }
            public required int score { get; set; }
        }

        public class WordsFromLettersLog : MinigameLogDTO.Create
        {
            public required List<string> correctAnswers { get; set; }
            public required List<string> incorrectAnswers { get; set; }
            public required int streak { get; set; }
        }

        public class WordHuntLog : MinigameLogDTO.Create
        {
            public required List<string> wordsFound { get; set; }
            public required List<string> incorrectAttempts { get; set; }
            public required int streak { get; set; }
        }

        public class FillInTheBlanksLog : MinigameLogDTO.Create
        {
            public required List<List<string>> answers { get; set; }
            public required int streak { get; set; }
        }

        public class SentenceRearrangementLog : MinigameLogDTO.Create
        {
            public required List<List<int>> answers { get; set; }
        }

        public class TwoTruthsOneLieLog : MinigameLogDTO.Create
        {
            public required List<string> roundResults { get; set; }
            public required int streak { get; set; }
        }
    }
}
