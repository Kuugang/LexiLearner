using LexiLearner.Interfaces;
using LexiLearner.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/classroom")]
public class ClassroomController : ControllerBase {
    private readonly IClassroomService _classroomService;

    public ClassroomController(IClassroomService classroomService) {
        _classroomService = classroomService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromForm] ClassroomDTO.CreateClassroom request){
        Console.WriteLine("hi bitch");
        var Classroom = await _classroomService.Create(request, User);

        return StatusCode(StatusCodes.Status201Created,
			new SuccessResponseDTO
			{
				Message = "Classroom created successfully",
                Data = Classroom
			}
		);
    }
}