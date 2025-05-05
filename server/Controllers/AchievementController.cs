using LexiLearner.Data;
using LexiLearner.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]

public class AchievementController : ControllerBase {
    private readonly IAchievementRepository _achievementRepository;
    private readonly IAchievementService _achievementService;
    public AchievementController(IAchievementRepository achievementRepository, IAchievementService achievementService) {
        _achievementRepository = achievementRepository;
        _achievementService = achievementService;
    }

    // [HttpPost("{AchievementId}")]
    // [Authorize("PupilPolicy")]
    // public async Task<IActionResult> AddPupilAchievement(Guid AchievementId) {

    // }
}