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
        public MinigameService(IMinigameRepository minigameRepository, IReadingMaterialService readingMaterialService, IPupilService pupilService)
        {
            _minigameRepository = minigameRepository;
            _readingMaterialService = readingMaterialService;
            _pupilService = pupilService;
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

    }
}
