using LexiLearner.Models;
namespace LexiLearner.Interfaces{
    public interface IClassroomRepository{
        Task<Classroom> GetById(Guid Id);
        Task<List<Classroom>> GetByTeacherId(Guid Id);
        Task<bool> DoesJoinCodeExist(string code);
        Task Create(Classroom classroom);
        Task Update(Classroom classroom);
        Task Delete(Classroom classroom);
    }
}