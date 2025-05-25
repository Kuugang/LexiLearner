using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;

using Microsoft.IdentityModel.Tokens;

using LexiLearner.Interfaces;
using LexiLearner.Data;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using LexiLearner.Exceptions;

namespace LexiLearner
{
    public class JWTService : IJWTService
    {

        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly DataContext _context;

        public JWTService(IConfiguration configuration, IUserService userService, DataContext context)
        {
            _configuration = configuration;
            _userService = userService;
            _context = context;
        }


        public string GenerateJWTToken(string userId, string role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.DateOfBirth, DateTime.UtcNow.ToString("yyyy-MM-dd"))
            };

            if (!string.IsNullOrWhiteSpace(role))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var secret = Environment.GetEnvironmentVariable("JWT_SECRET");
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var tokenDescriptor = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(10),
                claims: claims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            var TokenHandler = new JwtSecurityTokenHandler();
            return TokenHandler.WriteToken(tokenDescriptor);
        }

        public ClaimsPrincipal ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET"));  // Secret key from your configuration.

            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
                return principal;
            }
            catch (Exception e)
            {
                Console.WriteLine("Token validation failed: " + e.Message);
                return null;  // Token validation failed
            }
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public async Task<JWTDTO> GenerateTokens(string UserId, string role)
        {
            var AccessToken = GenerateJWTToken(UserId, role);

            RefreshToken RefreshToken = new RefreshToken
            {
                Token = GenerateRefreshToken(),
                UserId = UserId,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                IsRevoked = false,
            };
            await AddRefreshToken(RefreshToken);

            return new JWTDTO(AccessToken, RefreshToken);
        }


        public async Task AddRefreshToken(RefreshToken RefreshToken)
        {
            await _context.RefreshToken.AddAsync(RefreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task<string> RefreshAccessToken(RefreshTokensDTO RefreshTokensDTO)
        {
            var claims = GetClaimsFromExpiredToken(RefreshTokensDTO.AccessToken);
            var User = await _userService.GetUserFromToken(claims);
            if (User == null)
            {
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "Failed to refresh access token",
                    StatusCodes.Status403Forbidden
                );
            }
            var role = await _userService.GetRole(User);
            var refreshToken = _context.RefreshToken.SingleOrDefault(x => x.Token == RefreshTokensDTO.RefreshToken && x.IsRevoked == false);

            if (refreshToken == null)
            {
                throw new ApplicationExceptionBase(
                    $"Refresh token does not exist",
                    "Failed to refresh access token",
                    StatusCodes.Status403Forbidden
                );
            }

            if (refreshToken.ExpiryDate < DateTime.UtcNow)
            {
                refreshToken.IsRevoked = true;
                _context.RefreshToken.Update(refreshToken);
                await _context.SaveChangesAsync();
            }

            if (refreshToken == null || refreshToken.IsRevoked)
            {
                throw new ApplicationExceptionBase(
                    $"Invalid refresh token",
                    "Failed to refresh access token",
                    StatusCodes.Status403Forbidden
                );
            }

            var NewJWT = GenerateJWTToken(User.Id, role);
            return NewJWT;
        }

        public ClaimsPrincipal GetClaimsFromExpiredToken(string token)
        {
            var secret = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET"));  // Secret key from your configuration.
            var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
            var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(secret),
                ValidateLifetime = false,
                ValidAudience = audience,
                ValidIssuer = issuer
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
                return principal;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return null;
            }
        }
    }
}
