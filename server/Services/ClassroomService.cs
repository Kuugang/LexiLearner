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

        public ClassroomService(IClassroomRepository classroomRepository, IUserService userService, IUserRepository userRepository, DataContext context, IMinigameRepository minigameRepository, IReadingMaterialRepository readingMaterialRepository)
        {
            _classroomRepository = classroomRepository;
            _userService = userService;
            _userRepository = userRepository;
            _readingMaterialRepository = readingMaterialRepository;
            _minigameRepository = minigameRepository;
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

        public async Task<List<ReadingAssignmentLog>> GetAssignmentLogsByReadingAssignmentId(Guid ReadingAssignmentId, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if (user == null)
            {
                throw new ApplicationExceptionBase("User not found.", "Failed getting assignment logs.", StatusCodes.Status404NotFound);
            }

            var userRole = await _userService.GetRole(user);
            var readingAssignment = await GetReadingAssignmentById(ReadingAssignmentId);
            var classroom = await GetByClassroomId(readingAssignment.ClassroomId);
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
            var classroom = await GetByClassroomId(readingAssignment.ClassroomId);
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

            var classroom = await GetByClassroomId(ClassroomId);
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

    }
}

