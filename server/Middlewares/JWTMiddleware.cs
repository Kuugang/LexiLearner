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

        public JWTMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (!string.IsNullOrEmpty(token))
            {
                var _jwtService = context.RequestServices.GetRequiredService<IJWTService>();
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
