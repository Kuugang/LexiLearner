using System.Security.Claims;
using LexiLearner.Data;
using LexiLearner.Exceptions;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;
using LexiLearner.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace LexiLearner.Services{
    public class ClassroomService : IClassroomService
    {
        private readonly IClassroomRepository _classroomRepository;
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;
        private readonly DataContext _context;
        private readonly IMinigameRepository _minigameRepository;
        private readonly IReadingMaterialRepository _readingMaterialRepository;

        public ClassroomService(IClassroomRepository classroomRepository, IUserService userService, IUserRepository userRepository,DataContext context, IMinigameRepository minigameRepository, IReadingMaterialRepository readingMaterialRepository) {
            _classroomRepository = classroomRepository;
            _userService = userService;
            _userRepository = userRepository;
            _readingMaterialRepository = readingMaterialRepository;
            _minigameRepository = minigameRepository;
            _context = context;
        }

        public static string GenerateClassroomCode(int length = 8) {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<string> GenerateUniqueClassroomCode() {
            string code;
            bool exists;

            do {
                code = GenerateClassroomCode();
                exists = await _classroomRepository.DoesJoinCodeExist(code);
            } while (exists);

            return code;
        }


        public async Task<ClassroomDTO> Create(ClassroomDTO.CreateClassroom Request, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if(user == null) {
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "Classroom Creation Failed",
                    StatusCodes.Status404NotFound
                );
            }

            string role = await _userService.GetRole(user);
            if(role != "Teacher") {
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
            
            do {
                code = GenerateClassroomCode();
            } while (await _context.Classroom.AnyAsync(c => c.JoinCode == code));

                
            var classroom = new Classroom {
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
        public async Task<ClassroomDTO> GetByClassroomId(Guid Id)
        {
            var classroom = await _classroomRepository.GetById(Id);

            if(classroom == null) {
                throw new ApplicationExceptionBase(
                    $"Classroom with ID {Id} not found",
                    "Getting classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            return new ClassroomDTO(classroom);
        }

        public async Task<List<ClassroomDTO>> GetClassroomsByTeacherId(ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);

            if(user == null) {
                throw new ApplicationExceptionBase(
                    $"No user found",
                    "Getting classrooms failed",
                    StatusCodes.Status404NotFound
                );
            }

            Teacher? teacher = await _userRepository.GetTeacherByUserId(user.Id);
            if (teacher == null) {
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
            Console.WriteLine("EDIT REQUEST:"+Request);
            User? user = await _userService.GetUserFromToken(User);
            if(user == null) {
                throw new ApplicationExceptionBase(
                    $"No user found",
                    "Updating classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            Classroom? classroom = await _classroomRepository.GetById(ClassroomId);
            if(classroom == null) {
                throw new ApplicationExceptionBase(
                    $"Classroom with not found",
                    "Updating classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            Teacher? teacher = await _userService.GetTeacherByUserId(user.Id);

            if(teacher == null) {
                throw new ApplicationExceptionBase(
                    $"Teacher with not found",
                    "Updating classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            if(teacher.Id != classroom.TeacherId) {
                throw new ApplicationExceptionBase(
                    $"User is not the classroom owner",
                    "Updating classroom failed",
                    StatusCodes.Status401Unauthorized
                );
            }   

            DateTime update = DateTime.UtcNow;

            if(Request.Name != null) {
                classroom.Name = Request.Name;
                classroom.UpdatedAt = update;
            } if(Request.Description != null) {
                classroom.Description = Request.Description;
                classroom.UpdatedAt = update;
            }

            await _classroomRepository.Update(classroom);
            return new ClassroomDTO(classroom);
        }

        public async Task Delete(Guid ClassroomId, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if(user == null) {
                throw new ApplicationExceptionBase(
                    $"No user found",
                    "Deleting classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            Classroom? classroom = await _classroomRepository.GetById(ClassroomId);
            if(classroom == null) {
                throw new ApplicationExceptionBase(
                    $"Classroom with not found",
                    "Deleting classroom failed",
                    StatusCodes.Status404NotFound
                );
            }   
       
            Teacher? teacher = await _userService.GetTeacherByUserId(user.Id);

            if(teacher == null) {
                throw new ApplicationExceptionBase(
                    $"Teacher with not found",
                    "Deleting classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            if(teacher.Id != classroom.TeacherId) {
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
            
            var teacher = await _userService.GetTeacherByUserId(user.Id);
            if (teacher == null)
            {
                throw new ApplicationExceptionBase(
                    "Teacher is not found.",
                    "Failed getting pupils from classroom.",
                    StatusCodes.Status404NotFound
                );
            }
            
            var classroom = await GetByClassroomId(ClassroomId);
            if (teacher.Id != classroom.TeacherId)
            {
                throw new ApplicationExceptionBase(
                    "Teacher is not the teacher of the classroom.",
                    "Failed getting pupils from classroom.",
                    StatusCodes.Status404NotFound
                );
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

        public async Task<ReadingMaterialAssignment?> GetReadingAssignmentById(Guid Id)
        {
            return await _classroomRepository.GetReadingAssignmentById(Id);
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
    }
}

