using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using LexiLearner.Models;
using LexiLearner.Interfaces;
using LexiLearner.Exceptions;

namespace LexiLearner.Repository
{
    public class CachedUserRepository : IUserRepository
    {
        private readonly IUserRepository _decorated;
        private readonly IDistributedCache _distributedCache;

        public CachedUserRepository(IUserRepository decorated, IDistributedCache distributedCache)
        {
            _decorated = decorated;
            _distributedCache = distributedCache;
        }

        private async Task<T?> GetFromCacheAsync<T>(string cacheKey)
        {
            var cachedData = await _distributedCache.GetStringAsync(cacheKey);
            return cachedData is null ? default : JsonSerializer.Deserialize<T>(cachedData);
        }

        private async Task SetCacheAsync<T>(string cacheKey, T data, TimeSpan expiration)
        {
            var serializedData = JsonSerializer.Serialize(data);
            var options = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = expiration };
            await _distributedCache.SetStringAsync(cacheKey, serializedData, options);
        }

        private async Task InvalidateCacheAsync(string cacheKey)
        {
            await _distributedCache.RemoveAsync(cacheKey);
        }

        public async Task<User?> GetUserByIdAsync(string userId)
        {
            var cacheKey = $"User_{userId}";
            var user = await GetFromCacheAsync<User>(cacheKey);

            if (user is null)
            {
                user = await _decorated.GetUserByIdAsync(userId);
                if (user is not null)
                {
                    await SetCacheAsync(cacheKey, user, TimeSpan.FromMinutes(30));
                }
            }

            return user;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            var cacheKey = $"User_Email_{email}";
            var user = await GetFromCacheAsync<User>(cacheKey);

            if (user is null)
            {
                user = await _decorated.GetUserByEmail(email);
                if (user is not null)
                {
                    await SetCacheAsync(cacheKey, user, TimeSpan.FromMinutes(30));
                }
            }

            return user;
        }

        public async Task<User?> GetUserByUsername(string username)
        {
            var cacheKey = $"User_Username_{username}";
            var user = await GetFromCacheAsync<User>(cacheKey);

            if (user is null)
            {
                user = await _decorated.GetUserByUsername(username);
                if (user is not null)
                {
                    await SetCacheAsync(cacheKey, user, TimeSpan.FromMinutes(30));
                }
            }

            return user;
        }

        public async Task<User> Create(User user, string password)
        {
            var createdUser = await _decorated.Create(user, password);
            var cacheKey = $"User_{createdUser.Id}";
            await SetCacheAsync(cacheKey, createdUser, TimeSpan.FromMinutes(30));
            return createdUser;
        }

        public async Task CreateProfile(User user, string role)
        {
            await _decorated.CreateProfile(user, role);
        }

        public async Task<Pupil?> GetPupilByUserId(string userId)
        {
            var cacheKey = $"Pupil_{userId}";
            var pupil = await GetFromCacheAsync<Pupil>(cacheKey);

            if (pupil is null)
            {
                pupil = await _decorated.GetPupilByUserId(userId);
                if (pupil is not null)
                {
                    await SetCacheAsync(cacheKey, pupil, TimeSpan.FromMinutes(30));
                }
            }

            return pupil;
        }

        public async Task<Teacher?> GetTeacherByUserId(string userId)
        {
            var cacheKey = $"Teacher_{userId}";
            var teacher = await GetFromCacheAsync<Teacher>(cacheKey);

            if (teacher is null)
            {
                teacher = await _decorated.GetTeacherByUserId(userId);
                if (teacher is not null)
                {
                    await SetCacheAsync(cacheKey, teacher, TimeSpan.FromMinutes(30));
                }
            }

            return teacher;
        }

        public async Task Update<T>(T entity) where T : class
        {
            await _decorated.Update(entity);

            if (entity is User user)
            {
                await InvalidateCacheAsync($"User_{user.Id}");
                await InvalidateCacheAsync($"User_Email_{user.Email}");
            }
            else if (entity is Pupil pupil)
            {
                await InvalidateCacheAsync($"Pupil_{pupil.UserId}");
            }
            else if (entity is Teacher teacher)
            {
                await InvalidateCacheAsync($"Teacher_{teacher.UserId}");
            }
        }

