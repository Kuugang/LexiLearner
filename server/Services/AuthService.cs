using System.Text;
using System.Net.Http;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Distributed;

        
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Middlewares;
using LexiLearner.Models.DTO;
using LexiLearner.Exceptions;
using LexiLearner.Repository;


namespace LexiLearner.Services
{
    public class AuthService : IAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly CachedUserRepository _cachedUserRepository;
        private readonly IUserService _userService;
        private readonly UserManager<User> _userManager;
        private readonly IDistributedCache _cache;
        private readonly IJWTService _jwtService;

        public AuthService(HttpClient httpClient, CachedUserRepository cachedUserRepository, IUserService userService, UserManager<User> userManager, IDistributedCache cache, IJWTService jwtService, IConfiguration configuration){
            _userService = userService;
            _userManager = userManager;
            _httpClient = httpClient;
            _cachedUserRepository = cachedUserRepository;
            _cache = cache;
            _jwtService = jwtService;
        }

		public async Task<SuccessResponseDTO> Login(LoginRequest LoginRequest){
            var user = await _userService.GetUserByEmail(LoginRequest.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, LoginRequest.Password))
            {
                throw new ApplicationExceptionBase(
                    "Invalid credentials",
                    "Login failed",
                    StatusCodes.Status401Unauthorized
                );
            }

            if(user.TwoFactorEnabled == true){
                var emailService = new EmailService();
                string code = await GenerateTwoFactorTokenAsync(user);
                await emailService.SendEmailAsync(user.Email, "Two Factor Authentication Code", $"Your two-factor authentication code is {code}");

                return new SuccessResponseDTO
                {
                    Message = "Two Factor Authentication Code was sent to your email.",
                };
            }

            var token = _jwtService.GenerateJWTToken(user.Id, user.UserName!);

            return new SuccessResponseDTO
            {
                Message = "Login successful",
                Data = new JWTDTO { Token = token }
            };
        }

        public async Task<SuccessResponseDTO> VerifyGoogleTokenAsync(string token)
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
            if(user == null){
                var passwordHasher = new PasswordHasher<object>();
                string randomPassword = Guid.NewGuid().ToString("N").Substring(0, 8) + "A!";
                string hashedPassword = passwordHasher.HashPassword(null, randomPassword);

                user = new User
                {
                    Email = googleUser["email"]?.ToString(),
                    UserName = googleUser["name"]?.ToString().Replace(" ", ""),
                    FirstName = googleUser["given_name"]?.ToString(),
                    LastName = googleUser["family_name"]?.ToString(),
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                await _cachedUserRepository.Create(user, hashedPassword, null);
            }

            var jwtToken = _jwtService.GenerateJWTToken(user.Id, user.UserName!);
    
            return new SuccessResponseDTO
            {
                Message = "Login successful",
                Data = new JWTDTO { Token = jwtToken }
            };

        }

        public async Task<SuccessResponseDTO> VerifyFacebookTokenAsync(string token)
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

            var user = await _userService.GetUserByEmail(email);
            if(user == null){
                var passwordHasher = new PasswordHasher<object>();
                string randomPassword = Guid.NewGuid().ToString("N").Substring(0, 8) + "A!";
                string hashedPassword = passwordHasher.HashPassword(null, randomPassword);

                user = new User
                {
                    Email = facebookUser["email"]?.ToString(),
                    UserName = facebookUser["name"]?.ToString().Replace(" ", ""),
                    FirstName = facebookUser["first_name"]?.ToString(),
                    LastName = facebookUser["last_name"]?.ToString(),
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                await _cachedUserRepository.Create(user, hashedPassword, null);
            }
            

            var jwtToken = _jwtService.GenerateJWTToken(user.Id, user.UserName!);

            return new SuccessResponseDTO
            {
                Message = "Login successful",
                Data = new JWTDTO { Token = jwtToken }
            };
        }


        public async Task<string> GenerateTwoFactorTokenAsync(User user){
            string token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");

            await _cache.SetStringAsync($"2fa_token:{user.Id}", token, new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(3)
            });            

            return token;
        }


        public async Task<ResponseDTO> ValidateTwoFactorTokenAsync(TwoFactorRequest request){
            var user = await _userService.GetUserByEmail(request.Email);

            var cachedToken = await _cache.GetStringAsync($"2fa_token:{user.Id}");

            if (cachedToken == null || cachedToken != request.Token)
            {
                return new ErrorResponseDTO("Invalid or expired two-factor authentication token.", "TokenMismatch", 400);
            }

            await _cache.RemoveAsync($"2fa_token:{user.Id}");

            if(await _userManager.VerifyTwoFactorTokenAsync(user, "Email", request.Token))
            {
                return new SuccessResponseDTO("Two Factor Authentication successful", 
                    new JWTDTO { Token = _jwtService.GenerateJWTToken(user.Id, user.UserName!) });
            }


            return new ErrorResponseDTO("Invalid or expired two-factor authentication token.", "TokenMismatch", 400);
        }


    }
}
