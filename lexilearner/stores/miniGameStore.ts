import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Minigame, MinigameType } from "@/models/Minigame";
import { MinigameLog } from "@/models/MinigameLog";
import { useReadingSessionStore } from "./readingSessionStore";
import { useUserStore } from "./userStore";

interface MiniGameStore {
  currentMinigame: Minigame | null;
  setCurrentMinigame: (minigame: Minigame) => void;

  minigames: Minigame[] | [];
  gameStartTime: Date | null;

  setMinigames: (minigames: Minigame[]) => void;

  minigamesIndex: number;
  setMinigamesIndex: (index: number) => void;
  gameOver: (result: Record<string, any>) => MinigameLog | null;

  incrementMinigamesIndex: () => void;
}

export const useMiniGameStore = create<MiniGameStore>()(
  persist(
    (set, get) => ({
      currentMinigame: null,
      minigames: [],
      minigamesIndex: 0,
      gameStartTime: null,

      setCurrentMinigame: (minigame: Minigame) => {
        set({ currentMinigame: minigame });
        set({ gameStartTime: new Date() });
      },

      setMinigames: (minigames: Minigame[]) => set({ minigames: minigames }),
      setMinigamesIndex: (index: number) => set({ minigamesIndex: index }),

      gameOver: (result: Record<string, any>): MinigameLog | null => {
        const currentMinigame = get().currentMinigame;
        if (!currentMinigame) return null;

        let logResult: Record<string, any> = {};

        const startTime = get().gameStartTime;
        if (!startTime) {
          console.warn("start time is null");
          return null;
        }
        const duration: number = Math.floor(
          (Date.now() - startTime.getTime()) / 1000,
        );
        logResult["duration"] = duration;

        switch (currentMinigame.minigameType) {
          case MinigameType.WordsFromLetters:
            logResult["correctAnswers"] = result.correctAnswers;
            logResult["incorrectAnswers"] = result.correctAnswers;
            logResult["score"] = logResult["correctAnswers"].length;
            logResult["streak"] = result.streak;
            break;
          case MinigameType.FillInTheBlanks:
            logResult["answers"] = result.answers;
            logResult["score"] = result.score;
            break;
          case MinigameType.SentenceRearrangement:
            logResult["answers"] = result.answers;
            logResult["score"] = result.score;
            break;
          case MinigameType.WordHunt:
            logResult["score"] = result.answers;
            logResult["streak"] = result.streak;
            logResult["correctAttempts"] = result.correctAttempts;
            logResult["incorrectAttempts"] = result.incorrectAttempts;
            break;
          case MinigameType.TwoTruthsOneLie:
            logResult["score"] = result.score;
            break;
        }

        const currentReadingSession =
          useReadingSessionStore.getState().currentSession;

        if (!currentReadingSession) {
          console.warn("currentReadingSession is null");
          return null;
        }

        const user = useUserStore.getState().user;

        if (!user?.pupil?.id) {
          console.warn("pupil is null");
          return null;
        }

        let minigameLog: MinigameLog = {
          minigameId: currentMinigame.id,
          pupilId: user.pupil.id,
          readingSessionId: currentReadingSession.id,
          result: JSON.stringify(logResult),
        };
        set({ gameStartTime: null });
        return minigameLog;
      },

      incrementMinigamesIndex: () =>
        set((state) => ({
          minigamesIndex: state.minigamesIndex + 1,
        })),
    }),
    {
      name: "game-store",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);

type Choice = { choice: string; answer: boolean };
interface TwoTruthsOneLieGameState {
  choices: Choice[];
  score: number;

  setScore: (score: number) => void;
  setChoices: (choices: Choice[]) => void;
  newGame: () => void;
}

export const useTwoTruthsOneLieGameStore = create<TwoTruthsOneLieGameState>()(
  persist(
    (set) => ({
      choices: [],
      score: 0,

      setScore: (score: number) => set({ score: score }),
      setChoices: (choices: Choice[]) => set({ choices: choices }),
      newGame: () => set(() => ({ score: 0 })),
    }),
    {
      name: "2-truths-1-lie-store",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          // Parse string to object if exists
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          // Convert object to string
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);

interface WordHuntGameState {
  correctAnswers: string[];
  wrongAnswers: string[];
  allWords: string[];
  lives: number;
  streak: number;
  shuffledWords: string[];
  correctAttempts: string[];
  incorrectAttempts: string[];

  setShuffled: (allWords: string[]) => void;
  addCorrectAttempt: (word: string) => void;
  addIncorrectAttempt: (word: string) => void;
  setCorrectAnswers: (correctAnswers: string[]) => void;
  setWrongAnswers: (wrongAnswers: string[]) => void;
  setAllWords: (allWords: string[]) => void;

  incrementStreak: () => void;
  resetStreak: () => void;
  newGame: () => void;
  decrementLives: () => void;
}

export const useWordHuntGameStore = create<WordHuntGameState>()(
  persist(
    (set) => ({
      correctAnswers: [],
      wrongAnswers: [],
      allWords: [],
      lives: 3,
      streak: 0,
      shuffledWords: [],
      correctAttempts: [],
      incorrectAttempts: [],

      setShuffled: (allWords: string[]) => {
        const shuffled = allWords
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
        set({ shuffledWords: shuffled });
      },

      addCorrectAttempt: (word: string) =>
        set((state) => ({
          correctAttempts: [...state.correctAttempts, word],
        })),
      addIncorrectAttempt: (word: string) =>
        set((state) => ({
          incorrectAttempts: [...state.incorrectAttempts, word],
        })),
      setCorrectAnswers: (correctAnswers: string[]) =>
        set({ correctAnswers: correctAnswers }),
      setWrongAnswers: (wrongAnswers: string[]) =>
        set({ wrongAnswers: wrongAnswers }),
      setAllWords: (allWords: string[]) => set({ allWords: allWords }),

      decrementLives: () =>
        set((state) => ({
          lives: state.lives - 1,
        })),

      resetStreak: () => set({ streak: 0 }),
      newGame: () =>
        set(() => ({
          lives: 3,
          streak: 0,
          correctAttempts: [],
          incorrectAttempts: [],
          allWords: [],
          wrongAnswers: [],
        })),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
    }),
    {
      name: "words-hunt-store",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          // Parse string to object if exists
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          // Convert object to string
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);

interface WordsFromLettersGameState {
  letters: string[];
  words: string[];
  guess: string[];
  usedIndices: number[];
  correctAnswers: string[];
  incorrectAnswers: string[];
  streak: number;
  lives: number;

  shuffleLetters: () => void;

  setLetters: (letters: string[]) => void;
  setWords: (words: string[]) => void;
  setGuess: (guess: string[]) => void;

  addUsedIndex: (guessIndex: number, letterIndex: number) => void;
  removeUsedIndex: (index: number) => void;
  resetUsedIndices: () => void;
  clearUsedIndices: () => void;

  addCorrectAnswer: (answer: string) => void;
  addIncorrectAnswer: (answer: string) => void;

  incrementStreak: () => void;
  resetStreak: () => void;
  resetGame: () => void;

  decrementLives: () => void;
}

export const useWordsFromLettersMiniGameStore =
  create<WordsFromLettersGameState>()(
    persist(
      (set, get) => ({
        letters: Array(5).fill(""),
        words: [],
        guess: Array(5).fill(""),
        usedIndices: Array(5).fill(-1),
        correctAnswers: [],
        incorrectAnswers: [],
        streak: 0,
        lives: 3,

        shuffleLetters: () =>
          set((state) => {
            const letterStatus = state.letters.map((letter, index) => ({
              letter,
              originalIndex: index,
              isUsed: state.usedIndices[index] !== -1,
            }));

            const shuffled = [...letterStatus];
            for (let i = shuffled.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            const newLetters = shuffled.map((item) => item.letter);

            const newUsedIndices = Array(5).fill(-1);
            state.usedIndices.forEach((letterIndex, guessIndex) => {
              if (letterIndex !== -1) {
                const newPosition = shuffled.findIndex(
                  (item) => item.originalIndex === letterIndex,
                );
                if (newPosition !== -1) {
                  newUsedIndices[guessIndex] = newPosition;
                }
              }
            });

            return {
              letters: newLetters,
              usedIndices: newUsedIndices,
            };
          }),

        setLetters: (letters: string[]) => set({ letters }),
        setWords: (words: string[]) => set({ words }),
        setGuess: (guess: string[]) => set({ guess }),

        addUsedIndex: (guessIndex: number, letterIndex: number) =>
          set((state: any) => {
            const newUsedIndices = [...state.usedIndices];
            newUsedIndices[guessIndex] = letterIndex;

            return {
              usedIndices: newUsedIndices,
            };
          }),

        resetUsedIndices: () =>
          set(() => {
            const newUsedIndices = Array(5).fill(-1);
            return { usedIndices: newUsedIndices };
          }),
        removeUsedIndex: (index: number) => {
          set((state: any) => {
            const newUsedIndices = [...state.usedIndices];
            newUsedIndices[index] = -1;
            return { usedIndices: newUsedIndices };
          });
        },
        clearUsedIndices: () => set({ usedIndices: [] }),

        addCorrectAnswer: (answer: string) =>
          set((state: any) => ({
            correctAnswers: [...state.correctAnswers, answer],
          })),

        addIncorrectAnswer: (answer: string) =>
          set((state: any) => {
            const updated = [...state.incorrectAnswers, answer];
            return { incorrectAnswers: updated };
          }),
        incrementStreak: () =>
          set((state: any) => ({ streak: state.streak + 1 })),

        resetStreak: () => set({ streak: 0 }),

        resetGame: () =>
          set(() => {
            return {
              letters: Array(5).fill(""),
              words: [],
              guess: Array(5).fill(""),
              usedIndices: Array(5).fill(-1),
              correctAnswers: [],
              incorrectAnswers: [],
              streak: 0,
              lives: 3,
            };
          }),

        decrementLives: () =>
          set((state) => ({ lives: Math.max(state.lives - 1, 0) })),
      }),
      {
        name: "words-from-letters-store",
        storage: {
          getItem: async (name) => {
            const value = await AsyncStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          },
          setItem: async (name, value) => {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: async (name) => {
            await AsyncStorage.removeItem(name);
          },
        },
      },
    ),
  );

interface SentenceRearrangementGameState {
  correctAnswer: string[];
  parts: string[];
  currentAnswer: string[];

  answers: string[][];

  lives: number;

  setCorrectAnswer: (answer: string[]) => void;
  setParts: (parts: string[]) => void;
  addAnswer: (answer: string[]) => void;
  resetCurrentAnswer: () => void;
  addPartToCurrentAnswer: (part: string) => void;
  removePartFromCurrentAnswer: (index: number) => void;
  decrementLives: () => void;
  resetGameState: () => void;
}

export const useSentenceRearrangementMiniGameStore =
  create<SentenceRearrangementGameState>()(
    persist(
      (set) => ({
        correctAnswer: [],
        parts: [],
        answers: [],
        currentAnswer: [],
        lives: 3,

        setCorrectAnswer: (answer: string[]) => set({ correctAnswer: answer }),
        setParts: (parts: string[]) => set({ parts: parts }),
        resetCurrentAnswer: () => set({ currentAnswer: [] }),

        addAnswer: (answer: string[]) =>
          set((state) => ({
            answers: [...state.answers, [...answer]],
          })),

        addPartToCurrentAnswer: (part: string) =>
          set((state) => ({ currentAnswer: [...state.currentAnswer, part] })),

        removePartFromCurrentAnswer: (index: number) =>
          set((state) => {
            const updated = [...state.currentAnswer];
            const newParts = [...state.parts, updated[index]];
            updated.splice(index, 1);
            return { currentAnswer: updated, parts: newParts };
          }),

        decrementLives: () => set((state) => ({ lives: state.lives - 1 })),

        resetGameState: () =>
          set((state) => {
            return {
              correctAnswer: [],
              parts: [],
              answers: [],
              currentAnswer: [],
              lives: 3,
            };
          }),
      }),
      {
        name: "sentence-arrangement-store",
        storage: {
          getItem: async (name) => {
            const value = await AsyncStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          },
          setItem: async (name, value) => {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: async (name) => {
            await AsyncStorage.removeItem(name);
          },
        },
      },
    ),
  );

interface FillInTheBlankGameState {
  phrases: string;
  correctAnswer: string | null;
  choices: string[];
  answers: string[];

  lives: number;
  setPhrases: (phrases: string) => void;
  setCorrectAnswer: (answer: string) => void;
  setChoices: (choices: string[]) => void;
  addAnswer: (answer: string) => void;
  resetAnswers: () => void;
  decrementLives: () => void;
  resetGameState: () => void;
}

export const useFillInTheBlankMiniGameStore = create<FillInTheBlankGameState>()(
  persist(
    (set) => ({
      phrases: "",
      correctAnswer: null,
      choices: [],
      answers: [],
      lives: 3,

      setPhrases: (phrases: string) => set({ phrases: phrases }),
      setCorrectAnswer: (answer: string) => set({ correctAnswer: answer }),

      setChoices: (choices: string[]) => set({ choices: choices }),
      addAnswer: (answer: string) =>
        set((state) => ({
          answers: [...state.answers, answer],
        })),
      resetAnswers: () => set({ answers: [] }),

      decrementLives: () => set((state) => ({ lives: state.lives - 1 })),

      resetGameState: () =>
        set((state) => {
          return {
            correctAnswer: null,
            choices: [],
            answers: [],
            lives: 3,
          };
        }),
    }),
    {
      name: "fill-in-the-blank-store",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);
