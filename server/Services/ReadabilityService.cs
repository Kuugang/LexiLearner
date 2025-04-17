using LexiLearner.Interfaces;
using System.Text.RegularExpressions;
namespace LexiLearner.Services
{
  public class ReadabilityService : IReadabilityService
  {
    public double CalculateFleschScore(string content)
    {
        int totalSentences = CountSentences(content);
        int totalWords = CountWords(content);
        int totalSyllables = CountSyllables(content);

        if (totalSentences == 0 || totalWords == 0) return 0;

        return Math.Round(
            206.835 - (1.015 * ((double)totalWords / totalSentences))
                    - (84.6 * ((double)totalSyllables / totalWords)), 2);
    }

    private int CountSentences(string text) =>
        Regex.Matches(text, @"[.!?]").Count;

    private int CountWords(string text) =>
        Regex.Matches(text, @"\b\w+\b").Count;

    private int CountSyllables(string text)
    {
        int syllables = 0;
        foreach (Match word in Regex.Matches(text.ToLower(), @"\b\w+\b"))
        {
            syllables += EstimateSyllables(word.Value);
        }
        return syllables;
    }

    private int EstimateSyllables(string word)
    {
        word = word.ToLower();
        if (word.Length <= 3) return 1;
        int count = Regex.Matches(word, @"[aeiouy]+").Count;
        if (word.EndsWith("e")) count--;
        return count < 1 ? 1 : count;
    }
  }
}