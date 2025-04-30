using LexiLearner.Data;
using LexiLearner.Interfaces;

namespace LexiLearner.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static async Task SeedDatabaseAsync(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<DataContext>();
            var genreService = scope.ServiceProvider.GetRequiredService<IGenreService>();
            var readabilityService = scope.ServiceProvider.GetRequiredService<IReadabilityService>();

            await DataContextSeeder.LoadMaterialsAsync(context, genreService, readabilityService);
        }
    }
}
