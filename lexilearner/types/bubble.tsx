import { Choice } from "@/stores/miniGameStore";
import { personEnum } from "./enum";

// messages and stories
export type bubble = {
  text: string;
  person: string;
  type: personEnum;
  definition?: string;
  translation?: string;
};

// minigame choices
export type choice = {
  question: string;
  choices: Choice[];
  explanation: string;
};

export type arrange = {
  correctAnswer: string[];
  parts: string[];
  explanation: string;
};
