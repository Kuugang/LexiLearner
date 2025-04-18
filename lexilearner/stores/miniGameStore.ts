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
  addAnswer: (answer: string[]) => void;
  resetGame: () => void;
  decrementLives: () => void;
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

        addAnswer: (answer: string[]) =>
          set((state) => ({
            answers: [...state.answers, [...answer]],
          })),

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
