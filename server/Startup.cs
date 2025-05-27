using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;

using DotNetEnv;

using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;

using LexiLearner.Data;
using LexiLearner.Models;
using LexiLearner.Middlewares;
using LexiLearner.Middlewares.Filters;
using LexiLearner.Interfaces;
using LexiLearner.Services;
using LexiLearner.Repository;
using LexiLearner.Validators;
using LexiLearner.Extensions;


namespace LexiLearner
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            var root = Directory.GetCurrentDirectory();
            var dotenvPath = Path.Combine(root, ".env");

            if (File.Exists(dotenvPath))
            {
                Env.Load();

            }
            else
            {
                throw new FileNotFoundException($".env file not found.");
            }

            var defaultConnection = $"Host={Env.GetString("DB_HOST")};Port={Env.GetString("DB_PORT")};Username={Env.GetString("DB_USERNAME")};Password={Env.GetString("DB_PASSWORD")};Database={Env.GetString("DB_NAME")}";
            var redisConnection = Env.GetString("REDIS_CONNECTION");
            var jwtAudience = Env.GetString("JWT_AUDIENCE");
            var jwtIssuer = Env.GetString("JWT_ISSUER");
            var jwtSecret = Env.GetString("JWT_SECRET");

            var inMemorySettings = new Dictionary<string, string>
            {
                { "ConnectionStrings:DefaultConnection", defaultConnection },
                { "ConnectionStrings:Redis", redisConnection },
                { "JWT:ValidAudience", jwtAudience },
                { "JWT:ValidIssuer", jwtIssuer },
                { "JWT:Secret", jwtSecret }
            };

            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .AddEnvironmentVariables()
                .AddInMemoryCollection(inMemorySettings);

            Configuration = builder.Build();
        }


        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });
            services.AddMemoryCache();
            services.AddRateLimiter(options =>
            {
                options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                {
                    var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                    return RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: ipAddress,
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 10,
                            Window = TimeSpan.FromSeconds(1),
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                            QueueLimit = 0
                        });
                });

                options.RejectionStatusCode = 429;
                options.OnRejected = async (context, token) =>
                    {
                        context.HttpContext.Response.ContentType = "application/json";
                        context.HttpContext.Response.StatusCode = 429;

                        var response = new
                        {
                            StatusCode = 429,
                            Error = "Too many requests. Please try again later."
                        };

                        var json = System.Text.Json.JsonSerializer.Serialize(response);

                        await context.HttpContext.Response.WriteAsync(json, token);
                    };

            });



            services.Configure<JwtOptions>(Configuration.GetSection("JWT"));

            services.AddControllers()
             .AddJsonOptions(options =>
             {
                 options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                 options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                 options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                 options.AllowInputFormatterExceptionMessages = true;
             });



            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });

            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });
            services.AddControllers(options =>
            {
                options.Filters.Add<ValidateModelAttribute>();
                options.Filters.Add<GlobalExceptionFilter>();
            });

            services.AddScoped<IJWTService, JWTService>();

            services.AddSingleton<IAuthorizationMiddlewareResultHandler, CustomAuthorizationMiddlewareResultHandler>();

            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITwoFactorAuthService, TwoFactorAuthService>();
            services.AddHttpClient<IAuthService, AuthService>();
            services.AddScoped<IGenreService, GenreService>();
            services.AddScoped<IReadabilityService, ReadabilityService>();
            services.AddScoped<IReadingMaterialService, ReadingMaterialService>();
            services.AddScoped<IFileUploadService, FileUploadService>();
            services.AddScoped<IPupilService, PupilService>();
            services.AddScoped<IMinigameService, MinigameService>();
            services.AddScoped<IClassroomService, ClassroomService>();
            services.AddScoped<IReadingSessionService, ReadingSessionService>();
            services.AddScoped<IAchievementService, AchievementService>();
            services.AddScoped<IReadingAssignmentService, ReadingAssignmentService>();

            services.AddScoped<IClassroomRepository, ClassroomRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IGenreRepository, GenreRepository>();
            services.AddScoped<IReadingMaterialRepository, ReadingMaterialRepository>();
            services.AddScoped<IPupilRepository, PupilRepository>();
            services.AddScoped<IMinigameRepository, MinigameRepository>();
            services.AddScoped<IReadingSessionRepository, ReadingSessionRepository>();
            services.AddScoped<IAchievementRepository, AchievementRepository>();

            // Configure Entity Framework with PostgreSQL
            services.AddDbContext<DataContext>(options =>
            options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            // Configure Identity
            services.AddIdentity<User, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.SignIn.RequireConfirmedEmail = false;
            })
            .AddUserValidator<OptionalEmailUserValidator<User>>()
            .AddEntityFrameworkStores<DataContext>()
            .AddDefaultTokenProviders()
            .AddTokenProvider<DataProtectorTokenProvider<User>>("MyApp");

            // Configure Authentication
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = Configuration["JWT:ValidAudience"],
                    ValidIssuer = Configuration["JWT:ValidIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Secret"])),
                };
            });


            services.AddAuthorization(options =>
            {
                options.AddPolicy("TeacherPolicy", policy =>
                    policy.RequireClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", "Teacher"));

                options.AddPolicy("PupilPolicy", policy =>
                    policy.RequireClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", "Pupil"));

                options.AddPolicy("AdminPolicy", policy =>
                    policy.RequireClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", "Admin"));

                options.AddPolicy("TeacherPupilPolicy", policy =>
                    policy.RequireClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", "Teacher", "Pupil"));
            });


            //Redis
            // services.AddStackExchangeRedisCache(options =>
            // {
            //     options.Configuration = Configuration.GetConnectionString("Redis");
            // });


            // Enable Swagger for API documentation
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "LexiLearner v1"));
            }

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Uploads")),
                RequestPath = "/Uploads"
            });

            // Register JwtAuthenticationService as middleware
            app.UseMiddleware<JWTMiddleware>();
            app.UseRateLimiter();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCookiePolicy(new CookiePolicyOptions
            {
                MinimumSameSitePolicy = SameSiteMode.None,
                Secure = CookieSecurePolicy.Always
            });

            app.UseCors("AllowAll");
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.SeedDatabaseAsync().Wait();
        }
    }
}
