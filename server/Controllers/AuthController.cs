using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

using LexiLearner.Models.DTO;
using LexiLearner.Interfaces;


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IAuthService _authService;

    public AuthController(IUserService userService, IAuthService authService)
    {
        _userService = userService;
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var response = await _userService.Register(request);
        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.Login(request);
        return StatusCode(StatusCodes.Status200OK, response);
    }

    [HttpPost("2fa/verify")]
    public async Task<IActionResult> Verify2FA([FromBody]TwoFactorRequest request)
    {
        var response = await _authService.ValidateTwoFactorTokenAsync(request);
    
        return response is SuccessResponseDTO success 
            ? Ok(success) 
            : StatusCode(((ErrorResponseDTO)response).StatusCode, response);
    }


    [HttpPost("token")]
    public async Task<IActionResult> Token([FromBody] TokenAuthDTO request)
    {
        var response = request.Provider switch
        {
            Providers.Google => await _authService.VerifyGoogleTokenAsync(request.Token),
            Providers.Facebook => await _authService.VerifyFacebookTokenAsync(request.Token),
            _ => null
        };


        Console.WriteLine(response.Data);
        return response is SuccessResponseDTO success 
            ? Ok(success) 
            : StatusCode(((ErrorResponseDTO)response).StatusCode, response);
    }
}
