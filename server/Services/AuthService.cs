using Microsoft.Extensions.Caching.Memory;

using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;

using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using LexiLearner.Exceptions;


namespace LexiLearner.Services
{
    public class AuthService : IAuthService
    {
        private readonly HttpClient _httpClient;
        // private readonly CachedUserRepository _cachedUserRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly UserManager<User> _userManager;
        private readonly IJWTService _jwtService;
        private readonly IMemoryCache _memoryCache;

        public AuthService(HttpClient httpClient, IUserRepository userRepository, IUserService userService, UserManager<User> userManager, IJWTService jwtService, IConfiguration configuration, IMemoryCache memoryCache)
        {
            _userService = userService;
            _userManager = userManager;
            _httpClient = httpClient;
            _userRepository = userRepository;
            _jwtService = jwtService;
            _memoryCache = memoryCache;
        }

        public async Task<SuccessResponseDTO> Login(LoginRequest LoginRequest)
        {
            var user = await _userService.GetUserByEmail(LoginRequest.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, LoginRequest.Password))
            {
                throw new ApplicationExceptionBase(
                    "Invalid credentials",
                    "Login failed",
                    StatusCodes.Status401Unauthorized
                );
            }

            if (user.TwoFactorEnabled == true)
            {
                var emailService = new EmailService();
                string code = await GenerateTwoFactorTokenAsync(user);
                await emailService.SendEmailAsync(user.Email, "Two Factor Authentication Code", $"Your two-factor authentication code is {code}");

                return new SuccessResponseDTO
                {
                    Message = "Two Factor Authentication Code was sent to your email.",
                };
            }
            
            string role = await _userService.GetRole(user);

            var token = _jwtService.GenerateJWTToken(user.Id, user.UserName!,role);
            
            await _userService.RecordLoginAsync(user);

            return new SuccessResponseDTO("Login successful", new JWTDTO(token));
        }

        public async Task<ResponseDTO> VerifyGoogleTokenAsync(string token)
        {
            string googleApiUrl = $"https://oauth2.googleapis.com/tokeninfo?id_token={token}";

            HttpResponseMessage response = await _httpClient.GetAsync(googleApiUrl);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Invalid Google access token");
            }

            var GoogleUserString = await response.Content.ReadAsStringAsync();
            var GoogleUser = JObject.Parse(GoogleUserString);

            string GoogleId = GoogleUser["sub"]?.ToString();

            var user = await _userManager.FindByLoginAsync("Google", GoogleId);
            user = await _userService.GetUserByEmail(GoogleUser["email"]?.ToString());

            if (user == null)
            {
                var passwordHasher = new PasswordHasher<object>();
                string randomPassword = Guid.NewGuid().ToString("N").Substring(0, 8) + "A!";
                string hashedPassword = passwordHasher.HashPassword(null, randomPassword);

                user = new User
                {
                    Email = GoogleUser["email"]?.ToString(),
                    UserName = GoogleUser["name"]?.ToString().Replace(" ", ""),
                    FirstName = GoogleUser["given_name"]?.ToString(),
                    LastName = GoogleUser["family_name"]?.ToString() ?? GoogleUser["given_name"]?.ToString(),
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                await _userRepository.Create(user, hashedPassword);
            }
            await _userManager.AddLoginAsync(user, new UserLoginInfo("Google", GoogleId, "Google"));

            string role = await _userService.GetRole(user);
            var jwtToken = _jwtService.GenerateJWTToken(user.Id, user.UserName!,role);

            return new SuccessResponseDTO("Google authentication successful", new JWTDTO(jwtToken));
        }

        public async Task<ResponseDTO> VerifyFacebookTokenAsync(string token)
        {
            string facebookApiUrl = $"https://graph.facebook.com/me?fields=id,name,first_name,last_name,email,picture&access_token={token}";

            HttpResponseMessage response = await _httpClient.GetAsync(facebookApiUrl);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Invalid Facebook access token");
            }

            var FacebookUserString = await response.Content.ReadAsStringAsync();
            var FacebookUser = JObject.Parse(FacebookUserString);

            string FacebookId = FacebookUser["id"]?.ToString();

            var user = await _userManager.FindByLoginAsync("Facebook", FacebookId);
            user = await _userService.GetUserByEmail(FacebookUser["email"]?.ToString());
            if (user == null)
            {
                var passwordHasher = new PasswordHasher<object>();
                string randomPassword = Guid.NewGuid().ToString("N").Substring(0, 8) + "A!";
                string hashedPassword = passwordHasher.HashPassword(null, randomPassword);

                user = new User
                {
                    Email = FacebookUser["email"]?.ToString(),
                    UserName = FacebookUser["name"]?.ToString().Replace(" ", ""),
                    FirstName = FacebookUser["first_name"]?.ToString(),
                    LastName = FacebookUser["last_name"]?.ToString(),
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                await _userRepository.Create(user, hashedPassword);
            }
            await _userManager.AddLoginAsync(user, new UserLoginInfo("Facebook", FacebookId, "Facebook"));

            string role = await _userService.GetRole(user);
            var jwtToken = _jwtService.GenerateJWTToken(user.Id, user.UserName!,role);

            return new SuccessResponseDTO("Login successful", new JWTDTO(jwtToken));
        }


        public async Task<string> GenerateTwoFactorTokenAsync(User user)
        {
            string token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");
            _memoryCache.Set($"2fa_token:{user.Id}", token, TimeSpan.FromMinutes(10));
            return token;
        }


        public async Task<ResponseDTO> ValidateTwoFactorTokenAsync(TwoFactorRequest request)
        {
            var user = await _userService.GetUserByEmail(request.Email);

            _memoryCache.TryGetValue($"2fa_token:{user?.Id}", out string cachedToken);

            if (cachedToken == null || cachedToken != request.Token)
            {
                return new ErrorResponseDTO("Invalid or expired two-factor authentication token.", "TokenMismatch", 400);
            }

            _memoryCache.Remove($"2fa_token:{user?.Id}");

            if (await _userManager.VerifyTwoFactorTokenAsync(user, "Email", request.Token))
            {
                string role = await _userService.GetRole(user);
                return new SuccessResponseDTO("Two Factor Authentication successful", new JWTDTO(_jwtService.GenerateJWTToken(user.Id, user.UserName!,role)));
            }

            return new ErrorResponseDTO("Invalid or expired two-factor authentication token.", "TokenMismatch", 400);
        }
    }
}
