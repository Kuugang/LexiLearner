using System.Security.Claims;
using System.Text.Json;
using LexiLearner.Data;
using LexiLearner.Exceptions;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using LexiLearner.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1;

namespace LexiLearner.Services
{
    public class ClassroomService : IClassroomService
    {
        private readonly IClassroomRepository _classroomRepository;
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;
        private readonly DataContext _context;
        private readonly IMinigameRepository _minigameRepository;
        private readonly IReadingMaterialRepository _readingMaterialRepository;
        private readonly IReadingAssignmentService _readingAssignmentService;

        public ClassroomService(IClassroomRepository classroomRepository, IUserService userService, IUserRepository userRepository, DataContext context, IMinigameRepository minigameRepository, IReadingMaterialRepository readingMaterialRepository, IReadingAssignmentService readingAssignmentService)
        {
            _classroomRepository = classroomRepository;
            _userService = userService;
            _userRepository = userRepository;
            _readingMaterialRepository = readingMaterialRepository;
            _minigameRepository = minigameRepository;
            _readingAssignmentService = readingAssignmentService;
            _context = context;
        }

        public static string GenerateClassroomCode(int length = 8)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<string> GenerateUniqueClassroomCode()
        {
            string code;
            bool exists;

            do
            {
                code = GenerateClassroomCode();
                exists = await _classroomRepository.DoesJoinCodeExist(code);
            } while (exists);

            return code;
        }


        public async Task<ClassroomDTO> Create(ClassroomDTO.CreateClassroom Request, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "Classroom Creation Failed",
                    StatusCodes.Status404NotFound
                );
            }

            string role = await _userService.GetRole(user);
            if (role != "Teacher")
            {
                throw new ApplicationExceptionBase(
                    $"User is not a teacher",
                    "Classroom Creation Failed",
                    StatusCodes.Status404NotFound
                );
            }

            Teacher? teacher = await _userRepository.GetTeacherByUserId(user.Id);
            if (teacher == null)
            {
                throw new ApplicationExceptionBase(
                    $"No teacher record found for user with ID {user.Id}",
                    "Classroom Creation Failed",
                    StatusCodes.Status404NotFound
                );
            }
            _context.Attach(teacher);

            string code;

            do
            {
                code = GenerateClassroomCode();
            } while (await _context.Classroom.AnyAsync(c => c.JoinCode == code));


            var classroom = new Classroom
            {
                JoinCode = code,
                Teacher = teacher,
                TeacherId = teacher.Id,
                Name = Request.Name,
                Description = Request.Description,
                ClassroomEnrollments = new List<ClassroomEnrollment>(),
                ReadingMaterialAssignments = new List<ReadingMaterialAssignment>()
            };

