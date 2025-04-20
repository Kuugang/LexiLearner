using System.Reflection;
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
    public MinigameService(IMinigameRepository minigameRepository, IReadingMaterialService readingMaterialService)
    {
      _minigameRepository = minigameRepository;
      _readingMaterialService = readingMaterialService;
    }
    public async Task<MinigameDTO> Create(MinigameType minigameType, MinigameDTO.Create request)
    {
      var readingMaterialId = request.ReadingMaterialId;
      Console.WriteLine("minigame request: " + readingMaterialId);

      // fetch readingmaterial
      var readingMaterial = await _readingMaterialService.GetById(readingMaterialId);

      if (readingMaterial == null) {
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
  }
}
