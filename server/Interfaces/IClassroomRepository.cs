using LexiLearner.Models;
namespace LexiLearner.Interfaces{
    public interface IClassroomRepository{
        Task<Classroom?> GetById(Guid Id);
        Task<Classroom?> GetByIdWithTeacherId(Guid Id);
        Task Create(Classroom classroom);
        Task Update(Classroom classroom);
        Task Delete(Classroom classroom);
    }
}