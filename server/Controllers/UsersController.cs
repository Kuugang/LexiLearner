using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using LexiLearner.Models.DTO;
using LexiLearner.Interfaces;

[ApiController]
[Route("api/users")]

public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> Profile()
    {
        return Ok(await _userService.GetUserProfile(User));
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDTO request)
    {
        var response = await _userService.UpdateProfile(request , User);

        return response is SuccessResponseDTO success 
            ? Ok(success) 
            : StatusCode(((ErrorResponseDTO)response).StatusCode, response);
    }
}
