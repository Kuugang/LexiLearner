using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

using Microsoft.IdentityModel.Tokens;

using LexiLearner.Interfaces;

namespace LexiLearner
{
    public class JWTService : IJWTService
    {

        private readonly IConfiguration _configuration;

        public JWTService(IConfiguration configuration)
        {

            // Console.WriteLine("What");
            // Console.WriteLine(configuration["JWT:Secret"]);
            _configuration = configuration;
        }


        public string GenerateJWTToken(string userId, string username)
        {
            var claims = new List<Claim>
            {
                // new Claim(ClaimTypes.Name, username),  // Username as 'Name' claim (optional, for better readability)
                new Claim(ClaimTypes.NameIdentifier, userId), // Use ClaimTypes.NameIdentifier for user ID
                // new Claim(ClaimTypes.Role, role), // Role as a ClaimTypes.Role claim
                // new Claim(ClaimTypes.Sid, userId), // This can also be used for user ID (alternative)
                // new Claim(ClaimTypes.Upn, username), // UserPrincipalName for the username (if needed)

                // Optional: iat (Issued At) can be represented as a Unix timestamp
                new Claim(ClaimTypes.DateOfBirth, DateTime.UtcNow.ToString("yyyy-MM-dd")), // Example custom claim for DOB (optional)
            };

            // Set token expiration (optional)
            var expiration = DateTime.UtcNow.AddHours(1); // Token expires in 1 hour

            var secret = Environment.GetEnvironmentVariable("JWT_SECRET");
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var tokenDescriptor = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: claims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.WriteToken(tokenDescriptor); // Create the token as a string

            return token;
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
    }
}
