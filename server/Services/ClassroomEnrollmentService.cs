using System.Security.Claims;
using LexiLearner.Data;
using LexiLearner.Exceptions;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Repository;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Bcpg;

namespace LexiLearner.Services{
    public class ClassroomEnrollmentService : IClassroomEnrollmentService
    {
        public readonly IClassroomEnrollmentRepository _classroomEnrollmentRepository;
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;
        private readonly IClassroomService _classroomService;
        private readonly DataContext _context;

        public ClassroomEnrollmentService(IClassroomEnrollmentRepository classroomEnrollmentRepository, IUserService userService, IUserRepository userRepository, IClassroomService classroomService, DataContext dataContext) {
            _classroomEnrollmentRepository = classroomEnrollmentRepository;
            _userService = userService;
            _userRepository = userRepository;
            _classroomService = classroomService;
            _context = dataContext;
        }

        public async Task<List<Classroom>> GetByPupilId(ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if(user == null) {
                throw new ApplicationExceptionBase(
                    "No user found", "Join classroom failed", StatusCodes.Status404NotFound
                    );
            }

            Pupil? pupil = await _userService.GetPupilByUserId(user.Id);
            _context.Attach(pupil);

            if(pupil == null) {
                throw new ApplicationExceptionBase(
                    "User is not a pupil", "Join classroom failed", StatusCodes.Status403Forbidden
                );
            }

            return await _classroomEnrollmentRepository.GetByPupilId(pupil.Id);

        }

        public async Task<Classroom> JoinClassroom(string JoinCode, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if(user == null) {
                throw new ApplicationExceptionBase(
                    "No user found", "Join classroom failed", StatusCodes.Status404NotFound
                    );
            }

            Pupil? pupil = await _userService.GetPupilByUserId(user.Id);
            _context.Attach(pupil);
            if(pupil == null) {
                throw new ApplicationExceptionBase(
                    "User is not a pupil", "Join classroom failed", StatusCodes.Status403Forbidden
                );
            }

            Classroom? classroom = await _context.Classroom.FirstOrDefaultAsync(c => c.JoinCode == JoinCode);
            if (classroom == null)
            {
                throw new ApplicationExceptionBase("Invalid join code", "Join classroom failed", StatusCodes.Status404NotFound);
            }

            bool alreadyEnrolled = await _context.ClassroomEnrollment.AnyAsync(e =>
            e.ClassroomId == classroom.Id && e.PupilId == pupil.Id);

            if (alreadyEnrolled) {
                throw new ApplicationExceptionBase("Already enrolled", "Join classroom failed", StatusCodes.Status409Conflict);
            }

            var enrollment = new ClassroomEnrollment
            {
                ClassroomId = classroom.Id,
                Classroom = classroom,
                PupilId = pupil.Id,
                Pupil = pupil
            };

            await _classroomEnrollmentRepository.JoinClassroom(enrollment);

            return classroom;
        }

        public async Task LeaveClassroom(Guid ClassroomId, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            if(user == null) {
                throw new ApplicationExceptionBase(
                    "No user found",
                    "Leaving classroom failed",
                    StatusCodes.Status404NotFound
                    );
            }

            Classroom? classroom = await _classroomService.GetById(ClassroomId);
            if(classroom == null) {
                throw new ApplicationExceptionBase(
                    "No classroom found",
                    "Leaving classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            ClassroomEnrollment? pupilClassroom = await _context.ClassroomEnrollment.FirstOrDefaultAsync(
                c => c.ClassroomId == classroom.Id);

            if(pupilClassroom == null) {
                throw new ApplicationExceptionBase(
                    "Pupil not found in classroom",
                    "Leaving classroom failed",
                    StatusCodes.Status404NotFound
                );
            }

            await _classroomEnrollmentRepository.LeaveClassroom(pupilClassroom);
            
        }
    }
}