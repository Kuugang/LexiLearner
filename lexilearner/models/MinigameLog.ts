export interface MinigameLog {
  id?: string;
  minigameId: string;
  pupilId: string;
  readingSessionId: string;
  result: string;
  createdAt: string;
}

// result: JSON for MinigameLog
// // wordsFromLetters
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
//   "wordsFound": ["lamp", "sand", "word"],
//   "incorrectAttempts": ["sard", "pam"], // up to 3
//   "score": "int",
//   "streak", "int",
// }
//
// // 2Truths1Lie - if ur answer is incorrect, proceed to next round
// {
//   "duration": "int (seconds),
//   "roundResults": [ "ansStmt1", "ansStmt2", "ansStmt2" ],
//   "score": "int",
//   "streak": "int"
// }