            await _classroomRepository.Create(classroom);
            return new ClassroomDTO(classroom);
        }
        public async Task<Classroom> GetByClassroomId(Guid Id)
        {
            var classroom = await _classroomRepository.GetById(Id);

            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    $"Classroom with ID {Id} not found",
                    "Getting classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            return classroom;
        }

        public async Task<List<ClassroomDTO>> GetClassroomsByTeacherId(ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);

            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    $"No user found",
                    "Getting classrooms failed",
                    StatusCodes.Status404NotFound
                );
            }

            Teacher? teacher = await _userRepository.GetTeacherByUserId(user.Id);
            if (teacher == null)
            {
                throw new ApplicationExceptionBase(
                    $"No teacher record found for user with ID {user.Id}",
                    "Getting classrooms failed",
                    StatusCodes.Status404NotFound
                );
            }

            // gihandle nmn nis authorize shit dba hahsah - ala
            if (user.Id != teacher.UserId)
            {
                throw new ApplicationExceptionBase(
                    $"User is not the owner of classroom",
                    "Getting classrooms failed",
                    StatusCodes.Status404NotFound
                );
            }

            Guid teacherId = teacher.Id;

            var classroooms = await _classroomRepository.GetByTeacherId(teacherId);

            return classroooms.Select(c => new ClassroomDTO(c)).ToList();
        }

        public async Task<ClassroomDTO> Update(Guid ClassroomId, ClassroomDTO.UpdateClassroom Request, ClaimsPrincipal User)
        {
            Console.WriteLine("EDIT REQUEST:" + Request);
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    $"No user found",
                    "Updating classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            Classroom? classroom = await _classroomRepository.GetById(ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    $"Classroom with not found",
                    "Updating classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            Teacher? teacher = await _userService.GetTeacherByUserId(user.Id);

            if (teacher == null)
            {
                throw new ApplicationExceptionBase(
                    $"Teacher with not found",
                    "Updating classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            if (teacher.Id != classroom.TeacherId)
            {
                throw new ApplicationExceptionBase(
                    $"User is not the classroom owner",
                    "Updating classroom failed",
                    StatusCodes.Status401Unauthorized
                );
            }

            DateTime update = DateTime.UtcNow;

            if (Request.Name != null)
            {
                classroom.Name = Request.Name;
                classroom.UpdatedAt = update;
            }
            if (Request.Description != null)
            {
                classroom.Description = Request.Description;
                classroom.UpdatedAt = update;
            }

            await _classroomRepository.Update(classroom);
            return new ClassroomDTO(classroom);
        }

        public async Task Delete(Guid ClassroomId, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    $"No user found",
                    "Deleting classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            Classroom? classroom = await _classroomRepository.GetById(ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    $"Classroom with not found",
                    "Deleting classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            Teacher? teacher = await _userService.GetTeacherByUserId(user.Id);

            if (teacher == null)
            {
                throw new ApplicationExceptionBase(
                    $"Teacher with not found",
                    "Deleting classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            if (teacher.Id != classroom.TeacherId)
            {
                throw new ApplicationExceptionBase(
                    $"User is not the classroom owner",
                    "Deleting classroom failed",
                    StatusCodes.Status401Unauthorized
                );
            }

            await _classroomRepository.Delete(classroom);
        }

        public async Task<List<ClassroomDTO>> GetClassroomsByPupilId(ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "No user found", "Join classroom failed", StatusCodes.Status404NotFound
                    );
            }

            Pupil? pupil = await _userService.GetPupilByUserId(user.Id);
            _context.Attach(pupil);

            if (pupil == null)
            {
                throw new ApplicationExceptionBase(
                    "User is not a pupil", "Join classroom failed", StatusCodes.Status403Forbidden
                );
            }

            var classrooms = await _classroomRepository.GetClassroomsByPupilId(pupil.Id);

            return classrooms.Select(c => new ClassroomDTO(c)).ToList();
        }

        public async Task<ClassroomDTO> JoinClassroom(string JoinCode, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "No user found", "Join classroom failed", StatusCodes.Status404NotFound
                    );
            }

            Pupil? pupil = await _userService.GetPupilByUserId(user.Id);
            if (pupil == null)
            {
                throw new ApplicationExceptionBase(
                    "User is not a pupil", "Join classroom failed", StatusCodes.Status403Forbidden
                );
            }
            _context.Attach(pupil);

            Classroom? classroom = await _context.Classroom.FirstOrDefaultAsync(c => c.JoinCode == JoinCode);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase("Invalid join code", "Join classroom failed", StatusCodes.Status404NotFound);
            }

            bool alreadyEnrolled = await _context.ClassroomEnrollment.AnyAsync(e =>
            e.ClassroomId == classroom.Id && e.PupilId == pupil.Id);

            if (alreadyEnrolled)
            {
                throw new ApplicationExceptionBase("Already enrolled", "Join classroom failed", StatusCodes.Status409Conflict);
            }

            var enrollment = new ClassroomEnrollment
            {
                ClassroomId = classroom.Id,
                Classroom = classroom,
                PupilId = pupil.Id,
                Pupil = pupil
            };

            await _classroomRepository.JoinClassroom(enrollment);

            return new ClassroomDTO(classroom);
        }

        public async Task LeaveClassroom(Guid ClassroomId, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "No user found",
                    "Leaving classroom failed",
                    StatusCodes.Status404NotFound
                    );
            }

            Classroom? classroom = await _classroomRepository.GetById(ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    "No classroom found",
                    "Leaving classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            ClassroomEnrollment? pupilClassroom = await _context.ClassroomEnrollment.FirstOrDefaultAsync(
                c => c.ClassroomId == classroom.Id);

            if (pupilClassroom == null)
            {
                throw new ApplicationExceptionBase(
                    "Pupil not found in classroom",
                    "Leaving classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            await _classroomRepository.LeaveClassroom(pupilClassroom);

        }

        public async Task<List<Pupil>> GetPupilsByClassroomId(Guid ClassroomId, ClaimsPrincipal User)
        {
            var user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "User not found.",
                    "Failed getting pupils from classroom.",
                    StatusCodes.Status404NotFound
                );
            }

            var classroom = await GetByClassroomId(ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    "Classroom not found.",
                    "Failed getting pupils from classroom.",
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
                        "Failed getting pupils from classroom.",
                        StatusCodes.Status404NotFound
                    );
                }

                if (teacher.Id != classroom.TeacherId)
                {
                    throw new ApplicationExceptionBase(
                        "Teacher is not the teacher of the classroom.",
                        "Failed getting pupils from classroom.",
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
                        "Failed getting pupils from classroom.",
                        StatusCodes.Status404NotFound
                    );
                }

                var classroomEnrollment = await _classroomRepository.GetClassroomEnrollmentByPupilandClassId(pupil.Id, ClassroomId);
                if (classroomEnrollment == null)
                {
                    throw new ApplicationExceptionBase(
                        "Pupil is not enrolled in the classroom.",
                        "Failed getting pupils from classroom.",
                        StatusCodes.Status401Unauthorized
                    );
                }
            }

            return await _classroomRepository.GetPupilsByClassroomId(ClassroomId);
        }

        public async Task<ClassroomEnrollmentDTO> AddPupil(Guid PupilId, Guid ClassroomId, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "User not found.",
                    "Adding pupil to classroom failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var teacher = await _userService.GetTeacherByUserId(user.Id);
            if (teacher == null)
            {
                throw new ApplicationExceptionBase(
                    "Teacher not found.",
                    "Adding pupil to classroom failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var classroom = await _classroomRepository.GetById(ClassroomId);

            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    "Classroom not found.",
                    "Adding pupil to classroom failed.",
                    StatusCodes.Status404NotFound
                );
            }

            if (classroom.TeacherId != teacher.Id)
            {
                throw new ApplicationExceptionBase(
                    "Teacher is not the owner of the classrooom.",
                    "Adding pupil to classroom failed.",
                    StatusCodes.Status401Unauthorized
                );
            }

            var pupil = await _userService.GetPupilByPupilId(PupilId);

            if (pupil == null)
            {
                throw new ApplicationExceptionBase(
                    "Pupil not found.",
                    "Adding pupil to classroom failed.",
                    StatusCodes.Status404NotFound
                );
            }


            var classroomEnrollment = new ClassroomEnrollment
            {
                Pupil = pupil,
                PupilId = PupilId,
                ClassroomId = ClassroomId,
                Classroom = classroom
            };

            await _classroomRepository.AddPupil(classroomEnrollment);
            return new ClassroomEnrollmentDTO(classroomEnrollment);
        }

        public async Task RemovePupil(Guid PupilId, Guid ClassroomId, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "User not found.",
                    "Removing pupil from classroom failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var teacher = await _userService.GetTeacherByUserId(user.Id);
            if (teacher == null)
            {
                throw new ApplicationExceptionBase(
                    "Teacher not found.",
                    "Removing pupil from classroom failed.",
                    StatusCodes.Status404NotFound
                );
            }

            var classroom = await _classroomRepository.GetById(ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    "Classroom not found.",
                    "Removing pupil from classroom failed.",
                    StatusCodes.Status404NotFound
                );
            }

            if (classroom.TeacherId != teacher.Id)
            {
                throw new ApplicationExceptionBase(
                    "Teacher is not the owner of the classroom.",
                    "Removing pupil from classroom failed.",
                    StatusCodes.Status401Unauthorized
                );
            }

            var classroomEnrollment = await _classroomRepository.GetClassroomEnrollmentByPupilandClassId(PupilId, ClassroomId);
            if (classroomEnrollment == null)
            {
                throw new ApplicationExceptionBase(
                    "Pupil is not enrolled in this classroom.",
                    "Removing pupil from classroom failed.",
                    StatusCodes.Status404NotFound
                );
            }

            await _classroomRepository.RemovePupil(classroomEnrollment);
        }

        public async Task<ClassroomEnrollment> GetClassroomEnrollmentByPupilAndClassId(Guid PupilId, Guid ClassroomId)
        {
            var classroomEnrollment = await _classroomRepository.GetClassroomEnrollmentByPupilandClassId(PupilId, ClassroomId);

            if (classroomEnrollment == null)
            {
                throw new ApplicationExceptionBase(
                    "ClassroomEnrollment not found.",
                    "Failed fetching the classroomEnrollment",
                    StatusCodes.Status404NotFound
                );
            }

            return classroomEnrollment;
        }

        public async Task<List<ClassroomEnrollmentDTO.Leaderboard>> GetLeaderboard(Guid ClassroomId, ClaimsPrincipal User)
        {
            var user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase(
                    "User not found.",
                    "Failed getting leaderboard",
                    StatusCodes.Status404NotFound
                );
            }

            var classroom = await _classroomRepository.GetById(ClassroomId);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase(
                    "Classroom not found.",
                    "Failed getting leaderboard",
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
                        "Failed getting leaderboard",
                        StatusCodes.Status404NotFound
                    );
                }

                if (teacher.Id != classroom.TeacherId)
                {
                    throw new ApplicationExceptionBase(
                        "Teacher is not the teacher of the classroom.",
                        "Failed getting leaderboard",
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
                        "Failed getting leaderboard",
                        StatusCodes.Status404NotFound
                    );
                }

                var classroomEnrollment = await _classroomRepository.GetClassroomEnrollmentByPupilandClassId(pupil.Id, ClassroomId);
                if (classroomEnrollment == null)
                {
                    throw new ApplicationExceptionBase(
                        "Pupil is not enrolled in the classroom.",
                        "Failed getting leaderboard",
                        StatusCodes.Status401Unauthorized
                    );
                }
            }

            var leaderboard = await _classroomRepository.GetLeaderboard(ClassroomId);
            if (leaderboard == null || !leaderboard.Any())
            {
                throw new ApplicationExceptionBase(
                    "Leaderboard not found.",
                    "Failed getting leaderboard",
                    StatusCodes.Status404NotFound
                );
            }

            return leaderboard.Select(ce => new ClassroomEnrollmentDTO.Leaderboard(ce)).ToList();
        }

    }
}

