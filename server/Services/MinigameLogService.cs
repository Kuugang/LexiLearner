using System.Text.Json;
using LexiLearner.Exceptions;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Services
{
  public class MinigameLogService : IMinigameLogService
  {
    private readonly IMinigameRepository _minigameRepository;
    private readonly IMinigameLogRepository _minigameLogRepository;
    private readonly IPupilService _pupilService;
    public MinigameLogService(IMinigameRepository minigameRepository, IMinigameLogRepository minigameLogRepository, IPupilService pupilService)
    {
      _minigameRepository = minigameRepository;
      _minigameLogRepository = minigameLogRepository;
      _pupilService = pupilService;
    }
    public async Task<MinigameLogDTO> Create(MinigameType minigameType, MinigameLogDTO.Create request)
    {
      var pupilid = request.PupilId;
      var pupil = await _pupilService.GetPupilById(pupilid);

      if (pupil == null) {
        throw new ApplicationExceptionBase(
            $"Pupil with id = {pupilid} not found.",
            "MinigameLog creation failed.",
            StatusCodes.Status404NotFound
          );
      }

      var minigameid = request.MinigameId;
      var minigame = await _minigameRepository.GetMinigameById(minigameid);
      if (minigame == null) {
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

      return new MinigameLogDTO(await _minigameLogRepository.Create(minigameLog));
    }

    public async Task<MinigameLogDTO> GetMinigameLogById(Guid id)
    {
      var minigameLog = await _minigameLogRepository.GetMinigameLogById(id);
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
      var minigamelogs = await _minigameLogRepository.GetMinigameLogs();
      return minigamelogs.Select(mgl => new MinigameLogDTO(mgl)).ToList();
    }

    public async Task<List<MinigameLogDTO>> GetMinigameLogsByRMId(Guid readingMatId)
    {
      var minigamelogs = await _minigameLogRepository.GetMinigamesByRMId(readingMatId);
      return minigamelogs.Select(mgl => new MinigameLogDTO(mgl)).ToList();
    }
  }
}
