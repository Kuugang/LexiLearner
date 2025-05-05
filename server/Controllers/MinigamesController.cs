using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LexiLearner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MinigamesController : ControllerBase
    {
        private readonly IMinigameService _minigameService;
        public MinigamesController(IMinigameService minigameService)
        {
            _minigameService = minigameService;
        }

        [HttpPost("wordhunt")]
        [Authorize("AdminPolicy")]
        public async Task<IActionResult> CreateWordHunt([FromBody] MinigameDTO.WordHuntGame request)
        {
            var minigame = await _minigameService.Create(MinigameType.WordHunt, request);
            return StatusCode(StatusCodes.Status201Created,
              new SuccessResponseDTO("WordHunt minigame created successfully.", minigame));
        }

        [HttpPost("wordsfromletters")]
		[Authorize("AdminPolicy")]
		public async Task<IActionResult> CreateWordsFromLetters([FromBody] MinigameDTO.WordsFromLettersGame request)
        {
            var minigame = await _minigameService.Create(MinigameType.WordsFromLetters, request);
            return StatusCode(StatusCodes.Status201Created,
              new SuccessResponseDTO("WordsFromLetters minigame created successfully.", minigame));
        }

        [HttpPost("fillintheblanks")]
		[Authorize("AdminPolicy")]
		public async Task<IActionResult> CreateFillInTheBlanks([FromBody] MinigameDTO.FillInTheBlanksGame request)
        {
            var minigame = await _minigameService.Create(MinigameType.FillInTheBlanks, request);
            return StatusCode(StatusCodes.Status201Created,
              new SuccessResponseDTO("FillInTheBlanks minigame created successfully.", minigame));
        }

        [HttpPost("twotruthsonelie")]
		[Authorize("AdminPolicy")]
		public async Task<IActionResult> CreateTwoTruthsOneLie([FromBody] MinigameDTO.TwoTruthsOneLieGame request)
        {
            var minigame = await _minigameService.Create(MinigameType.TwoTruthsOneLie, request);
            return StatusCode(StatusCodes.Status201Created,
              new SuccessResponseDTO("TwoTruthsOneLie minigame created successfully.", minigame));
        }

        [HttpPost("sentencerearrangement")]
		[Authorize("AdminPolicy")]
		public async Task<IActionResult> CreateSentenceRearrangement([FromBody] MinigameDTO.SentenceRearrangementGame request)
        {
            var minigame = await _minigameService.Create(MinigameType.SentenceRearrangement, request);
            return StatusCode(StatusCodes.Status201Created,
              new SuccessResponseDTO("SentenceRearrangement minigame created successfully.", minigame));
        }

        [HttpGet("{MinigameId}")]
        [Authorize]
        public async Task<IActionResult> GetMinigame([FromRoute] Guid MinigameId)
        {
            var minigame = await _minigameService.GetMinigameById(MinigameId);
            return StatusCode(StatusCodes.Status200OK,
              new SuccessResponseDTO("Minigame found.", minigame));
        }

        [HttpGet("")]
        [Authorize]
        public async Task<IActionResult> GetMinigames()
        {
            var minigames = await _minigameService.GetMinigames();
            return StatusCode(StatusCodes.Status200OK,
              new SuccessResponseDTO("Minigames found.", minigames)
            );
        }

        [HttpPost("{SessionId}/complete")]
        [Authorize]
        public async Task<IActionResult> Complete([FromRoute] Guid SessionId)
        {
            await _minigameService.Complete(SessionId);
            return StatusCode(StatusCodes.Status200OK,
              new SuccessResponseDTO("Session score recorded successfully.")
            );
        }

        [HttpPost("logs/wordhunt")]
        [Authorize]
        public async Task<IActionResult> CreateLogWordHunt([FromBody] MinigameLogDTO.WordHuntLog request)
        {
            var minigamelog = await _minigameService.Create(MinigameType.WordHunt, request);
            return StatusCode(StatusCodes.Status201Created,
              new SuccessResponseDTO("WordHunt minigame log created successfully.", minigamelog));
        }

        [HttpPost("logs/wordsfromletters")]
        [Authorize]
        public async Task<IActionResult> CreateLogWordsFromLetters([FromBody] MinigameLogDTO.WordsFromLettersLog request)
        {
            var minigamelog = await _minigameService.Create(MinigameType.WordsFromLetters, request);
            return StatusCode(StatusCodes.Status201Created,
              new SuccessResponseDTO("WordsFromLetters minigame log created successfully.", minigamelog));
        }

        [HttpPost("logs/fillintheblanks")]
        [Authorize]
        public async Task<IActionResult> CreateLogFillInTheBlanks([FromBody] MinigameLogDTO.FillInTheBlanksLog request)
        {
            var minigamelog = await _minigameService.Create(MinigameType.FillInTheBlanks, request);
            return StatusCode(StatusCodes.Status201Created,
              new SuccessResponseDTO("FillInTheBlanks minigame log created successfully.", minigamelog));
        }

        [HttpPost("logs/twotruthsonelie")]
        [Authorize]
        public async Task<IActionResult> CreateLogTwoTruthsOneLie([FromBody] MinigameLogDTO.TwoTruthsOneLieLog request)
        {
            var minigamelog = await _minigameService.Create(MinigameType.TwoTruthsOneLie, request);
            return StatusCode(StatusCodes.Status201Created,
              new SuccessResponseDTO("TwoTruthsOneLie minigame log created successfully.", minigamelog));
        }

        [HttpPost("logs/sentencerearrangement")]
        [Authorize]
        public async Task<IActionResult> CreateLogSentenceRearrangement([FromBody] MinigameLogDTO.SentenceRearrangementLog request)
        {
            var minigamelog = await _minigameService.Create(MinigameType.SentenceRearrangement, request);
            return StatusCode(StatusCodes.Status201Created,
              new SuccessResponseDTO("SentenceRearrangement minigame log created successfully.", minigamelog));
        }

        [HttpGet("/logs/{MinigameLogId}")]
        [Authorize]
        public async Task<IActionResult> GetMinigameLog([FromRoute] Guid MinigameLogId)
        {
            var minigamelog = await _minigameService.GetMinigameLogById(MinigameLogId);
            return StatusCode(StatusCodes.Status200OK,
              new SuccessResponseDTO("Minigame log found.", minigamelog));
        }

        [HttpGet("logs")]
        [Authorize]
        public async Task<IActionResult> GetMinigameLogs()
        {
            var minigamelogs = await _minigameService.GetMinigameLogs();
            return StatusCode(StatusCodes.Status200OK,
              new SuccessResponseDTO("Minigames found.", minigamelogs)
            );
        }

        [HttpGet("{readingSessionId}/random")]
        [Authorize]
        public async Task<IActionResult> GetRandomMinigame([FromRoute] Guid readingSessionId)
        {
            var minigames = await _minigameService.GetRandomMinigames(readingSessionId);
            return StatusCode(StatusCodes.Status200OK,
                new SuccessResponseDTO("Successfully fetched minigames.", minigames)
            );
        }

    }
}
