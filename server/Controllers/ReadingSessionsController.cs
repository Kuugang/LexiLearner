using LexiLearner.Exceptions;
using LexiLearner.Interfaces;
using LexiLearner.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ReadingSessionsController : ControllerBase
{
	private readonly IReadingSessionService _sessionService;
	public ReadingSessionsController(IReadingSessionService sessionService)
	{
	_sessionService = sessionService;
	}
  
	[HttpPost("{readingMaterialId}")]
	[Authorize]
	public async Task<IActionResult> Create([FromRoute] Guid readingMaterialId){
		var readingSession = await _sessionService.Create(readingMaterialId, User);
		return StatusCode(StatusCodes.Status201Created, 
			new SuccessResponseDTO("Reading session successfully created", readingSession)
		);
	}

	[HttpPut("{readingSessionId}")]
	[Authorize]
	public async Task<IActionResult> Update([FromRoute] Guid readingSessionId, [FromBody] ReadingSessionDTO.Update request)
	{
		var readingSession = await _sessionService.Update(readingSessionId, request);
		return StatusCode(StatusCodes.Status200OK,
			new SuccessResponseDTO("Reading session successfully updated.", readingSession)
		);
	}

	[HttpGet("{readingSessionId}")]
	[Authorize]
	public async Task<IActionResult> Get([FromRoute] Guid readingSessionId)
	{
		var readingSession = await _sessionService.GetReadingSessionById(readingSessionId);

		if (readingSession == null)
		{
			throw new ApplicationExceptionBase(
				"Reading session does not exist.",
				"Fetching reading session failed.",
				StatusCodes.Status404NotFound
			);
		}

		return StatusCode(StatusCodes.Status200OK,
			new SuccessResponseDTO("Reading session fetched.", new ReadingSessionDTO(readingSession))
		);
	}
	
	[HttpGet("incomplete/readingmaterials")]
	[Authorize("PupilPolicy")]
	public async Task<IActionResult> GetIncompleteReadingSessionsByPupilId()
	{
		var readingMaterials = await _sessionService.GetIncompleteReadingMaterialsByPupil(User);

		return StatusCode(StatusCodes.Status200OK,
			new SuccessResponseDTO("Currently reading materials fetched.", readingMaterials.Select(rm => new ReadingMaterialResponseDTO(rm)))
		);
	}
	
	[HttpGet("incomplete")]
	[Authorize]
	public async Task<IActionResult> GetIncompleteReadingSessions()
	{
		var readingSessions = await _sessionService.GetIncompleteReadingSessionsByPupil(User);

		return StatusCode(StatusCodes.Status200OK,
			new SuccessResponseDTO("Currently reading sessions fetched.", readingSessions.Select(rs => new ReadingSessionDTO(rs)))
		);
	}
}