using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Distributed;

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

        public AuthService(HttpClient httpClient, IUserRepository userRepository, IUserService userService, UserManager<User> userManager, IJWTService jwtService, IConfiguration configuration)
        {
            _userService = userService;
            _userManager = userManager;
            _httpClient = httpClient;
            _userRepository = userRepository;
            _jwtService = jwtService;
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

            var token = _jwtService.GenerateJWTToken(user.Id, user.UserName!);

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

            var googleUserString = await response.Content.ReadAsStringAsync();
            var googleUser = JObject.Parse(googleUserString);

            string email = googleUser["email"]?.ToString();

            var user = await _userService.GetUserByEmail(email);

            if (user == null)
            {
                var passwordHasher = new PasswordHasher<object>();
                string randomPassword = Guid.NewGuid().ToString("N").Substring(0, 8) + "A!";
                string hashedPassword = passwordHasher.HashPassword(null, randomPassword);

                user = new User
                {
                    Email = googleUser["email"]?.ToString(),
                    UserName = googleUser["name"]?.ToString().Replace(" ", ""),
                    FirstName = googleUser["given_name"]?.ToString(),
                    LastName = googleUser["family_name"]?.ToString() ?? googleUser["given_name"]?.ToString(),
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                await _userRepository.Create(user, hashedPassword);
            }

            var jwtToken = _jwtService.GenerateJWTToken(user.Id, user.UserName!);

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

            var facebookUserString = await response.Content.ReadAsStringAsync();
            var facebookUser = JObject.Parse(facebookUserString);

            string email = facebookUser["email"]?.ToString();
            Console.WriteLine(email);

            var user = await _userService.GetUserByEmail(email);
            if (user == null)
            {
                var passwordHasher = new PasswordHasher<object>();
                string randomPassword = Guid.NewGuid().ToString("N").Substring(0, 8) + "A!";
                string hashedPassword = passwordHasher.HashPassword(null, randomPassword);

                user = new User
                {
                    //TODO: WHAT IF NULL EMAIL
                    Email = facebookUser["email"]?.ToString(),
                    UserName = facebookUser["name"]?.ToString().Replace(" ", ""),
                    FirstName = facebookUser["first_name"]?.ToString(),
                    LastName = facebookUser["last_name"]?.ToString(),
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                await _userRepository.Create(user, hashedPassword);
            }


            var jwtToken = _jwtService.GenerateJWTToken(user.Id, user.UserName!);

            return new SuccessResponseDTO("Login successful", new JWTDTO(jwtToken));
        }


        public async Task<string> GenerateTwoFactorTokenAsync(User user)
        {
            string token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");

            // await _cache.SetStringAsync($"2fa_token:{user.Id}", token, new DistributedCacheEntryOptions
            // {
            //     AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(3)
            // });

            return token;
        }


        public async Task<ResponseDTO> ValidateTwoFactorTokenAsync(TwoFactorRequest request)
        {
            var user = await _userService.GetUserByEmail(request.Email);

            // var cachedToken = await _cache.GetStringAsync($"2fa_token:{user.Id}");
            //
            // if (cachedToken == null || cachedToken != request.Token)
            // {
            //     return new ErrorResponseDTO("Invalid or expired two-factor authentication token.", "TokenMismatch", 400);
            // }
            //
            // await _cache.RemoveAsync($"2fa_token:{user.Id}");

            // if (await _userManager.VerifyTwoFactorTokenAsync(user, "Email", request.Token))
            // {
            //     return new SuccessResponseDTO("Two Factor Authentication successful", new JWTDTO(_jwtService.GenerateJWTToken(user.Id, user.UserName!)));
            // }
            return new SuccessResponseDTO("Two Factor Authentication successful", new JWTDTO(_jwtService.GenerateJWTToken(user.Id, user.UserName!)));


            // return new ErrorResponseDTO("Invalid or expired two-factor authentication token.", "TokenMismatch", 400);
        }
    }
}
