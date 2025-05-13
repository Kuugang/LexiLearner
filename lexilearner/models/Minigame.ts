export enum MinigameType {
  WordsFromLetters = "WordsFromLetters",
  FillInTheBlanks = "FillInTheBlanks",
  SentenceRearrangement = "SentenceRearrangement",
  WordHunt = "WordHunt",
  TwoTruthsOneLie = "TwoTruthsOneLie",
}

export interface Minigame {
  id: string;
  readingMaterialId: string;
  minigameType: MinigameType;
  metaData: string;
  MaxScore: number;

  createdAt: string;
}
