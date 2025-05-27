using System.Security.Claims;
using System.Text.Json;
using LexiLearner.Data;
using LexiLearner.Exceptions;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Services
{
    public class ReadingAssignmentService : IReadingAssignmentService
    {
        private readonly IClassroomRepository _classroomRepository;
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;
        private readonly DataContext _context;
        private readonly IMinigameRepository _minigameRepository;
        private readonly IReadingMaterialRepository _readingMaterialRepository;
        private readonly IClassroomService _classroomService;
        public ReadingAssignmentService(IClassroomRepository classroomRepository, IUserService userService, IUserRepository userRepository, DataContext context, IMinigameRepository minigameRepository, IReadingMaterialRepository readingMaterialRepository, IClassroomService classroomService)
        {
            _classroomRepository = classroomRepository;
            _userService = userService;
            _userRepository = userRepository;
            _readingMaterialRepository = readingMaterialRepository;
            _minigameRepository = minigameRepository;
            _classroomService = classroomService;
            _context = context;
        }

        public async Task<ReadingAssignmentLogDTO> CreateAssignmentLog(Guid ReadingAssignmentId, Guid MinigameLogId)
        {
            var readingAssignment = await GetReadingAssignmentById(ReadingAssignmentId);
            var minigameLog = await _minigameRepository.GetMinigameLogById(MinigameLogId);
            if (minigameLog == null)
            {
                throw new ApplicationExceptionBase(
                    "Minigame log not found.",
                    "Creating assignment log failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var assignmentLog = new ReadingAssignmentLog
            {
                ReadingMaterialAssignment = readingAssignment,
                ReadingMaterialAssignmentId = ReadingAssignmentId,
                MinigameLogId = MinigameLogId,
                MinigameLog = minigameLog
            };

            assignmentLog = await _classroomRepository.CreateAssignmentLog(assignmentLog);
            return new ReadingAssignmentLogDTO(assignmentLog);
        }

        public async Task<ReadingMaterialAssignmentDTO> CreateReadingAssignment(Guid ClassroomId, ReadingMaterialAssignmentDTO.Create Request, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "User not found.",
                    "Creating reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var teacher = await _userService.GetTeacherByUserId(user.Id);
            if (teacher == null)
            {
                throw new ApplicationExceptionBase(
                    "Teacher not found.",
                    "Creating reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var classroom = await _classroomRepository.GetById(ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    "Classroom not found.",
                    "Creating reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            if (teacher.Id != classroom.TeacherId)
            {
                throw new ApplicationExceptionBase(
                    "Teacher is not the teacher of the classroom.",
                    "Creating reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var readingMaterial = await _readingMaterialRepository.GetByIdAsync(Request.ReadingMaterialId);
            if (readingMaterial == null)
            {
                throw new ApplicationExceptionBase(
                    "Reading material not found.",
                    "Creating reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var minigames = await _minigameRepository.GetMinigamesByRMId(readingMaterial.Id);
            if (minigames == null || !minigames.Any())
            {
                throw new ApplicationExceptionBase(
                    "Minigames not found.",
                    "Creating reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var random = new Random();
            var minigame = minigames.Where(m => m.MinigameType == Request.MinigameType).OrderBy(m => random.NextDouble()).First();

            var readingAssignment = new ReadingMaterialAssignment
            {
                Id = Guid.NewGuid(),
                ClassroomId = ClassroomId,
                Classroom = classroom,
                Title = Request.Title,
                Description = Request.Description,
                ReadingMaterialId = Request.ReadingMaterialId,
                ReadingMaterial = readingMaterial,
                MinigameId = minigame.Id,
                Minigame = minigame,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            readingAssignment = await _classroomRepository.CreateReadingAssignment(readingAssignment);
            return new ReadingMaterialAssignmentDTO(readingAssignment);
        }

        public async Task DeleteReadingAssignment(Guid ReadingAssignmentId, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "User not found.",
                    "Deleting reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var teacher = await _userService.GetTeacherByUserId(user.Id);
            if (teacher == null)
            {
                throw new ApplicationExceptionBase(
                    "Teacher not found.",
                    "Deleting reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var readingAssignment = await GetReadingAssignmentById(ReadingAssignmentId);
            if (readingAssignment == null)
            {
                throw new ApplicationExceptionBase(
                    "Reading assignment not found.",
                    "Deleting reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var classroom = await _classroomRepository.GetById(readingAssignment.ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    "Classroom not found.",
                    "Deleting reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            if (teacher.Id != classroom.TeacherId)
            {
                throw new ApplicationExceptionBase(
                    "Teacher is not the teacher of the classroom.",
                    "Deleting reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }


            await _classroomRepository.DeleteReadingAssignment(readingAssignment);
        }

        public async Task<List<ReadingMaterialAssignment>> GetActiveReadingAssignmentsByClassroomId(Guid ClassroomId, ClaimsPrincipal User)
        {
            var user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "User not found.",
                    "Failed getting reading assignments from classroom.",
                    StatusCodes.Status404NotFound
                );
            }

            var classroom = await _classroomRepository.GetById(ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    "Classroom not found.",
                    "Failed getting reading assignments from classroom.",
                    StatusCodes.Status404NotFound
                );
            }

            var userRole = await _userService.GetRole(user);

            if (userRole == "Teacher")
            {
                var teacher = await _userService.GetTeacherByUserId(user.Id);
                if (teacher == null)
                {
                    throw new ApplicationExceptionBase(
                        "Teacher not found.",
                        "Failed getting reading assignments from classroom.",
                        StatusCodes.Status404NotFound
                    );
                }

                if (teacher.Id != classroom.TeacherId)
                {
                    throw new ApplicationExceptionBase(
                        "Teacher is not the teacher of the classroom.",
                        "Failed getting reading assignments from classroom.",
                        StatusCodes.Status401Unauthorized
                    );
                }
            }
            else if (userRole == "Pupil")
            {
                var pupil = await _userService.GetPupilByUserId(user.Id);
                if (pupil == null)
                {
                    throw new ApplicationExceptionBase(
                        "Pupil not found.",
                        "Failed getting reading assignments from classroom.",
                        StatusCodes.Status404NotFound
                    );
                }

                var classroomEnrollment = await _classroomRepository.GetClassroomEnrollmentByPupilandClassId(pupil.Id, ClassroomId);
                if (classroomEnrollment == null)
                {
                    throw new ApplicationExceptionBase(
                        "Pupil is not enrolled in the classroom.",
                        "Failed getting reading assignments from classroom.",
                        StatusCodes.Status401Unauthorized
                    );
                }
            }

            return await _classroomRepository.GetActiveReadingAssignmentsByClassroomId(ClassroomId);
        }

        public async Task<List<ReadingMaterialAssignment>> GetAllReadingAssignmentsByClassroomId(Guid ClassroomId, ClaimsPrincipal User)
        {
            var user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "User not found.",
                    "Failed getting reading assignments from classroom.",
                    StatusCodes.Status404NotFound
                );
            }

            var classroom = await _classroomRepository.GetById(ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    "Classroom not found.",
                    "Failed getting reading assignments from classroom.",
                    StatusCodes.Status404NotFound
                );
            }

            var userRole = await _userService.GetRole(user);

            if (userRole == "Teacher")
            {
                var teacher = await _userService.GetTeacherByUserId(user.Id);
                if (teacher == null)
                {
                    throw new ApplicationExceptionBase(
                        "Teacher not found.",
                        "Failed getting reading assignments from classroom.",
                        StatusCodes.Status404NotFound
                    );
                }

                if (teacher.Id != classroom.TeacherId)
                {
                    throw new ApplicationExceptionBase(
                        "Teacher is not the teacher of the classroom.",
                        "Failed getting reading assignments from classroom.",
                        StatusCodes.Status401Unauthorized
                    );
                }
            }
            else if (userRole == "Pupil")
            {
                var pupil = await _userService.GetPupilByUserId(user.Id);
                if (pupil == null)
                {
                    throw new ApplicationExceptionBase(
                        "Pupil not found.",
                        "Failed getting reading assignments from classroom.",
                        StatusCodes.Status404NotFound
                    );
                }

                var classroomEnrollment = await _classroomRepository.GetClassroomEnrollmentByPupilandClassId(pupil.Id, ClassroomId);
                if (classroomEnrollment == null)
                {
                    throw new ApplicationExceptionBase(
                        "Pupil is not enrolled in the classroom.",
                        "Failed getting reading assignments from classroom.",
                        StatusCodes.Status401Unauthorized
                    );
                }
            }

            return await _classroomRepository.GetAllReadingAssignmentsByClassroomId(ClassroomId);
        }

        public async Task<ReadingAssignmentLog> GetAssignmentLogById(Guid ReadingAssignmentLogId)
        {
            var assignmentLog = await _classroomRepository.GetAssignmentLogById(ReadingAssignmentLogId);
            if (assignmentLog == null)
            {
                throw new ApplicationExceptionBase(
                    "Assignment log not found.",
                    "Failed getting assignment log",
                    StatusCodes.Status404NotFound
                );
            }

            return assignmentLog;
        }

        public async Task<List<ReadingAssignmentLog>> GetAssignmentLogByReadingAssignmentIdAndPupilId(Guid ReadingAssignmentId, Guid PupilId)
        {
            var readingAssignment = await GetReadingAssignmentById(ReadingAssignmentId);

            var assignmentLogs = await _classroomRepository.GetAssignmentLogByReadingAssignmentIdAndPupilId(ReadingAssignmentId, PupilId);
            if (assignmentLogs == null)
            {
                throw new ApplicationExceptionBase("Assignment log not found.", "Failed getting assignment log", StatusCodes.Status404NotFound);
            }

            return assignmentLogs;
        }

        public async Task<List<ReadingAssignmentLog>> GetAssignmentLogsByClassroomId(Guid ClassroomId)
        {
            var classroom = await _classroomRepository.GetById(ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    "Classroom not found.",
                    "Failed getting assignment logs",
                    StatusCodes.Status404NotFound
                );
            }

            return await _classroomRepository.GetAssignmentLogsByClassroomId(ClassroomId);
        }

        public async Task<List<ReadingAssignmentLog>> GetAssignmentLogsByClassroomIdAndPupilId(Guid ClassroomId, Guid PupilId)
        {
            var classroom = await _classroomRepository.GetById(ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    "Classroom not found.",
                    "Failed getting assignment logs",
                    StatusCodes.Status404NotFound
                );
            }

            var pupil = await _userService.GetPupilByPupilId(PupilId);
            if (pupil == null)
            {
                throw new ApplicationExceptionBase(
                    "Pupil not found.",
                    "Failed getting assignment logs",
                    StatusCodes.Status404NotFound
                );
            }

            var classroomEnrollment = await _classroomRepository.GetClassroomEnrollmentByPupilandClassId(PupilId, ClassroomId);
            if (classroomEnrollment == null)
            {
                throw new ApplicationExceptionBase(
                    "Pupil is not enrolled in the classroom.",
                    "Failed getting assignment logs",
                    StatusCodes.Status401Unauthorized
                );
            }

            var assignmentLogs = await _classroomRepository.GetAssignmentLogsByClassroomIdAndPupilId(ClassroomId, PupilId);
            if (assignmentLogs == null)
            {
                throw new ApplicationExceptionBase(
                    "Assignment logs not found.",
                    "Failed getting assignment logs",
                    StatusCodes.Status404NotFound
                );
            }

            return assignmentLogs;
        }

        public async Task<List<ReadingAssignmentLog>> GetAssignmentLogsByPupilId(Guid PupilId)
        {
            var pupil = await _userService.GetPupilByPupilId(PupilId);
            if (pupil == null)
            {
                throw new ApplicationExceptionBase(
                    "Pupil not found.",
                    "Failed getting assignment logs",
                    StatusCodes.Status404NotFound
                );
            }

            var assignmentLogs = await _classroomRepository.GetAssignmentLogsByPupilId(PupilId);

            return assignmentLogs;
        }
        public async Task<List<ReadingAssignmentLog>> GetAssignmentLogsByReadingAssignmentId(Guid ReadingAssignmentId, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Failed getting assignment logs.", StatusCodes.Status404NotFound);
            }

            var userRole = await _userService.GetRole(user);
            var readingAssignment = await GetReadingAssignmentById(ReadingAssignmentId);
            var classroom = await _classroomService.GetByClassroomId(readingAssignment.ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase("Classroom not found.", "Failed getting assignment logs.", StatusCodes.Status404NotFound);

            }

            var assignmentLogs = new List<ReadingAssignmentLog>();

            if (userRole == "Teacher")
            {
                Teacher? teacher = await _userService.GetTeacherByUserId(user.Id);
                if (teacher == null || classroom.TeacherId != teacher.Id)
                {
                    throw new ApplicationExceptionBase("Teacher is not the teacher of the classroom.", "Failed getting assignment logs.", StatusCodes.Status404NotFound);
                }

                assignmentLogs = await _classroomRepository.GetAssignmentLogsByReadingAssignmentId(ReadingAssignmentId);
                Console.WriteLine("fetching assignment logs of teacher");

            }
            else if (userRole == "Pupil")
            {
                Pupil? pupil = await _userService.GetPupilByUserId(user.Id);
                if (pupil == null)
                {
                    throw new ApplicationExceptionBase("Pupil is not found.", "Failed getting assignment logs.");
                }

                Console.WriteLine("fetching assignment logs of pupil");
                assignmentLogs = await _classroomRepository.GetAssignmentLogByReadingAssignmentIdAndPupilId(ReadingAssignmentId, pupil.Id);
            }

            return assignmentLogs;
        }

        public async Task<ReadingMaterialAssignment> GetReadingAssignmentById(Guid Id)
        {
            var readingAssignment = await _classroomRepository.GetReadingAssignmentById(Id);
            if (readingAssignment == null)
            {
                throw new ApplicationExceptionBase(
                "Reading Assignment not found",
                "Failed getting reading assignment from Id",
                StatusCodes.Status404NotFound
                );
            }
            return readingAssignment;
        }

        public async Task<ReadingMaterialAssignmentDTO.Overview> GetReadingAssignmentStatByAssignment(ReadingMaterialAssignment ReadingAssignment)
        {
            var assignmentLogs = await _classroomRepository.GetAssignmentLogsByReadingAssignmentId(ReadingAssignment.Id);
            int numPupil = assignmentLogs.Select(ra => ra.MinigameLog.PupilId).Distinct().Count();
            int totalLogs = assignmentLogs.Count();
            int totalScore = 0;
            int totalDuration = 0;

            if (totalLogs > 0)
            {
                foreach (ReadingAssignmentLog assignmentLog in assignmentLogs)
                {
                    MinigameLog log = assignmentLog.MinigameLog;

                    if (!string.IsNullOrEmpty(log.Result))
                    {
                        var result = JsonSerializer.Deserialize<JsonElement>(log.Result);

                        if (result.ValueKind == JsonValueKind.String)
                        {
                            var resultString = result.GetString();
                            result = JsonSerializer.Deserialize<JsonElement>(resultString);
                        }

                        if (result.ValueKind == JsonValueKind.Object)
                        {
                            if (result.TryGetProperty("score", out var scoreElement) &&
                                scoreElement.TryGetInt32(out var parsedScore))
                            {
                                totalScore += parsedScore;
                            }

                            if (result.TryGetProperty("duration", out var durationElement) &&
                                durationElement.TryGetInt32(out var parsedDuration))
                            {
                                totalDuration += parsedDuration;
                            }
                        }
                    }
                }
            }

            double averageScore = totalLogs > 0 ? (double)totalScore / totalLogs : 0;
            double averageDuration = totalLogs > 0 ? (double)totalDuration / totalLogs : 0;

            return new ReadingMaterialAssignmentDTO.Overview(ReadingAssignment, numPupil, averageScore, averageDuration);
        }

        public async Task<ReadingMaterialAssignmentDTO.Overview> GetReadingAssignmentStatByAssignmentId(Guid ReadingAssignmentId, ClaimsPrincipal User)
        {
            var user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "User not found.",
                    "Failed getting reading assignment stats",
                    StatusCodes.Status404NotFound
                );
            }

            var teacher = await _userService.GetTeacherByUserId(user.Id);
            if (teacher == null)
            {
                throw new ApplicationExceptionBase(
                    "Teacher not found.",
                    "Failed getting reading assignment stats",
                    StatusCodes.Status404NotFound
                );
            }

            var readingAssignment = await GetReadingAssignmentById(ReadingAssignmentId);
            var classroom = await _classroomService.GetByClassroomId(readingAssignment.ClassroomId);
            if (teacher.Id != classroom.TeacherId)
            {
                throw new ApplicationExceptionBase(
                    "Teacher is not the teacher of the classroom.",
                    "Failed getting reading assignment stats",
                    StatusCodes.Status401Unauthorized
                );
            }

            return await GetReadingAssignmentStatByAssignment(readingAssignment);
        }


        public async Task<List<ReadingMaterialAssignmentDTO.Overview>> GetReadingAssignmentStatByClassroomId(Guid ClassroomId, ClaimsPrincipal User)
        {
            var user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "User not found.",
                    "Failed getting reading assignment stats",
                    StatusCodes.Status404NotFound
                );
            }

            var teacher = await _userService.GetTeacherByUserId(user.Id);
            if (teacher == null)
            {
                throw new ApplicationExceptionBase(
                    "Teacher not found.",
                    "Failed getting reading assignment stats",
                    StatusCodes.Status404NotFound
                );
            }

            var classroom = await _classroomService.GetByClassroomId(ClassroomId);
            if (teacher.Id != classroom.TeacherId)
            {
                throw new ApplicationExceptionBase(
                    "Teacher is not the teacher of the classroom.",
                    "Failed getting reading assignment stats",
                    StatusCodes.Status401Unauthorized
                );
            }

            var readingAssignments = await GetAllReadingAssignmentsByClassroomId(ClassroomId, User);
            List<ReadingMaterialAssignmentDTO.Overview> readingAssignmentStats = new List<ReadingMaterialAssignmentDTO.Overview>();

            foreach (var readingAssignment in readingAssignments)
            {
                readingAssignmentStats.Add(await GetReadingAssignmentStatByAssignment(readingAssignment));
            }

            return readingAssignmentStats;
        }

        public async Task<ReadingMaterialAssignment> UpdateReadingAssignment(Guid ReadingAssignmentId, ReadingMaterialAssignmentDTO.Update Request, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "User not found.",
                    "Updating reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var teacher = await _userService.GetTeacherByUserId(user.Id);
            if (teacher == null)
            {
                throw new ApplicationExceptionBase(
                    "Teacher not found.",
                    "Updating reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var readingAssignment = await GetReadingAssignmentById(ReadingAssignmentId);
            if (readingAssignment == null)
            {
                throw new ApplicationExceptionBase(
                    "Reading assignment not found.",
                    "Updating reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var classroom = await _classroomRepository.GetById(readingAssignment.ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    "Classroom not found.",
                    "Updating reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            if (teacher.Id != classroom.TeacherId)
            {
                throw new ApplicationExceptionBase(
                    "Teacher is not the teacher of the classroom.",
                    "Updating reading assignment failed.",
                    StatusCodes.Status404NotFound
                );
            }

            if (Request.Title != null)
            {
                readingAssignment.Title = Request.Title;
            }

            if (Request.Description != null)
            {
                readingAssignment.Description = Request.Description;
            }

            if (Request.IsActive != null)
            {
                readingAssignment.IsActive = Request.IsActive.Value;
            }

            if (Request.ReadingMaterialId != null)
            {
                var readingMaterial = await _readingMaterialRepository.GetByIdAsync(Request.ReadingMaterialId.Value);
                if (readingMaterial == null)
                {
                    throw new ApplicationExceptionBase(
                        "Reading material not found.",
                        "Updating reading assignment failed.",
                        StatusCodes.Status404NotFound
                    );
                }

                readingAssignment.ReadingMaterialId = Request.ReadingMaterialId.Value;
                readingAssignment.ReadingMaterial = readingMaterial;
            }

            if (Request.MinigameType != null)
            {
                var minigames = await _minigameRepository.GetMinigamesByRMId(readingAssignment.ReadingMaterialId);
                if (minigames == null || !minigames.Any())
                {
                    throw new ApplicationExceptionBase(
                        "Minigames not found.",
                        "Updating reading assignment failed.",
                        StatusCodes.Status404NotFound
                    );
                }

                var random = new Random();
                var minigame = minigames.Where(mg => mg.MinigameType == Request.MinigameType).OrderBy(m => random.NextDouble()).First();

                readingAssignment.MinigameId = minigame.Id;
                readingAssignment.Minigame = minigame;
            }

            readingAssignment.UpdatedAt = DateTime.UtcNow;

            return await _classroomRepository.UpdateReadingAssignment(readingAssignment);
        }
    }
}