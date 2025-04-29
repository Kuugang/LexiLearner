using System.Security.Claims;
using LexiLearner.Exceptions;
using LexiLearner.Interfaces;
using LexiLearner.Models;
using LexiLearner.Models.DTO;

namespace LexiLearner.Services{
    public class ClassroomService : IClassroomService
    {
        private readonly IClassroomRepository _classroomRepository;
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;

        public ClassroomService(IClassroomRepository classroomRepository, IUserService userService, IUserRepository userRepository){
            _classroomRepository = classroomRepository;
            _userService = userService;
            _userRepository = userRepository;
        }

        public async Task<Classroom> Create(ClassroomDTO.CreateClassroom request, ClaimsPrincipal User)
        {
            User? user = await _userService.GetUserFromToken(User);
            Console.WriteLine("CHECK USER: ", user);
            Teacher? teacher;

            if(user == null) {
                throw new ApplicationExceptionBase(
                    $"User does not exist",
                    "Classroom Creation Failed",
                    StatusCodes.Status404NotFound
                );
            }

            string role = await _userService.GetRole(user);
            if(role == "Teacher") {
                teacher = await _userRepository.GetTeacherByUserId(user.Id);
            } else {
                throw new ApplicationExceptionBase(
                    $"User is not a teacher",
                    "Classroom Creation Failed",
                    StatusCodes.Status404NotFound
                );
            }

            var Classroom = new Classroom {
                Teacher = teacher,
                TeacherId = teacher.Id,
                Name = request.Name,
                Description = request.Description,
                CreatedAt = request.CreatedAt
            };

            await _classroomRepository.Create(Classroom);
            return Classroom;
            
            // throw new NotImplementedException();
        }

        public Task Delete(Classroom classroom)
        {
            throw new NotImplementedException();
        }

        public Task<Classroom> GetById(Guid Id)
        {
            throw new NotImplementedException();
        }

        public Task<Classroom> GetByIdWithTeacherId(Guid Id)
        {
            throw new NotImplementedException();
        }

        public Task Update(Classroom classroom)
        {
            throw new NotImplementedException();
        }
    }
}