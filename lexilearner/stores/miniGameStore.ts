import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MiniGameStore {
  game: string | null;
  setGame: (game: string) => void;
}

export const useMiniGameStore = create<MiniGameStore>()(
  persist(
    (set) => ({
      game: null,
      setGame: (game: string) => set({ game: game }),
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

interface WordsFromLettersGameState {
  letters: string[];
  guess: string[];
  usedIndices: number[];
  correctAnswers: string[];
  incorrectAnswers: string[];
  streak: number;
  lives: number;

  shuffleLetters: () => void;

  setLetters: (letters: string[]) => void;
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

type Choice = { choice: string; answer: boolean };
interface _2Truths1LieGameState {
  choices: Choice[];
  score: number;

  setScore: () => void;
  setChoices: (choices: Choice[]) => void;
  newGame: () => void;
}

interface WordHuntGameState {
  correctAnswers: string[];
  wrongAnswers: string[];
  allWords: string[];
  lives: number;
  streak: number;
  shuffledWords: string[];
  answered: string[];

  setShuffled: (allWords: string[]) => void;
  setAnswered: (answered: string) => void;
  setCorrectAnswers: (correctAnswers: string[]) => void;
  setWrongAnswers: (wrongAnswers: string[]) => void;
  setAllWords: (allWords: string[]) => void;

  incrementStreak: () => void;
  resetStreak: () => void;
  newGame: () => void;
  decrementLives: () => void;
}

export const use2Truths1LieGameStore = create<_2Truths1LieGameState>()(
  persist(
    (set) => ({
      choices: [],
      score: 0,

      setScore: () => set((state) => ({ score: state.score + 1 })),
      setChoices: (choices: Choice[]) => set((state) => ({ choices: choices })),
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

export const useWordHuntGameStore = create<WordHuntGameState>()(
  persist(
    (set) => ({
      correctAnswers: [],
      wrongAnswers: [],
      allWords: [],
      lives: 3,
      streak: 0,
      shuffledWords: [],
      answered: [],

      setShuffled: (allWords: string[]) => {
        const shuffled = allWords
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);

        set({ shuffledWords: shuffled });
      },

      setAnswered: (word: string) =>
        set((state) => ({
          answered: [...state.answered, word],
        })),

      setCorrectAnswers: (correctAnswers: string[]) =>
        set((state) => ({ correctAnswers: correctAnswers })),
      setWrongAnswers: (wrongAnswers: string[]) =>
        set((state) => ({ wrongAnswers: wrongAnswers })),
      setAllWords: (allWords: string[]) =>
        set((state) => ({ allWords: allWords })),

      decrementLives: () =>
        set((state) => ({
          lives: state.lives - 1,
        })),

      resetStreak: () => set((state) => ({ streak: 0 })),
      newGame: () =>
        set(() => ({
          lives: 3,
          streak: 0,
          answered: [],
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

export const useWordsFromLettersMiniGameStore =
  create<WordsFromLettersGameState>()(
    persist(
      (set) => ({
        letters: Array(5).fill(""),
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
              guess: Array(5).fill(""),
              usedIndices: Array(5).fill(-1),
              correctAnswers: [],
              incorrectAnswers: [],
              streak: 0,
              lives: 3,
            };
          }),

        decrementLives: () => set((state) => ({ lives: state.lives - 1 })),
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

interface SentenceArrangementGameState {
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

export const useSentenceArrangementMiniGameStore =
  create<SentenceArrangementGameState>()(
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
  phrases: string | null;
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
      phrases: null,
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
