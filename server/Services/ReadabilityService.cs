using LexiLearner.Interfaces;
using System.Text.RegularExpressions;
namespace LexiLearner.Services
{
  public class ReadabilityService : IReadabilityService
  {
    // Common abbreviations to avoid false sentence endings
        private static readonly HashSet<string> _commonAbbreviations = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "mr.", "mrs.", "ms.", "dr.", "prof.", "st.", "jr.", "sr.", "co.", "ltd.",
            "inc.", "e.g.", "i.e.", "etc.", "vs.", "ph.d.", "m.d.", "b.a.", "m.a."
        };

        // Common digraphs and diphthongs that count as one phonetic unit
        private static readonly HashSet<string> _digraphsAndDiphthongs = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "ai", "au", "ay", "ea", "ee", "ei", "eu", "ey", "ie", "oi", "oo", "ou", "oy", "ua", "ue", "ui"
        };

        // Special cases for words with non-standard syllable counts
        private static readonly Dictionary<string, int> _specialCases = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
        {
            { "business", 2 }, { "every", 2 }, { "different", 3 }, { "interesting", 3 },
            { "evening", 2 }, { "literature", 4 }, { "beautiful", 3 }, { "science", 2 },
            { "area", 3 }, { "being", 2 }, { "usually", 3 }, { "create", 2 },
            { "average", 3 }, { "experience", 4 }, { "especially", 4 }
        };

        // Common one-syllable words
        private static readonly HashSet<string> _commonSingleSyllableWords = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "and", "the", "it", "is", "was", "to", "for", "that", "on", "at", "with", "from",
            "by", "as", "but", "or", "nor", "yet", "so", "if", "in", "out", "up", "down"
        };

        /// <summary>
        /// Calculates the Flesch Reading Ease score
        /// </summary>
        /// <param name="content">The text to analyze</param>
        /// <returns>A score between 0 (very difficult) and 100 (very easy)</returns>
        public double CalculateFleschScore(string content)
        {
            content = content.ToLower();
            if (string.IsNullOrWhiteSpace(content))
                return 0;

            int totalSentences = CountSentences(content);
            int totalWords = CountWords(content);
            int totalSyllables = CountSyllables(content);

            if (totalSentences == 0 || totalWords == 0)
                return 0;

            double averageSentenceLength = (double)totalWords / totalSentences;
            double averageSyllablesPerWord = (double)totalSyllables / totalWords;

            // Flesch Reading Ease formula
            double score = 206.835 - (1.015 * averageSentenceLength) - (84.6 * averageSyllablesPerWord);
            
            // Ensure score is within bounds
            return Math.Round(Math.Max(0, Math.Min(100, score)), 1);
        }
        
        /// <summary>
        /// Counts the number of sentences in the text with improved accuracy
        /// </summary>
        private int CountSentences(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return 0;

            // Preprocess text to handle abbreviations
            foreach (var abbr in _commonAbbreviations)
            {
                // Replace periods in abbreviations with a temporary marker
                text = Regex.Replace(text, $@"\b{Regex.Escape(abbr)}\s", m => m.Value.Replace(".", "~"));
            }

            // Count sentence endings (period, exclamation, question mark followed by space or end of string)
            var sentenceEndings = Regex.Matches(text, @"[.!?]+(?=\s|$)|\n+");
            int count = sentenceEndings.Count;

            // Restore original abbreviations
            text = text.Replace("~", ".");

            // If there are words but no sentence endings, count it as at least one sentence
            if (count == 0 && Regex.IsMatch(text, @"\w"))
                return 1;

            return count;
        }

        /// <summary>
        /// Extracts and counts words from the text
        /// </summary>
        private List<string> ExtractWords(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return new List<string>();

            // Extract words, handling contractions and possessives properly
            var words = new List<string>();
            foreach (Match match in Regex.Matches(text.ToLower(), @"\b[\w']+\b"))
            {
                string word = match.Value.Trim('\'');
                if (!string.IsNullOrEmpty(word) && Regex.IsMatch(word, @"\w"))
                {
                    words.Add(word);
                }
            }
            
            return words;
        }

        /// <summary>
        /// Counts the number of words in the text
        /// </summary>
        private int CountWords(string text)
        {
            return ExtractWords(text).Count;
        }

        /// <summary>
        /// Counts the total syllables in the text
        /// </summary>
        private int CountSyllables(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return 0;

            int syllables = 0;
            var words = ExtractWords(text);
            
            foreach (var word in words)
            {
                syllables += EstimateSyllables(word);
            }
            
            return syllables;
        }

        /// <summary>
        /// Estimates the number of syllables in a word with improved accuracy
        /// </summary>
        private int EstimateSyllables(string word)
        {
            if (string.IsNullOrEmpty(word))
                return 0;
                
            word = word.ToLower().Trim();
            
            // Handle special cases
            if (_specialCases.TryGetValue(word, out int knownSyllables))
                return knownSyllables;
                
            // Common single-syllable words
            if (_commonSingleSyllableWords.Contains(word))
                return 1;
                
            // Very short words are typically one syllable
            if (word.Length <= 3)
                return 1;
            
            // Handle common suffixes
            int suffixAdjustment = 0;
            
            // Handle -es, -ed endings that often don't add syllables
            if ((word.EndsWith("es") && word.Length > 3 && !word.EndsWith("ses") && !word.EndsWith("zes")) || 
                (word.EndsWith("ed") && word.Length > 3 && !IsVowel(word[word.Length - 3])))
            {
                word = word.Substring(0, word.Length - 2);
                // No adjustment needed as we're removing a non-syllable
            }
            
            // Handle -e ending (silent e)
            if (word.EndsWith("e") && word.Length > 2 && !IsVowel(word[word.Length - 2]))
            {
                word = word.Substring(0, word.Length - 1);
                // No adjustment needed as we're removing a non-syllable
            }
            
            // Handle -le ending (usually counts as a syllable)
            if (word.EndsWith("le") && word.Length > 3 && IsConsonant(word[word.Length - 3]))
            {
                suffixAdjustment = 1;
            }
            
            // Count vowel groups
            int count = 0;
            bool lastWasVowel = false;
            
            for (int i = 0; i < word.Length; i++)
            {
                bool isCurrentVowel = IsVowel(word[i]);
                
                // Check for digraphs and diphthongs (count as one vowel sound)
                if (isCurrentVowel && i < word.Length - 1 && IsVowel(word[i + 1]))
                {
                    string potentialDiphthong = word.Substring(i, 2);
                    if (_digraphsAndDiphthongs.Contains(potentialDiphthong))
                    {
                        // Skip the next vowel since we're counting this as one unit
                        i++;
                    }
                }
                
                if (isCurrentVowel && !lastWasVowel)
                {
                    count++;
                }
                
                lastWasVowel = isCurrentVowel;
            }
            
            // Apply suffix adjustment
            count += suffixAdjustment;
            
            // Always return at least 1 syllable
            return Math.Max(1, count);
        }

        /// <summary>
        /// Checks if a character is a vowel
        /// </summary>
        private bool IsVowel(char c) => "aeiouy".Contains(char.ToLower(c));

        /// <summary>
        /// Checks if a character is a consonant
        /// </summary>
        private bool IsConsonant(char c) => char.IsLetter(c) && !IsVowel(c);
  }
}