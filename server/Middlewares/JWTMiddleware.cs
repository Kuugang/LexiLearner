using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using LexiLearner.Models;
using LexiLearner.Interfaces;

namespace LexiLearner.Middlewares
{


    public class JwtOptions
    {
        public string Secret { get; set; }
        public string ValidIssuer { get; set; }
        public string ValidAudience { get; set; }
    }

    public class JWTMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IJWTService _jwtService;

        public JWTMiddleware(RequestDelegate next, IJWTService jwtService)
        {
            _next = next;
            _jwtService = jwtService;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            Console.WriteLine("TOKEN:"+token);

            if (!string.IsNullOrEmpty(token))
            {
                var principal = _jwtService.ValidateToken(token);
                if (principal != null)
                {
                    context.User = principal;  // Sets the User on HttpContext
                }
            }

            await _next(context);  // Continue to the next middleware
        }
    }
}
