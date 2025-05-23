using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using LexiLearner.Models.DTO;
using LexiLearner.Interfaces;

[ApiController]
[Route("api/[controller]")]

public class ReadingMaterialsController : ControllerBase
{
    private readonly IReadingMaterialService _readingMaterialService;
    public ReadingMaterialsController(IReadingMaterialService readingMaterialService)
    {
        _readingMaterialService = readingMaterialService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ReadingMaterialDTO.Create request)
    {
        var readingMat = await _readingMaterialService.Create(request);
        return StatusCode(StatusCodes.Status201Created,
          new SuccessResponseDTO("Reading Material successfully created.", readingMat));
    }

    [HttpGet("")]
    public async Task<IActionResult> Get([FromQuery] ReadingMaterialDTO.Read filters)
    {
        var ReadingMaterials = await _readingMaterialService.FilterReadingMaterials(filters);

        return StatusCode(StatusCodes.Status200OK,
          new SuccessResponseDTO(
            "Reading Materials found.",
            ReadingMaterials.Select(r => new ReadingMaterialResponseDTO(r))
            )
          );
    }

    [HttpGet("recommendations")]
    [Authorize]
    public async Task<IActionResult> GetRecommendations()
    {
        var ReadingMaterials = await _readingMaterialService.GetRecommendations(User);

        return StatusCode(StatusCodes.Status200OK,
          new SuccessResponseDTO(
            "Reading Materials recommendations found.",
            ReadingMaterials.Select(r => new ReadingMaterialResponseDTO(r))
            )
          );
    }

    [HttpGet("{readingMaterialId}")]
    public async Task<IActionResult> GetReadingMaterialById([FromRoute] Guid readingMaterialId) {
        var readingMaterial = await _readingMaterialService.GetById(readingMaterialId);

        if (readingMaterial == null)
        {
            return StatusCode(StatusCodes.Status404NotFound,
              new ErrorResponseDTO("Reading Material not found."));
        }

        return StatusCode(StatusCodes.Status200OK,
          new SuccessResponseDTO("Reading Material fetched.", new ReadingMaterialResponseDTO(readingMaterial)));
    }
}
