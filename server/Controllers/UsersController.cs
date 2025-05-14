using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using LexiLearner.Models.DTO;
using LexiLearner.Interfaces;
using LexiLearner.Models;

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
    
    [HttpPut("me/streak")]
    [Authorize]
    public async Task<IActionResult> RecordLoginStreak()
    {
        var user = await _userService.GetUserFromToken(User);
        if (user == null)
        {
            return StatusCode(StatusCodes.Status404NotFound, new ErrorResponseDTO("User not found.", StatusCodes.Status404NotFound));
        }

        var loginStreak = await _userService.RecordLoginAsync(user.Id);

        return StatusCode(StatusCodes.Status200OK,
          new SuccessResponseDTO("Login streak recorded successfully.", new LoginStreakDTO(loginStreak)));
    }

    [HttpGet("me/streak")]
    [Authorize]
    public async Task<IActionResult> GetLoginStreak()
    {
        var loginStreak = await _userService.GetLoginStreak(User);

        return StatusCode(StatusCodes.Status200OK,
          new SuccessResponseDTO("Login streak fetched successfully.", new LoginStreakDTO(loginStreak)));
    }

    [HttpGet("me/leaderboard")]
    [Authorize]
    public async Task<IActionResult> GetLeaderBoard()
    {
        var pupilLeaderboards = await _userService.GetPupilLeaderboard(User);

        return StatusCode(StatusCodes.Status200OK,
          new SuccessResponseDTO("Leaderboard fetched successfully.", new PupilLeaderboardDTO(pupilLeaderboards.First())));
    }
    
    [HttpGet("me/leaderboard/history")]
    [Authorize]
    public async Task<IActionResult> GetLeaderBoardHistory()
    {
        var pupilLeaderboards = await _userService.GetPupilLeaderboard(User);

        return StatusCode(StatusCodes.Status200OK,
          new SuccessResponseDTO("Leaderboard history fetched successfully.", pupilLeaderboards.Select(l => new PupilLeaderboardDTO(l)).ToList()));
    }
    
    [HttpPost("me/sessions")]
    [Authorize]
    public async Task<IActionResult> CreateSession()
    {
        var session = await _userService.CreateSession(User);
        

        return StatusCode(StatusCodes.Status201Created,
          new SuccessResponseDTO("Session created successfully.", session));
    }
    
    [HttpGet("me/sessions/{sessionId}")]
    [Authorize]
    public async Task<IActionResult> GetSessionById(Guid sessionId)
    {
        var session = await _userService.GetSessionById(sessionId, User);

        return session != null
            ? StatusCode(StatusCodes.Status200OK, new SuccessResponseDTO("Session fetched successfully.", new SessionDTO(session)))
            : StatusCode(StatusCodes.Status404NotFound, new ErrorResponseDTO("Session not found.", 404));
    }
    
    [HttpPut("me/sessions/{SessionId}")]
    [Authorize]
    public async Task<IActionResult> EndSession(Guid sessionId)
    {
        var session = await _userService.EndSession(sessionId, User);

        return session != null
            ? StatusCode(StatusCodes.Status200OK, new SuccessResponseDTO("Session ended successfully.", session))
            : StatusCode(StatusCodes.Status404NotFound, new ErrorResponseDTO("Session not found.", StatusCodes.Status404NotFound));
    }  
    
    [HttpGet("search")]
    [Authorize] 
    public async Task<IActionResult> SearchUsers([FromQuery] string query, [FromQuery] string role)
    {
        if (string.IsNullOrEmpty(query))
        {
            return BadRequest(new ResponseDTO("Search query cannot be empty.", null, "Bad Request", 400));
        }

        // Fix parameter order here - role comes first in the interface
        var users = await _userService.SearchUsersByRoleAsync(role, query);
        
        if (users == null || !users.Any())
        {
            // Return an empty array directly (not wrapped in another object)
            return Ok(new SuccessResponseDTO("No users found.", new List<User>()));
        }

        // Return users directly without extra nesting
        return Ok(new SuccessResponseDTO("Users found.", users));
    }
    
    [HttpGet("leaderboard")]
    [Authorize]
    public async Task<IActionResult> GetGlobal10Leaderboard()
    {
        var leaderboards = await _userService.GetGlobal10Leaderboard();

        return StatusCode(StatusCodes.Status200OK,
          new SuccessResponseDTO("Top 10 Leaderboard fetched successfully.",
            leaderboards.Select(l => new PupilLeaderboardDTO(l)).ToList())
        );
    }
    
    [HttpGet("leaderboard/{pupilId}")]
    [Authorize]
    public async Task<IActionResult> GetPupilLeaderboardByPupilId(Guid pupilId)
    {
        var pupilLeaderboards = await _userService.GetPupilLeaderboardByPupilId(pupilId);

        return StatusCode(StatusCodes.Status200OK,
          new SuccessResponseDTO("Leaderboard fetched successfully.", new PupilLeaderboardDTO(pupilLeaderboards.First())));
    }
    
    [HttpGet("leaderboard/{pupilId}/history")]
    [Authorize]
    public async Task<IActionResult> GetPupilLeaderboardHistoryByPupilId(Guid pupilId)
    {
        var pupilLeaderboards = await _userService.GetPupilLeaderboardByPupilId(pupilId);

        return StatusCode(StatusCodes.Status200OK,
          new SuccessResponseDTO("Leaderboard history fetched successfully.", pupilLeaderboards.Select(l => new PupilLeaderboardDTO(l)).ToList()));
    }
}
