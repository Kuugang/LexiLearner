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

        public ClassroomService(IClassroomRepository classroomRepository, IUserService userService, IUserRepository userRepository,DataContext context){
            _classroomRepository = classroomRepository;
            _userService = userService;
            _userRepository = userRepository;
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


        public async Task<ClassroomDTO> Create(ClassroomDTO.CreateClassroom request, ClaimsPrincipal User)
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

            Teacher teacher = await _userRepository.GetTeacherByUserId(user.Id);
            _context.Attach(teacher);

            string code;
            
            do {
                code = GenerateClassroomCode();
            } while (await _context.Classroom.AnyAsync(c => c.JoinCode == code));

                
            var classroom = new Classroom {
                JoinCode = code,
                Teacher = teacher,
                TeacherId = teacher.Id,
                Name = request.Name,
                Description = request.Description,
            };

            await _classroomRepository.Create(classroom);
            return new ClassroomDTO(classroom);
        }
        public async Task<ClassroomDTO> GetById(Guid Id)
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

        public async Task<List<ClassroomDTO>> GetByTeacherId(ClaimsPrincipal User)
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

        public async Task<ClassroomDTO> Update(Guid ClassroomId, ClassroomDTO.UpdateClassroom request, ClaimsPrincipal User)
        {
            Console.WriteLine("EDIT REQUEST:"+request);
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

            if(request.Name != null) {
                classroom.Name = request.Name;
                classroom.UpdatedAt = update;
            } if(request.Description != null) {
                classroom.Description = request.Description;
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
	}
}

