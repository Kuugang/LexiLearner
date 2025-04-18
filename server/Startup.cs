using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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

            services.Configure<JwtOptions>(Configuration.GetSection("JWT"));

            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.DefaultIgnoreCondition =
                        System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
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

            services.AddSingleton<IJWTService, JWTService>();
            services.AddSingleton<IAuthorizationMiddlewareResultHandler, CustomAuthorizationMiddlewareResultHandler>();


            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITwoFactorAuthService, TwoFactorAuthService>();
            services.AddHttpClient<IAuthService, AuthService>();

            services.AddScoped<IUserRepository, UserRepository>();

            // Configure Entity Framework with PostgreSQL
            services.AddDbContext<DataContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"))
            );

            // Configure Identity
            services.AddIdentity<User, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.SignIn.RequireConfirmedEmail = false;
            })
            .AddEntityFrameworkStores<DataContext>()
            .AddDefaultTokenProviders()
            .AddTokenProvider<DataProtectorTokenProvider<User>>("MyApp");

            services.AddTransient<IUserValidator<User>, OptionalEmailUserValidator<User>>();

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
                options.AddPolicy("OwnerPolicy", policy =>
                    policy.RequireClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", "Owner"));

                options.AddPolicy("CustomerPolicy", policy =>
                    policy.RequireClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", "Customer"));

                options.AddPolicy("AdminPolicy", policy =>
                    policy.RequireClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", "Admin"));

                options.AddPolicy("OwnerCustomerPolicy", policy =>
                    policy.RequireClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", "Customer", "Owner"));
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

            // Register JwtAuthenticationService as middleware

            app.UseMiddleware<JWTMiddleware>();

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
        }
    }
}
