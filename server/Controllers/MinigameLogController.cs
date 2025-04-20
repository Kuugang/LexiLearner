
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace LexiLearner.Controllers
{
  [Route("api/minigamelog")]
  [ApiController]
  public class MinigameLogController : ControllerBase
  {
    private readonly IMinigameLogService _minigameLogService;
    public MinigameLogController(IMinigameLogService minigameLogService)
    {
      _minigameLogService = minigameLogService;
    }

    [HttpPost("wordhunt")]
    public async Task<IActionResult> CreateLogWordHunt([FromBody] MinigameLogDTO.WordHuntLog request)
    {
      var minigamelog = await _minigameLogService.Create(MinigameType.WordHunt, request);
      return StatusCode(StatusCodes.Status201Created,
        new SuccessResponseDTO("WordHunt minigame log created successfully.", minigamelog));
    }

    [HttpPost("wordsfromletters")]
    public async Task<IActionResult> CreateLogWordsFromLetters([FromBody] MinigameLogDTO.WordsFromLettersLog request)
    {
      var minigamelog = await _minigameLogService.Create(MinigameType.WordsFromLetters, request);
      return StatusCode(StatusCodes.Status201Created,
        new SuccessResponseDTO("WordsFromLetters minigame log created successfully.", minigamelog));
    }

    [HttpPost("fillintheblanks")]
    public async Task<IActionResult> CreateLogFillInTheBlanks([FromBody] MinigameLogDTO.FillInTheBlanksLog request)
    {
      var minigamelog = await _minigameLogService.Create(MinigameType.FillInTheBlanks, request);
      return StatusCode(StatusCodes.Status201Created,
        new SuccessResponseDTO("FillInTheBlanks minigame log created successfully.", minigamelog));
    }

    [HttpPost("twotruthsonelie")]
    public async Task<IActionResult> CreateLogTwoTruthsOneLie([FromBody] MinigameLogDTO.TwoTruthsOneLieLog request)
    {
      var minigamelog = await _minigameLogService.Create(MinigameType.TwoTruthsOneLie, request);
      return StatusCode(StatusCodes.Status201Created,
        new SuccessResponseDTO("TwoTruthsOneLie minigame log created successfully.", minigamelog));
    }

    [HttpPost("sentencerearrangement")]
    public async Task<IActionResult> CreateLogSentenceRearrangement([FromBody] MinigameLogDTO.SentenceRearrangementLog request)
    {
      var minigamelog = await _minigameLogService.Create(MinigameType.SentenceRearrangement, request);
      return StatusCode(StatusCodes.Status201Created,
        new SuccessResponseDTO("SentenceRearrangement minigame log created successfully.", minigamelog));
    }

    [HttpGet("{MinigameLogId}")]
    public async Task<IActionResult> GetMinigameLog([FromRoute] Guid MinigameLogId)
    {
      var minigamelog = await _minigameLogService.GetMinigameLogById(MinigameLogId);
      return StatusCode(StatusCodes.Status200OK,
        new SuccessResponseDTO("Minigame log found.", minigamelog));
    }
    
    [HttpGet("")]
    public async Task<IActionResult> GetMinigameLogs()
    {
      var minigamelogs = await _minigameLogService.GetMinigameLogs();
      return StatusCode(StatusCodes.Status200OK,
        new SuccessResponseDTO("Minigames found.", minigamelogs)
      );
    }
  }
}
