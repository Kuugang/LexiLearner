namespace LexiLearner.Interfaces;
public interface IUnitOfWork{
    Task ExecuteTransactionAsync(Func<Task> operation);
}
