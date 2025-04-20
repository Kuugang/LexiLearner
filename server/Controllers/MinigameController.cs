using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace LexiLearner.Controllers
{
  [Route("api/minigame")]
  [ApiController]
  public class MinigameController : ControllerBase
  {
    private readonly IMinigameService _minigameService;
    public MinigameController(IMinigameService minigameService)
    {
      _minigameService = minigameService;
    }

    [HttpPost("new/wordhunt")]
    public async Task<IActionResult> CreateWordHunt([FromBody] MinigameDTO.WordHuntGame request)
    {
      var minigame = await _minigameService.Create(MinigameType.WordHunt, request);
      return StatusCode(StatusCodes.Status201Created, 
        new SuccessResponseDTO("WordHunt minigame created successfully.", minigame));
    }

    [HttpPost("new/wordsfromletters")]
    public async Task<IActionResult> CreateWordsFromLetters([FromBody] MinigameDTO.WordsFromLettersGame request)
    {
      var minigame = await _minigameService.Create(MinigameType.WordsFromLetters, request);
      return StatusCode(StatusCodes.Status201Created,
        new SuccessResponseDTO("WordsFromLetters minigame created successfully.", minigame));
    }

    [HttpPost("new/fillintheblanks")]
    public async Task<IActionResult> CreateFillInTheBlanks([FromBody] MinigameDTO.FillInTheBlanksGame request)
    {
      var minigame = await _minigameService.Create(MinigameType.FillInTheBlanks, request);
      return StatusCode(StatusCodes.Status201Created,
        new SuccessResponseDTO("FillInTheBlanks minigame created successfully.", minigame));
    }

    [HttpPost("new/twotruthsonelie")]
    public async Task<IActionResult> CreateTwoTruthsOneLie([FromBody] MinigameDTO.TwoTruthsOneLieGame request)
    {
      var minigame = await _minigameService.Create(MinigameType.TwoTruthsOneLie, request);
      return StatusCode(StatusCodes.Status201Created,
        new SuccessResponseDTO("TwoTruthsOneLie minigame created successfully.", minigame));
    }

    [HttpPost("new/sentencerearrangement")]
    public async Task<IActionResult> CreateSentenceRearrangement([FromBody] MinigameDTO.SentenceRearrangementGame request)
    {
      var minigame = await _minigameService.Create(MinigameType.SentenceRearrangement, request);
      return StatusCode(StatusCodes.Status201Created,
        new SuccessResponseDTO("SentenceRearrangement minigame created successfully.", minigame));
    }

    [HttpGet("{MinigameId}")]
    public async Task<IActionResult> GetMinigame([FromRoute] Guid MinigameId)
    {
      var minigame = await _minigameService.GetMinigameById(MinigameId);
      return StatusCode(StatusCodes.Status200OK,
        new SuccessResponseDTO("Minigame found.", minigame));
    }
    
    [HttpGet("")]
    public async Task<IActionResult> GetMinigames()
    {
      var minigames = await _minigameService.GetMinigames();
      return StatusCode(StatusCodes.Status200OK,
        new SuccessResponseDTO("Minigames found.", minigames)
      );
    }

  }
}
