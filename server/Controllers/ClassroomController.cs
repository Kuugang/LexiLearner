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

    public ClassroomController(IClassroomService classroomService, IUserService userService) {
        _classroomService = classroomService;
        _userService = userService;
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
        var classroom = await _classroomService.GetByClassroomId(ClassroomId);

        return StatusCode(
			StatusCodes.Status200OK,
			new SuccessResponseDTO ("Get classroom success", classroom)
		);
    }

    [HttpGet("teacher/me")]
    [Authorize("TeacherPolicy")]
    public async Task<IActionResult> GetByTeacherId() {
        var Classrooms = await _classroomService.GetClassroomsByTeacherId(User);

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
		var classroom = await _classroomService.JoinClassroom(JoinCode, User);

		return StatusCode(StatusCodes.Status201Created,
		new SuccessResponseDTO("Joined Classroom successfully", classroom))
		;
	}

	[HttpGet("me")]
	[Authorize("PupilPolicy")]
	public async Task<IActionResult> GetByPupilId()
	{
		var classrooms = await _classroomService.GetClassroomsByPupilId(User);

		return StatusCode(StatusCodes.Status201Created,
		new SuccessResponseDTO("Get pupil classrooms successfully", classrooms))
		;
	}

	[HttpDelete("me/{ClassroomId}")]
	[Authorize("PupilPolicy")]
	public async Task<IActionResult> LeaveClassroom([FromRoute] Guid ClassroomId)
	{
		await _classroomService.LeaveClassroom(ClassroomId, User);

		return StatusCode(StatusCodes.Status200OK,
		new SuccessResponseDTO("Leave classroom successfully"));
	}
	
	[HttpPost("{ClassroomId}/pupils")]
	[Authorize("TeacherPolicy")]
	public async Task<IActionResult> AddPupilToClassroom([FromRoute] Guid ClassroomId, [FromBody] Guid PupilId)
	{
        var classroomEnrollment = await _classroomService.AddPupil(PupilId, ClassroomId, User);
        return StatusCode(StatusCodes.Status200OK,
            new SuccessResponseDTO("Added pupil to classroom successfully.", classroomEnrollment)
        );
    }
    
    [HttpDelete("{ClassroomId}/pupils")]
    [Authorize("TeacherPolicy")]
    public async Task<IActionResult> RemovePupilFromClassroom([FromRoute] Guid ClassroomId, [FromBody] Guid PupilId)
    {
        await _classroomService.RemovePupil(PupilId, ClassroomId, User);
        
        return StatusCode(StatusCodes.Status200OK,
            new SuccessResponseDTO("Removed pupil from classroom successfully.")
        );
    }
    
    [HttpGet("{ClassroomId}/pupils")]
    [Authorize]
    public async Task<IActionResult> GetPupilsFromClassroom([FromRoute] Guid ClassroomId)
    {
        var pupils = await _classroomService.GetPupilsByClassroomId(ClassroomId, User);
        return StatusCode(StatusCodes.Status200OK,
            new SuccessResponseDTO("Pupils fetched from classroom successfully.", pupils)
        );
    }
    
    [HttpPost("{ClassroomId}/readingAssignments")]
    [Authorize("TeacherPolicy")]
    public async Task<IActionResult> CreateReadingAssignment([FromRoute] Guid ClassroomId, [FromBody] ReadingMaterialAssignmentDTO.Create Request)
    {
        if (Request == null)
        {
            return BadRequest(new ErrorResponseDTO("Invalid request data."));
        }
        var readingAssignment = await _classroomService.CreateReadingAssignment(ClassroomId, Request, User);
        return StatusCode(StatusCodes.Status201Created,
            new SuccessResponseDTO("Created reading assignment successfully.", readingAssignment)
        );
    }
    
    [HttpGet("{ClassroomId}/readingAssignments")]
    [Authorize]
    public async Task<IActionResult> GetReadingAssignments([FromRoute] Guid ClassroomId)
    {
        var readingAssignments = await _classroomService.GetAllReadingAssignmentsByClassroomId(ClassroomId, User);
        return StatusCode(StatusCodes.Status200OK,
            new SuccessResponseDTO("Fetched reading assignments successfully.", 
            readingAssignments.Select(ra => new ReadingMaterialAssignmentDTO(ra)).ToList())
        );
    }
    
    [HttpGet("{ClassroomId}/readingAssignments/active")]
    [Authorize]
    public async Task<IActionResult> GetActiveReadingAssignments([FromRoute] Guid ClassroomId)
    {
        var readingAssignments = await _classroomService.GetActiveReadingAssignmentsByClassroomId(ClassroomId, User);
        return StatusCode(StatusCodes.Status200OK,
            new SuccessResponseDTO("Fetched active reading assignments successfully.", 
            readingAssignments.Select(ra => new ReadingMaterialAssignmentDTO(ra)).ToList())
        );
    }

    [HttpGet("readingAssignments/{ReadingAssignmentId}")]
    [Authorize]
    public async Task<IActionResult> GetReadingAssignmentById([FromRoute] Guid ReadingAssignmentId)
    {
        var readingAssignment = await _classroomService.GetReadingAssignmentById(ReadingAssignmentId);

        return StatusCode(StatusCodes.Status200OK,
            new SuccessResponseDTO("Reading Assignment fetched successfully.",
            new ReadingMaterialAssignmentDTO(readingAssignment)));
    }
    
    [HttpPut("readingAssignments/{ReadingAssignmentId}")]
    [Authorize("TeacherPolicy")]
    public async Task<IActionResult> UpdateReadingAssignment([FromRoute] Guid ReadingAssignmentId, [FromBody] ReadingMaterialAssignmentDTO.Update Request)
    {
        var readingAssignment = await _classroomService.UpdateReadingAssignment(ReadingAssignmentId, Request, User);
        return StatusCode(StatusCodes.Status200OK,
            new SuccessResponseDTO("Updated reading assignment successfully.", new ReadingMaterialAssignmentDTO(readingAssignment))
        );
    }
    
    [HttpDelete("readingAssignments/{ReadingAssignmentId}")]
    [Authorize("TeacherPolicy")]
    public async Task<IActionResult> DeleteReadingAssignment([FromRoute] Guid ReadingAssignmentId)
    {
        await _classroomService.DeleteReadingAssignment(ReadingAssignmentId, User);
        return StatusCode(StatusCodes.Status200OK,
            new SuccessResponseDTO("Deleted reading assignment successfully.")
        );
    }
    
    [HttpGet("{ClassroomId}/leaderboard")]
    [Authorize]
    public async Task<IActionResult> GetClassroomLeaderboard([FromRoute] Guid ClassroomId)
    {
        var classroomLeaderboard = await _classroomService.GetLeaderboard(ClassroomId, User);
        return StatusCode(StatusCodes.Status200OK,
            new SuccessResponseDTO("Fetched classroom leaderboard successfully.", classroomLeaderboard)
        );
    }
    
    [HttpPost("readingAssignments/{ReadingAssignmentId}/logs/{MinigameLogId}")]
    [Authorize]
    public async Task<IActionResult> CreateAssignmentLog([FromRoute] Guid ReadingAssignmentId, [FromRoute] Guid MinigameLogId)
    {
        var assignmentLog = await _classroomService.CreateAssignmentLog(ReadingAssignmentId, MinigameLogId);
        return StatusCode(StatusCodes.Status201Created,
            new SuccessResponseDTO("Created assignment log successfully.", assignmentLog)
        );
    }
    
    [HttpGet("readingAssignments/logs/{ReadingAssignmentLogId}")]
    [Authorize]
    public async Task<IActionResult> GetAssignmentLogById([FromRoute] Guid ReadingAssignmentLogId)
    {
        var assignmentLog = await _classroomService.GetAssignmentLogById(ReadingAssignmentLogId);
        return StatusCode(StatusCodes.Status201Created,
            new SuccessResponseDTO("Fetched assignment log successfully.", new ReadingAssignmentLogDTO(assignmentLog))
        );
    }
    
    [HttpGet("readingAssignments/{ReadingAssignmentId}/logs/{PupilId}")]
    [Authorize]
    public async Task<IActionResult> GetAssignmentLogByReadingAssignmentIdAndPupilId([FromRoute] Guid ReadingAssignmentId, [FromRoute] Guid PupilId)
    {
        var assignmentLog = await _classroomService.GetAssignmentLogByReadingAssignmentIdAndPupilId(ReadingAssignmentId, PupilId);
        return StatusCode(StatusCodes.Status201Created,
            new SuccessResponseDTO("Fetched assignment log successfully.", new ReadingAssignmentLogDTO(assignmentLog))
        );
    }
    
    [HttpGet("readingAssignments/{ReadingAssignmentId}/logs")]
    [Authorize]
    public async Task<IActionResult> GetAssignmentLogsByReadingAssignmentId([FromRoute] Guid ReadingAssignmentId)
    {
        var assignmentLogs = await _classroomService.GetAssignmentLogsByReadingAssignmentId(ReadingAssignmentId);
        return StatusCode(StatusCodes.Status201Created,
            new SuccessResponseDTO("Fetched assignment logs successfully.", assignmentLogs.Select(a => new ReadingAssignmentLogDTO(a)))
        );
    }
    
    [HttpGet("readingAssignments/logs/pupils/{PupilId}")]
    [Authorize]
    public async Task<IActionResult> GetAssignmentLogsByPupilId([FromRoute] Guid PupilId)
    {
        var assignmentLogs = await _classroomService.GetAssignmentLogsByPupilId(PupilId);
        return StatusCode(StatusCodes.Status201Created,
            new SuccessResponseDTO("Fetched assignment logs successfully.", assignmentLogs.Select(a => new ReadingAssignmentLogDTO(a)))
        );
    }
    
    [HttpGet("{ClassroomId}/readingAssignments/logs")]
    [Authorize]
    public async Task<IActionResult> GetAssignmentLogsByClassroomId([FromRoute] Guid ClassroomId)
    {
        var assignmentLogs = await _classroomService.GetAssignmentLogsByClassroomId(ClassroomId);
        return StatusCode(StatusCodes.Status201Created,
            new SuccessResponseDTO("Fetched assignment logs successfully.", assignmentLogs.Select(a => new ReadingAssignmentLogDTO(a)))
        );
    }
    
    [HttpGet("{ClassroomId}/readingAssignments/logs/pupils/{PupilId}")]
    [Authorize]
    public async Task<IActionResult> GetAssignmentLogsByClassroomIdAndPupilId([FromRoute] Guid ClassroomId, [FromRoute] Guid PupilId)
    {
        var assignmentLogs = await _classroomService.GetAssignmentLogsByClassroomIdAndPupilId(ClassroomId, PupilId);
        return StatusCode(StatusCodes.Status201Created,
            new SuccessResponseDTO("Fetched assignment logs successfully.", assignmentLogs.Select(a => new ReadingAssignmentLogDTO(a)))
        );
    }
    
    [HttpGet("readingAssignments/{ReadingAssigmentId}/overview")]
    [Authorize("TeacherPolicy")]
    public async Task<IActionResult> GetReadingAssignmentStatByAssignmentId([FromRoute] Guid ReadingAssigmentId)
    {
        var assignmentStat = await _classroomService.GetReadingAssignmentStatByAssignmentId(ReadingAssigmentId, User);
        return StatusCode(StatusCodes.Status201Created,
            new SuccessResponseDTO("Fetched assignment stats successfully.", assignmentStat)
        );
    }
    
    [HttpGet("{ClassroomId}/readingAssignments/overview")]
    [Authorize("TeacherPolicy")]
    public async Task<IActionResult> GetReadingAssignmentStatByClassroomId([FromRoute] Guid ClassroomId)
    {
        var assignmentStats = await _classroomService.GetReadingAssignmentStatByClassroomId(ClassroomId, User);
        return StatusCode(StatusCodes.Status201Created,
            new SuccessResponseDTO("Fetched assignment stats successfully.", assignmentStats)
        );
    }
}