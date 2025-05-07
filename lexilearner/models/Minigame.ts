export enum MinigameType {
  WordsFromLetters,
  FillInTheBlanks,
  SentenceRearrangement,
  WordHunt,
  TwoTruthsOneLie,
}

export interface Minigame {
  id: string;
  readingMaterialId: string;
  minigameType: MinigameType;
  metaData: string;
  MaxScore: number;

  createdAt: string;
}
