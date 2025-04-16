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

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Profile()
    {
        return Ok(await _userService.GetUserProfile(User));
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDTO request)
    {
        var response = await _userService.UpdateProfile(request, User);

        return response is SuccessResponseDTO success
            ? Ok(success)
            : StatusCode(((ErrorResponseDTO)response).StatusCode, response);
    }

    //TODO: BATI
    [HttpGet("{username}")]
    public async Task<IActionResult> GetPublicProfile(string username)
    {
        var response = await _userService.GetPublicProfile(username);

        return response is SuccessResponseDTO success
            ? Ok(success)
            : StatusCode(((ErrorResponseDTO)response).StatusCode, response);
    }

    [HttpDelete("me")]
    public async Task<IActionResult> DeleteAccount()
    {
        var response = await _userService.DeleteAccount(User);
        return response is SuccessResponseDTO success
            ? Ok(success)
            : StatusCode(((ErrorResponseDTO)response).StatusCode, response);
    }

    [HttpGet("check-user")]
    public async Task<IActionResult> CheckUserExists([FromQuery] string fieldType, [FromQuery] string fieldValue)
    {
        if (string.IsNullOrEmpty(fieldValue))
        {
            return BadRequest(new ResponseDTO("Field value cannot be empty.", null, "Bad Request", 400));
        }

        var user = fieldType switch
        {
            "username" => await _userService.GetUserByUsername(fieldValue),
            "email" => await _userService.GetUserByEmail(fieldValue),
            _ => null // Handle invalid fieldType
        };

        if (user == null)
        {
            return NotFound(new ResponseDTO("User does not exist.", null, "User not found", 404));
        }

        return Ok(new SuccessResponseDTO("User exists."));
    }
}
