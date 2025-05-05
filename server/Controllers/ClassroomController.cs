using System.Security.Claims;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ClassroomController : ControllerBase {
    private readonly IClassroomService _classroomService;
    private readonly IUserService _userService;
    private readonly IClassroomEnrollmentService _classroomEnrollmentService;

    public ClassroomController(IClassroomService classroomService, IUserService userService, IClassroomEnrollmentService classroomEnrollmentService) {
        _classroomService = classroomService;
        _userService = userService;
        _classroomEnrollmentService = classroomEnrollmentService;
    }

    [HttpPost("create")]
    [Authorize("TeacherPolicy")]
    public async Task<IActionResult> Create([FromBody] ClassroomDTO.CreateClassroom request){
        
        var classroom = await _classroomService.Create(request, User);

        return StatusCode(StatusCodes.Status201Created,
			new SuccessResponseDTO ("Classroom created successfully", classroom)
		);
    }

    [HttpPut("{ClassroomId}")]
    [Authorize("TeacherPolicy")]
    public async Task<IActionResult> EditClassroom([FromRoute] Guid ClassroomId, [FromForm] ClassroomDTO.UpdateClassroom request) {
        var classroom = await _classroomService.Update(ClassroomId, request, User);

        return StatusCode(
			StatusCodes.Status200OK,
			new SuccessResponseDTO ("Update classroom success", classroom)
		);
    }

    [HttpGet("{ClassroomId}")]
    public async Task<IActionResult> GetById([FromRoute] Guid ClassroomId) {
        var classroom = await _classroomService.GetById(ClassroomId);

        return StatusCode(
			StatusCodes.Status200OK,
			new SuccessResponseDTO ("Get classroom success", classroom)
		);
    }

    // TODO: feel nako better ni isame route with sa getbypupilID but kani lng sa for now DD:
    [HttpGet("teacher/me")]
    [Authorize("TeacherPolicy")]
    public async Task<IActionResult> GetByTeacherId() {
        var Classrooms = await _classroomService.GetByTeacherId(User);

        return StatusCode(
            StatusCodes.Status200OK,
            new SuccessResponseDTO("Get teacher's classroom success",Classrooms)
        );
    }

    [HttpDelete("{ClassroomId}")]
    [Authorize("TeacherPolicy")]
    public async Task<IActionResult> Delete([FromRoute] Guid ClassroomId) {
        await _classroomService.Delete(ClassroomId, User);

        return StatusCode(
            StatusCodes.Status200OK,
            new SuccessResponseDTO("Deleted classroom successfully")
        );
    }

	[HttpPost("{JoinCode}")]
	[Authorize("PupilPolicy")]
	public async Task<IActionResult> JoinClassroom([FromRoute] string JoinCode)
	{
		var classroom = await _classroomEnrollmentService.JoinClassroom(JoinCode, User);

		return StatusCode(StatusCodes.Status201Created,
		new SuccessResponseDTO("Joined Classroom successfully", classroom))
		;
	}

	[HttpGet("me")]
	[Authorize("PupilPolicy")]
	public async Task<IActionResult> GetByPupilId()
	{
		var classrooms = await _classroomEnrollmentService.GetByPupilId(User);

		return StatusCode(StatusCodes.Status201Created,
		new SuccessResponseDTO("Get pupil classrooms successfully", classrooms))
		;
	}

	[HttpDelete("me/{ClassroomId}")]
	[Authorize("PupilPolicy")]
	public async Task<IActionResult> LeaveClassroom([FromRoute] Guid ClassroomId)
	{
		await _classroomEnrollmentService.LeaveClassroom(ClassroomId, User);

		return StatusCode(StatusCodes.Status200OK,
		new SuccessResponseDTO("Leave classroom successfully"));
	}
}   