        // idk diri dapita DDD: chatgpt lang eto :(
        public async Task<User> DeleteAccount(User user)
        {
            User deletedUser = await _decorated.DeleteAccount(user);

            // Invalidate related cache entries 

            // comment lng sa basin kani nakapaguba ni profile user DDD:
            // await InvalidateCacheAsync($"User_{user.Id}");
            // await InvalidateCacheAsync($"User_Email_{user.Email}");
            // await InvalidateCacheAsync($"User_Username_{user.UserName}");

            return deletedUser;
        }

        public async Task<LoginStreak?> GetLoginStreak(Guid pupilId)
        {
            var cacheKey = $"LoginStreak_{pupilId}";
            var streak = await GetFromCacheAsync<LoginStreak>(cacheKey);

            if (streak is null)
            {
                streak = await _decorated.GetLoginStreak(pupilId);
                if (streak is not null)
                {
                    await SetCacheAsync(cacheKey, streak, TimeSpan.FromMinutes(30));
                }
            }

            return streak;
        }

        public async Task<LoginStreak> CreateLoginStreak(LoginStreak streak)
        {
            return await _decorated.CreateLoginStreak(streak);
        }
        
        public async Task<Pupil?> GetPupilByPupilId(Guid pupilId)
        {
            var cacheKey = $"Pupil_{pupilId}";
            var pupil = await GetFromCacheAsync<Pupil>(cacheKey);

            if (pupil is null)
            {
                pupil = await _decorated.GetPupilByPupilId(pupilId);
                if (pupil is not null)
                {
                    await SetCacheAsync(cacheKey, pupil, TimeSpan.FromMinutes(30));
                }
            }

            return pupil;
        }

        public async Task<Session> CreateSession(Session session)
        {
            return await _decorated.CreateSession(session);
        }

        public async Task<Session?> GetSessionById(Guid sessionId)
        {
            var cacheKey = $"Session_{sessionId}";
            var session = await GetFromCacheAsync<Session>(cacheKey);

            if (session is null)
            {
                session = await _decorated.GetSessionById(sessionId);
                if (session is not null)
                {
                    await SetCacheAsync(cacheKey, session, TimeSpan.FromMinutes(30));
                }
            }

            return session;
        }

        public async Task<List<Session>> GetSessionsByUserId(string userId)
        {
            var cacheKey = $"Sessions_{userId}";
            var sessions = await GetFromCacheAsync<List<Session>>(cacheKey);

            if (sessions is null)
            {
                sessions = await _decorated.GetSessionsByUserId(userId);
                if (sessions is not null)
                {
                    await SetCacheAsync(cacheKey, sessions, TimeSpan.FromMinutes(30));
                }
            }

            return sessions ?? new List<Session>();
        }

        public async Task<List<PupilLeaderboard>> GetPupilLeaderboardByPupilId(Guid pupilId)
        {
            var cacheKey = $"PupilLeaderboard_{pupilId}";
            var pupilLeaderboard = await GetFromCacheAsync<List<PupilLeaderboard>>(cacheKey);
            if (pupilLeaderboard is null)
            {
                pupilLeaderboard = await _decorated.GetPupilLeaderboardByPupilId(pupilId);
                if (pupilLeaderboard is not null)
                {
                    await SetCacheAsync(cacheKey, pupilLeaderboard, TimeSpan.FromMinutes(30));
                }
            }
            
            return pupilLeaderboard ?? new List<PupilLeaderboard>();
        }

        public async Task<List<PupilLeaderboard>> GetGlobal10Leaderboard()
        {
            var cacheKey = $"Global10Leaderboard";
            var global10Leaderboard = await GetFromCacheAsync<List<PupilLeaderboard>>(cacheKey);
            if (global10Leaderboard is null)
            {
                global10Leaderboard = await _decorated.GetGlobal10Leaderboard();
                if (global10Leaderboard is not null)
                {
                    await SetCacheAsync(cacheKey, global10Leaderboard, TimeSpan.FromMinutes(30));
                }
            }

            return global10Leaderboard ?? new List<PupilLeaderboard>();
        }

        public Task<PupilLeaderboard> CreatePupilLeaderboardEntry(PupilLeaderboard pupilLeaderboard)
        {
            return _decorated.CreatePupilLeaderboardEntry(pupilLeaderboard);
        }
    }
}
