using System.Text.Json;
using LexiLearner.Exceptions;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Services
{
    public class MinigameService : IMinigameService
    {
        private readonly IMinigameRepository _minigameRepository;
        private readonly IReadingMaterialService _readingMaterialService;
        private readonly IPupilService _pupilService;
        private readonly IReadingSessionService _readingSessionService;
        public MinigameService(IMinigameRepository minigameRepository, IReadingMaterialService readingMaterialService, IPupilService pupilService, IReadingSessionService readingSessionService)
        {
            _minigameRepository = minigameRepository;
            _readingMaterialService = readingMaterialService;
            _pupilService = pupilService;
            _readingSessionService = readingSessionService;
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

            var minigame = new Minigame
            {
                ReadingMaterialId = readingMaterialId,
                ReadingMaterial = readingMaterial,
                MinigameType = minigameType,
                MetaData = metadata
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

        public async Task<MinigameLogDTO> Create(MinigameType minigameType, MinigameLogDTO.Create request)
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

            string result = JsonSerializer.Serialize(request, request.GetType(), new JsonSerializerOptions { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

            var minigameLog = new MinigameLog
            {
                Minigame = minigame,
                MinigameId = minigameid,

                //TODO: THIS ONE
                ReadingSessionId = Guid.NewGuid(),
                ReadingSession = null,

                Pupil = pupil,
                PupilId = pupilid,
                Result = result,
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


        public async Task Complete(Guid SessionId)
        {
            var ReadingSession = await _readingSessionService.GetReadingSessionById(SessionId);

            if (ReadingSession == null)
            {
                throw new ApplicationExceptionBase(
                  "ReadingMaterial not found.", "Minigame creation failed.", StatusCodes.Status404NotFound);
            }


            var Logs = await GetMinigameLogByReadingSessionId(SessionId);
            var Minigames = await GetMinigamesByRMId(ReadingSession.ReadingMaterialId);

            int TotalScore = 0;
            int TotalMaxScore = 0;

            foreach (var minigame in Minigames)
            {
                if (!string.IsNullOrEmpty(minigame.MetaData))
                {
                    // Parse JSON string into a dynamic object using System.Text.Json
                    var MetaData = JsonSerializer.Deserialize<JsonElement>(minigame.MetaData);

                    // Example: Access a field called "score"
                    if (MetaData.TryGetProperty("maxScore", out var maxScore))
                    {
                        TotalMaxScore += maxScore.GetInt32();
                    }
                }
            }

            foreach (var log in Logs)
            {
                if (!string.IsNullOrEmpty(log.Result))
                {
                    var resultJson = JsonSerializer.Deserialize<JsonElement>(log.Result);

                    if (resultJson.TryGetProperty("score", out var resultScore))
                    {
                        TotalScore += resultScore.GetInt32();
                    }
                }
            }

            float ScorePercent = TotalScore / TotalScore;

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

            int FinalScore = Convert.ToInt32(BasePoints * NumSessionsMultiplier * MinigamePerformanceMultiplier);
            Pupil Pupil = ReadingSession.Pupil;
            Pupil.Level += FinalScore;
            await _minigameRepository.Complete(Pupil);
        }
    }
}
