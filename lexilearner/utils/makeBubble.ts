import { personEnum } from "@/types/enum";

export const makeBubble = (text: string, person: string, type: personEnum) => {
  return {
    text: text,
    person: person,
    type: type,
  };
};
