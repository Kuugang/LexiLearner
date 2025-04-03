export interface ReadingContent {
  Id: string;
  Title: string;
  Author?: string;
  Description: string;
  Cover: string;
  Content: string;
  Genre: string;
  Difficulty: number;
}

export interface ReadingItem {
  id: string;
  type: string;
  title: string;
  author?: string;
  description?: string;
  cover: string;
  content: string;
  genre: string;
  difficulty: number;
}
