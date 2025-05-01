namespace LexiLearner.Interfaces
{
  public interface IFileUploadService
  {
    public string Upload(IFormFile file, string UploadPath);
  }
}