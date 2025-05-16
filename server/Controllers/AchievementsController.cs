using LexiLearner.Interfaces;
using LexiLearner.Models.DTO;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]

public class AchievementsController : ControllerBase
{
    private readonly IAchievementRepository _achievementRepository;
    private readonly IAchievementService _achievementService;

    public AchievementsController(IAchievementRepository achievementRepository, IAchievementService achievementService)
    {
        _achievementRepository = achievementRepository;
        _achievementService = achievementService;
    }

    [HttpGet("")]
    [Authorize("PupilPolicy")]
    public async Task<IActionResult> GetPupilAchievements()
    {
        var Achievements = await _achievementService.GetByPupilId(User);

        return StatusCode(StatusCodes.Status200OK,
          new SuccessResponseDTO("Successfully fetched pupil achievement", Achievements));
    }

    [HttpPost("{AchievementName}")]
    [Authorize("PupilPolicy")]
    public async Task<IActionResult> AddPupilAchievement(string AchievementName)
    {
        var PupilAchievement = await _achievementService.AddPupilAchievement(User, AchievementName);

        return StatusCode(StatusCodes.Status200OK,
          new SuccessResponseDTO("Successfully added pupil achievement.", PupilAchievement));
    }
}
