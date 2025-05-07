export interface ReadingSession {
  id: string;
  pupilId: string;
  readingMaterialId: string;
  completionPercentage: number;

  startedAt: string;
  completedAt: string;
}
