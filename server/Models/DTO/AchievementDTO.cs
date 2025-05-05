using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace LexiLearner.Models.DTO {
    public class AchievementDTO {
        public class FromJson {
            [JsonPropertyName("Name")]
            public required string Name {get;set;}
            [JsonPropertyName("Description")]
            public required string Description {get;set;}
            [JsonPropertyName("Badge")]
            public required string Badge {get;set;}
        }

        public class ReadAchievement {
            public string Name {get;set;}
            public string Description {get;set;}
        }

        // public class ReadPupilAchievement {
        //     public 
        // }

        // mga achievements in student (PupilAchievement)
        public class CreatePupilAchievement {
            public required Guid PupilId {get;set;}
            public required Guid AchievementId {get;set;}
        }

    }
}