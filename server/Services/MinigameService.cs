using System.Text.Json;
using LexiLearner.Exceptions;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using Org.BouncyCastle.Crypto.Generators;

namespace LexiLearner.Services
{
    public class MinigameService : IMinigameService
    {
        private readonly IMinigameRepository _minigameRepository;
        private readonly IReadingMaterialService _readingMaterialService;
        private readonly IReadingMaterialRepository _readingMaterialRepository;
        private readonly IPupilService _pupilService;
        private readonly IReadingSessionService _readingSessionService;
        private readonly IUserService _userService;
        private readonly IAchievementService _achievementService;
        private readonly Random _random;
        public MinigameService(IMinigameRepository minigameRepository, IReadingMaterialService readingMaterialService, IReadingMaterialRepository readingMaterialRepository, IPupilService pupilService, IReadingSessionService readingSessionService, IUserService userService, IAchievementService achievementService)
        {
            _minigameRepository = minigameRepository;
            _readingMaterialService = readingMaterialService;
            _readingMaterialRepository = readingMaterialRepository;
            _pupilService = pupilService;
            _readingSessionService = readingSessionService;
            _userService = userService;
            _achievementService = achievementService;
            _random = new Random();
        }
        public async Task<MinigameDTO> Create(MinigameType minigameType, MinigameDTO.Create request)
        {
            var readingMaterialId = request.ReadingMaterialId;
            Console.WriteLine("minigame request: " + readingMaterialId);

            // fetch readingmaterial
            var readingMaterial = await _readingMaterialService.GetById(readingMaterialId);

            if (readingMaterial == null)
            {
                throw new ApplicationExceptionBase(
                  "ReadingMaterial not found.", "Minigame creation failed.", StatusCodes.Status404NotFound);
            }

            var jsonOptions = new JsonSerializerOptions { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            string metadata = JsonSerializer.Serialize(request, request.GetType(), jsonOptions);

            int maxScore = GetMaxScore(minigameType, request);
            var minigame = new Minigame
            {
                ReadingMaterialId = readingMaterialId,
                ReadingMaterial = readingMaterial,
                MinigameType = minigameType,
                MetaData = metadata,
                MaxScore = maxScore
            };

            return new MinigameDTO(await _minigameRepository.Create(minigame));
        }

        public async Task<MinigameDTO> GetMinigameById(Guid id)
        {
            var minigame = await _minigameRepository.GetMinigameById(id);
            if (minigame == null)
            {
                throw new ApplicationExceptionBase(
                  "Minigame not found.",
                  $"Minigame with id {id} is not found.",
                  StatusCodes.Status404NotFound);
            }

            return new MinigameDTO(minigame);
        }

        public async Task<List<MinigameDTO>> GetMinigames()
        {
            var minigames = await _minigameRepository.GetMinigames();
            return minigames.Select(mg => new MinigameDTO(mg)).ToList();
        }

        public async Task<List<MinigameDTO>> GetMinigamesByRMId(Guid readingMatId)
        {
            var minigames = await _minigameRepository.GetMinigamesByRMId(readingMatId);
            return minigames.Select(mg => new MinigameDTO(mg)).ToList();
        }

        public async Task<MinigameLogDTO> Create(MinigameType minigameType, MinigameLogDTO request)
        {
            var pupilid = request.PupilId;
            var pupil = await _pupilService.GetPupilById(pupilid);

            if (pupil == null)
            {
                throw new ApplicationExceptionBase(
                    $"Pupil with id = {pupilid} not found.",
                    "MinigameLog creation failed.",
                    StatusCodes.Status404NotFound
                  );
            }

            var minigameid = request.MinigameId;
            var minigame = await _minigameRepository.GetMinigameById(minigameid);
            if (minigame == null)
            {
                throw new ApplicationExceptionBase(
                    $"Minigame with id = {minigameid} not found.",
                    "MinigameLog creation failed.",
                    StatusCodes.Status404NotFound
                  );
            }

            var readingSessionId = request.ReadingSessionId;
            var readingSession = await _readingSessionService.GetReadingSessionById(readingSessionId);

            if (readingSession == null)
            {
                throw new ApplicationExceptionBase(
                  $"ReadingSession with id = {readingSessionId} not found.",
                  "MinigameLog creation failed.",
                  StatusCodes.Status404NotFound
                );
            }

            var minigameLog = new MinigameLog
            {
                Minigame = minigame,
                MinigameId = minigameid,
                ReadingSessionId = readingSessionId,
                ReadingSession = readingSession,
                Pupil = pupil,
                PupilId = pupilid,
                Result = JsonSerializer.Serialize(request.Result),
            };

            return new MinigameLogDTO(await _minigameRepository.Create(minigameLog));
        }

        public async Task<MinigameLogDTO> GetMinigameLogById(Guid id)
        {
            var minigameLog = await _minigameRepository.GetMinigameLogById(id);
            if (minigameLog == null)
            {
                throw new ApplicationExceptionBase(
                  "MinigameLog not found.",
                  $"MinigameLog with id = {id} not found.",
                  StatusCodes.Status404NotFound
                );
            }

            return new MinigameLogDTO(minigameLog);
        }

        public async Task<List<MinigameLogDTO>> GetMinigameLogs()
        {
            var minigamelogs = await _minigameRepository.GetMinigameLogs();
            return minigamelogs.Select(mgl => new MinigameLogDTO(mgl)).ToList();
        }

        public async Task<List<MinigameLogDTO>> GetMinigameLogsByRMId(Guid readingMatId)
        {
            var minigamelogs = await _minigameRepository.GetMinigameLogsByRMId(readingMatId);
            return minigamelogs.Select(mgl => new MinigameLogDTO(mgl)).ToList();
        }

        public async Task<List<MinigameLog>> GetMinigameLogByReadingSessionId(Guid SessionId)
        {
            return await _minigameRepository.GetMinigameLogByReadingSessionId(SessionId);
        }


        public async Task<CompleteReadingSessionDTO> Complete(Guid SessionId)
        {
            var ReadingSession = await _readingSessionService.GetReadingSessionById(SessionId);

            if (ReadingSession == null)
            {
                throw new ApplicationExceptionBase(
                  "ReadingMaterial not found.", "Minigame creation failed.", StatusCodes.Status404NotFound);
            }


            var Logs = await GetMinigameLogByReadingSessionId(SessionId);

            int TotalScore = 0;
            int TotalMaxScore = 0;

            foreach (var log in Logs)
            {
                TotalMaxScore += log.Minigame.MaxScore;
                if (!string.IsNullOrEmpty(log.Result))
                {
                    var outerJsonElement = JsonSerializer.Deserialize<JsonElement>(log.Result);

                    if (outerJsonElement.ValueKind == JsonValueKind.String)
                    {
                        var innerJson = outerJsonElement.GetString();
                        var resultJson = JsonSerializer.Deserialize<JsonElement>(innerJson);

                        if (resultJson.TryGetProperty("score", out var scoreElement) &&
                            scoreElement.TryGetInt32(out var parsedScore))
                        {
                            TotalScore += parsedScore;
                        }
                    }
                }
            }

            float ScorePercent = (float)TotalScore / TotalMaxScore;
            // Console.WriteLine("Total Score: " + TotalScore);
            // Console.WriteLine("Total Max Score: " + TotalMaxScore);
            // Console.WriteLine("Percent: " + ((float)TotalScore / TotalMaxScore));

            double MinigamePerformanceMultiplier = 0;
            if (ScorePercent == 1) MinigamePerformanceMultiplier = 1.5;
            else if (ScorePercent >= 0.8) MinigamePerformanceMultiplier = 1.25;
            else if (ScorePercent >= 0.6) MinigamePerformanceMultiplier = 1;
            else if (ScorePercent >= 0.4) MinigamePerformanceMultiplier = .75;
            else if (ScorePercent >= 0.2) MinigamePerformanceMultiplier = .5;
            else if (ScorePercent >= 0.05) MinigamePerformanceMultiplier = .25;
            else if (ScorePercent >= 0) MinigamePerformanceMultiplier = .1;


            int BasePoints = 0;

            if (ReadingSession.ReadingMaterial.Difficulty >= 90) BasePoints = 10;
            else if (ReadingSession.ReadingMaterial.Difficulty >= 80) BasePoints = 15;
            else if (ReadingSession.ReadingMaterial.Difficulty >= 70) BasePoints = 20;
            else if (ReadingSession.ReadingMaterial.Difficulty >= 60) BasePoints = 30;
            else if (ReadingSession.ReadingMaterial.Difficulty >= 50) BasePoints = 45;
            else if (ReadingSession.ReadingMaterial.Difficulty >= 30) BasePoints = 60;
            else if (ReadingSession.ReadingMaterial.Difficulty >= 10) BasePoints = 80;
            else if (ReadingSession.ReadingMaterial.Difficulty >= 0) BasePoints = 100;

            var ReadingSessions = await _readingSessionService.GetReadingSessionByReadingMaterialId(ReadingSession.ReadingMaterialId);

            double NumSessionsMultiplier = 0;
            if (ReadingSessions.Count > 4) NumSessionsMultiplier = 0.1;
            if (ReadingSessions.Count == 3) NumSessionsMultiplier = 0.25;
            if (ReadingSessions.Count == 2) NumSessionsMultiplier = 0.5;
            if (ReadingSessions.Count == 1) NumSessionsMultiplier = 1;
            // Console.WriteLine("Base Points: " + BasePoints);
            // Console.WriteLine("NumSessionsMultiplier: " + NumSessionsMultiplier);
            // Console.WriteLine("MinigamePerformanceMultiplier: " + MinigamePerformanceMultiplier);
            int FinalScore = Convert.ToInt32(BasePoints * NumSessionsMultiplier + (TotalScore * MinigamePerformanceMultiplier));
            Pupil Pupil = ReadingSession.Pupil;
            Pupil.Level += FinalScore;
            await _minigameRepository.Complete(Pupil);

            var newAchievements = await _achievementService.AddBooksReadAchievement(Pupil);
            var recommendations = await _readingMaterialRepository.GetRecommendations(Pupil.Id, 1);

            return new CompleteReadingSessionDTO
            {
                Recommendations = recommendations,
                Achievements = newAchievements,
                Level = Pupil.Level,
            };
        }
        
        public async Task<List<MinigameDTO>> GetRandomMinigamesByRMId(Guid readingMaterialId)
        {
            var minigames = await _minigameRepository.GetMinigamesByRMId(readingMaterialId);

            if (minigames == null || !minigames.Any())
            {
                throw new ApplicationExceptionBase(
                    "No minigames found for reading material.",
                    "Fetching minigames for the reading material failed.",
                    StatusCodes.Status404NotFound
                );
            }
            
            minigames = minigames
                .GroupBy(m => m.MinigameType)
                .OrderBy(_ => _random.Next())
                .Take(Math.Min(3, minigames.GroupBy(m => m.MinigameType).Count()))
                .Select(group =>
                {
                    var minigamesOfType = group.ToList();
                    return minigamesOfType[_random.Next(minigamesOfType.Count)];
                })
                .ToList();

            return minigames.Select(mg => new MinigameDTO(mg)).ToList();
        }

        public async Task<List<MinigameDTO>> GetRandomMinigames(Guid readingSessionId)
        {
            var readingSession = await _readingSessionService.GetReadingSessionById(readingSessionId);

            if (readingSession == null)
            {
                throw new ApplicationExceptionBase(
                    "Reading Session not found.",
                    "Fetching minigames for the reading session failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var minigames = await _minigameRepository.GetMinigamesByRMId(readingSession.ReadingMaterialId);

            if (minigames == null || !minigames.Any())
            {
                throw new ApplicationExceptionBase(
                    "No minigames found for reading material.",
                    "Fetching minigames for the reading session failed.",
                    StatusCodes.Status404NotFound
                );
            }
            
            // --- Adaptive Section Start ---
            var averageScoreDict = await _minigameRepository.GetAvgNormalizedScoreByType(readingSession.PupilId, readingSession.ReadingMaterialId);
            
            foreach (MinigameType type in Enum.GetValues(typeof(MinigameType)))
            {
                if (!averageScoreDict.ContainsKey(type))
                {
                    averageScoreDict[type] = 0.0;
                }
            }
            
            // getting the 3 weakest types
            var weakTypes = averageScoreDict
                .OrderBy(kvp => kvp.Value)
                .Take(3)
                .Select(kvp => kvp.Key)
                .ToList();        

            // pick minigames of weak types, fill up to 3 with random others if needed
            var selectedMinigames = minigames
                .Where(mg => weakTypes.Contains(mg.MinigameType))
                .GroupBy(mg => mg.MinigameType)
                .Select(group => group.OrderBy(_ => _random.Next()).First())
                .ToList();


            if (selectedMinigames.Count < 3)
            {
                var remaining = minigames
                    .Where(mg => !selectedMinigames.Any(sel => sel.MinigameType == mg.MinigameType))
                    .GroupBy(mg => mg.MinigameType)
                    .Select(group => group.OrderBy(_ => _random.Next()).First())
                    .ToList();

                selectedMinigames.AddRange(remaining.Take(3 - selectedMinigames.Count));
            }
            // // getting 3 minigames with distinct types
            // minigames = minigames
            //     .GroupBy(m => m.MinigameType)
            //     .OrderBy(_ => _random.Next())
            //     .Take(Math.Min(3, minigames.GroupBy(m => m.MinigameType).Count()))
            //     .Select(group =>
            //     {
            //         var minigamesOfType = group.ToList();
            //         return minigamesOfType[_random.Next(minigamesOfType.Count)];
            //     })
            //     .ToList();

            return selectedMinigames.Select(mg => new MinigameDTO(mg)).ToList();
        }

        private static int GetMaxScore(MinigameType type, MinigameDTO.Create request)
        {
            switch (type)
            {
                case MinigameType.FillInTheBlanks:
                case MinigameType.SentenceRearrangement:
                case MinigameType.TwoTruthsOneLie:
                    return 1;
                case MinigameType.WordsFromLetters:
                    return ((MinigameDTO.WordsFromLettersGame)request).words.Count;
                case MinigameType.WordHunt:
                    return ((MinigameDTO.WordHuntGame)request).correct.Count;
            }

            return 0;
        }
        
        
        public async Task<List<MinigameDTO>> GetMinigamesByRMIdAndType(Guid readingMaterialId, MinigameType minigameType)
        {
            var minigames = await _minigameRepository.GetMinigamesByRMIdAndType(readingMaterialId, minigameType);
            if (minigames == null)
            {
                throw new ApplicationExceptionBase(
                  "Minigames not found.",
                  $"Minigames with id {readingMaterialId} is not found.",
                  StatusCodes.Status404NotFound);
            }

            return minigames.Select(mg => new MinigameDTO(mg)).ToList();
        }

        public async Task<MinigameLogDTO> GetMinigameLogByMIdRSId(Guid ReadingSessionId, Guid MinigameId)
        {
            var minigamelog = await _minigameRepository.GetMinigameLogByMIdRSId(ReadingSessionId, MinigameId);
            
            if (minigamelog == null)
            {
                throw new ApplicationExceptionBase(
                  "Minigamelog not found.",
                  "Failed to fetch minigamelog.",
                  StatusCodes.Status404NotFound);
            }

            return new MinigameLogDTO(minigamelog);
        }
    }
}
