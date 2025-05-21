using System.Text.Json;
using LexiLearner.Data;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using Microsoft.EntityFrameworkCore;
namespace LexiLearner.Repository
{
    public class MinigameRepository(DataContext dataContext) : IMinigameRepository
    {
        private readonly DataContext _dataContext = dataContext;

        public async Task<Minigame> Create(Minigame minigame)
        {
            await _dataContext.Minigame.AddAsync(minigame);
            await _dataContext.SaveChangesAsync();
            return minigame;
        }

        public async Task<Minigame?> GetMinigameById(Guid id)
        {
            return await _dataContext.Minigame.FirstOrDefaultAsync(mg => mg.Id == id);
        }

        public async Task<List<Minigame>> GetMinigames()
        {
            return await _dataContext.Minigame.ToListAsync();
        }

        public async Task<List<Minigame>> GetMinigamesByRMId(Guid readingMatId)
        {
            return await _dataContext.Minigame.Where(mg => mg.ReadingMaterialId == readingMatId).ToListAsync();
        }


        public async Task<MinigameLog> Create(MinigameLog minigameLog)
        {
            await _dataContext.MinigameLog.AddAsync(minigameLog);
            await _dataContext.SaveChangesAsync();
            return minigameLog;
        }

        public async Task<MinigameLog?> GetMinigameLogById(Guid id)
        {
            return await _dataContext.MinigameLog.FirstOrDefaultAsync(mgl => mgl.Id == id);
        }

        public async Task<List<MinigameLog>> GetMinigameLogs()
        {
            return await _dataContext.MinigameLog.ToListAsync();
        }

        public async Task<List<MinigameLog>> GetMinigameLogsByRMId(Guid readingMatId)
        {
            return await _dataContext.MinigameLog.Where(mgl => mgl.Minigame.ReadingMaterialId == readingMatId).ToListAsync();
        }

        public async Task<List<MinigameLog>> GetMinigameLogByReadingSessionId(Guid ReadingSessionId)
        {
            return await _dataContext.MinigameLog
                .Include(mgl => mgl.Minigame)
                .Where(mgl => mgl.ReadingSessionId == ReadingSessionId)
                .ToListAsync();
        }


        //TODO: Make a session service for this
        public async Task Complete(Pupil Pupil)
        {
            _dataContext.Update(Pupil);
            await _dataContext.SaveChangesAsync();
        }
        
        public async Task<List<Minigame>> GetMinigamesByRMIdAndType(Guid readingMaterialId, MinigameType minigameType)
        {
            return await _dataContext.Minigame
                .Where(mg => mg.ReadingMaterialId == readingMaterialId && mg.MinigameType == minigameType)
                .ToListAsync();
        }

        public async Task<MinigameLog?> GetMinigameLogByMIdRSId(Guid ReadingSessionId, Guid MinigameId)
        {
            return await _dataContext.MinigameLog.FirstOrDefaultAsync(mgl => mgl.MinigameId == MinigameId && mgl.ReadingSessionId == ReadingSessionId);
        }

        public async Task<List<MinigameLog>> GetMinigameLogsByPupilIdandRMId(Guid PupilId, Guid ReadingMaterialId)
        {
            return await _dataContext.MinigameLog.AsNoTracking()
                .Include(mgl => mgl.ReadingSession)
                .Where(mgl => mgl.PupilId == PupilId && mgl.ReadingSession.ReadingMaterialId == ReadingMaterialId)
                .ToListAsync();
        }
        
        public async Task<Dictionary<MinigameType, double>> GetAvgNormalizedScoreByType(Guid pupilId, Guid readingMaterialId)
        {
            var logs = await _dataContext.MinigameLog
                .Where(log => log.PupilId == pupilId 
                        && log.Minigame.ReadingMaterialId == readingMaterialId 
                        && !string.IsNullOrEmpty(log.Result) 
                        && log.Minigame.MaxScore > 0)
                .Select(log => new {
                    log.Minigame.MinigameType,
                    log.Minigame.MaxScore,
                    log.Result
                })
                .ToListAsync();

            var groupedAverages = logs
                .GroupBy(log => log.MinigameType)
                .ToDictionary(
                    g => g.Key,
                    g => g.Average(log => ExtractScoreFromResult(log.Result) / (double)log.MaxScore)
                );

            return groupedAverages;
        }
        
        private static int ExtractScoreFromResult(string result)
        {
            int score = 0;
            
            if (!string.IsNullOrEmpty(result))
            {
                var outerJsonElement = JsonSerializer.Deserialize<JsonElement>(result);

                if (outerJsonElement.ValueKind == JsonValueKind.String)
                {
                    var innerJson = outerJsonElement.GetString();
                    var resultJson = JsonSerializer.Deserialize<JsonElement>(innerJson);

                    if (resultJson.TryGetProperty("score", out var scoreElement) &&
                        scoreElement.TryGetInt32(out var parsedScore))
                    {
                        score = parsedScore;
                    }
                }
                else if (outerJsonElement.ValueKind == JsonValueKind.Object)
                {
                    if (outerJsonElement.TryGetProperty("score", out var scoreElement) &&
                        scoreElement.TryGetInt32(out var parsedScore))
                    {
                        score = parsedScore;
                    }
                }
            }
            
        
            return score;
        }
    }
}
