using LexiLearner.Interfaces;
using LexiLearner.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ClassroomEnrollmentController : ControllerBase{
    private readonly IClassroomService _classroomService;
    private readonly IUserService _userService;
    private readonly IClassroomEnrollmentService _classroomEnrollmentService;

    public ClassroomEnrollmentController(IClassroomService classroomService, IUserService userService, IClassroomEnrollmentService classroomEnrollmentService) {
        _classroomService = classroomService;
        _userService = userService;
        _classroomEnrollmentService = classroomEnrollmentService;
    }

    [HttpPost("{JoinCode}")]
    [Authorize("PupilPolicy")]
    public async Task<IActionResult> JoinClassroom([FromRoute] string JoinCode){
        var classroom = await _classroomEnrollmentService.JoinClassroom(JoinCode,User);

        return StatusCode(StatusCodes.Status201Created,
        new SuccessResponseDTO("Joined Classroom successfully", classroom))
        ;
    }

    [HttpGet("me")]
    [Authorize("PupilPolicy")]
    public async Task<IActionResult> GetByPupilId() {
        var classrooms = await _classroomEnrollmentService.GetByPupilId(User);

        return StatusCode(StatusCodes.Status201Created,
        new SuccessResponseDTO("Get pupil classrooms successfully", classrooms))
        ;
    }

    [HttpDelete("{ClassroomId}")]
    [Authorize("PupilPolicy")]
    public async Task<IActionResult> LeaveClassroom([FromRoute] Guid ClassroomId) {
        await _classroomEnrollmentService.LeaveClassroom(ClassroomId, User);

        return StatusCode(StatusCodes.Status200OK,
        new SuccessResponseDTO("Leave classroom successfully"));
    }
}
