export interface MinigameLog {
  id?: string;
  minigameId: string;
  pupilId: string;
  readingSessionId: string;
  result: string;
  createdAt?: string;
}

// result: JSON for MinigameLog
// wordsFromLetters
// {
//   "duration": "int (seconds)",
//   "correctAnswers": ["ans1", "ans2", "ans3"],
//   "incorrectAnswers": ["ans2", "ans2"],
//   "score": "int",
//   "streak": "int"
// }
//
// // fillInTheBlanks
// {
//   "duration": "int(seconds)",
//   "answers": [ // last item will be the correct answer
// 	["ans1"]
// 	["ans1", "ans2", "ans3", ...]
// ],
//   "score": "int",
//   "streak": 1
// }
//
// // sentenceRearrangement
// {
//   "duration": "int(seconds)",
//   "answers": [ // last item will be the correct answer
// [2, 3, 4, 1],
//                 [3, 2, 1, 4],
//                 [3, 1, 2, 4],
// ]
//   "score": "int",
// }
//
// // wordHunt
// {
//   "duration": "int(seconds),
//   "correctAttemps": ["lamp", "sand", "word"],
//   "incorrectAttempts": ["sard", "pam"],
//   "score": "int"
//   "streak", "int",
// }
//
// 2Truths1Lie
// {
//   "duration": "int (seconds),
//   "score": "int",
// }
