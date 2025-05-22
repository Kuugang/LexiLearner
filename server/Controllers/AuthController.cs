using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using LexiLearner.Models;
using LexiLearner.Models.DTO;
using LexiLearner.Interfaces;


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IJWTService _jwtService;

    public AuthController(IAuthService authService, IJWTService jwtService)
    {
        _authService = authService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var response = await _authService.Register(request);
        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.Login(request);
        return StatusCode(StatusCodes.Status200OK, response);
    }

    [HttpPost("2fa/verify")]
    public async Task<IActionResult> Verify2FA([FromBody] TwoFactorRequest request)
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


        return response is SuccessResponseDTO success
            ? Ok(success)
            : StatusCode(((ErrorResponseDTO)response).StatusCode, response);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokensDTO RefreshTokensDTO)
    {
        var response = await _jwtService.RefreshAccessToken(RefreshTokensDTO);
        return StatusCode(StatusCodes.Status200OK,
                new SuccessResponseDTO("Successfully refreshed access token.", response));
    }
}
