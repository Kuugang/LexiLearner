using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using LexiLearn.Models.DTO;
using LexiLearn.Interfaces;

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
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDTO request)
    {
        var userDTO = await _userService.GetUserProfile(User);
        
        return Ok(new SuccessResponseDTO
        {
            Message = "User profile fetched successfully",
            Data = userDTO
        });
    }
}
