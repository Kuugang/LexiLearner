using System.Security.Claims;
using LexiLearner.Exceptions;
using LexiLearner.Interfaces;


using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Services
{
    public class ReadingSessionService : IReadingSessionService
    {
        private readonly IReadingSessionRepository _readingSessionRepository;
        private readonly IReadingMaterialService _readingMaterialService;
        private readonly IUserService _userService;
        public ReadingSessionService(IReadingSessionRepository readingSessionRepository, IUserService userService, IReadingMaterialService readingMaterialService)
        {
            _readingSessionRepository = readingSessionRepository;
            _userService = userService;
            _readingMaterialService = readingMaterialService;
        }

        public async Task<ReadingSessionDTO> Create(Guid ReadingMaterialId, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);

            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "Reading session creation failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var pupil = await _userService.GetPupilByUserId(user.Id);
            if (pupil == null)
            {
                throw new ApplicationExceptionBase(
                    $"Pupil does not exist.",
                    "Reading session creation failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var readingMat = await _readingMaterialService.GetById(ReadingMaterialId);
            if (readingMat == null)
            {
                throw new ApplicationExceptionBase(
                    $"Reading material with id {ReadingMaterialId} not found",
                    "Reading session creation failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var readingSession = new ReadingSession
            {
                Pupil = pupil,
                PupilId = pupil.Id,
                ReadingMaterialId = readingMat.Id,
                ReadingMaterial = readingMat,
                CompletionPercentage = 0
            };

            readingSession = await _readingSessionRepository.Create(readingSession);

            return new ReadingSessionDTO(readingSession);
        }

        public async Task<ReadingSessionDTO> Update(Guid readingSessionId, ReadingSessionDTO.Update request)
        {
            var readingSession = await _readingSessionRepository.GetReadingSessionById(readingSessionId);
            if (readingSession == null)
            {
                throw new ApplicationExceptionBase(
                    "Reading session does not exist",
                    "Updating reading session failed.",
                    StatusCodes.Status404NotFound
                );
            }

            if (request.CompletionPercentage != null)
            {
                readingSession.CompletionPercentage = (float)request.CompletionPercentage;
                if (readingSession.CompletionPercentage == 100)
                {
                    readingSession.CompletedAt = DateTime.UtcNow;
                }
            }

            if (request.CompletedAt != null)
            {
                readingSession.CompletedAt = (DateTime)request.CompletedAt;
            }

            await _readingSessionRepository.Update(readingSession);
            return new ReadingSessionDTO(readingSession);
        }

        public async Task<ReadingSession?> GetReadingSessionById(Guid ReadingSessionId)
        {
            return await _readingSessionRepository.GetReadingSessionById(ReadingSessionId);
        }


        public async Task<List<ReadingSession>> GetReadingSessionByReadingMaterialId(Guid ReadingMaterialId)
        {
            return await _readingSessionRepository.GetReadingSessionByReadingMaterialId(ReadingMaterialId);
        }

        public async Task<List<ReadingMaterial>> GetReadingMaterialsRead(Guid PupilId)
        {
            return await _readingSessionRepository.GetReadingMaterialsRead(PupilId);
        }

        public async Task<List<ReadingSession>> GetIncompleteReadingSessionsByPupil(ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "Fetching incomplete reading sessions failed.",
                    StatusCodes.Status404NotFound
                );
            }

            Pupil? pupil = await _userService.GetPupilByUserId(user.Id);
            if (pupil == null)
            {
                throw new ApplicationExceptionBase(
                    $"Pupil does not exist.",
                    "Fetching incomplete reading sessions failed.",
                    StatusCodes.Status404NotFound
                );
            }

            return await _readingSessionRepository.GetIncompleteReadingSessionsByPupilId(pupil.Id);
        }

        public async Task<List<ReadingSession>> GetIncompleteReadingSessionsByPupilId(Guid pupilId)
        {
            return await _readingSessionRepository.GetIncompleteReadingSessionsByPupilId(pupilId);
        }

        public async Task<List<ReadingMaterial>> GetIncompleteReadingMaterialsByPupil(ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "Fetching incomplete reading sessions failed.",
                    StatusCodes.Status404NotFound
                );
            }

            Pupil? pupil = await _userService.GetPupilByUserId(user.Id);
            if (pupil == null)
            {
                throw new ApplicationExceptionBase(
                    $"Pupil does not exist.",
                    "Fetching incomplete reading sessions failed.",
                    StatusCodes.Status404NotFound
                );
            }

            return await _readingSessionRepository.GetIncompleteReadingMaterialsByPupilId(pupil.Id);
        }
    }
}

