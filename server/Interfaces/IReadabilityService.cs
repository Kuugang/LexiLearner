namespace LexiLearner.Interfaces
{
  public interface IReadabilityService
  {
    double CalculateFleschScore(string content);
  }
}