import { ReadingContentType } from "./ReadingContent";

export interface ReadingAssignment {
  id: string;
  classroomId: string;
  readingMaterialId: string;
  minigameId: string;
  minigameType: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  cover: string;
  updatedAt: string;
}

export interface ReadingAssignmentOverview extends ReadingAssignment {
  numberOfStudentsFinished: number;
  averageScore: number;
  averageDuration: number;
}
