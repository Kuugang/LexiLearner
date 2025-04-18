import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { ReadingContentType } from "@/models/ReadingContent";

interface BookCache {
  [key: string]: ReadingContentType;
}

interface ReadingContentContextType {
  selectedBook: ReadingContentType | null;
  selectBook: (book: ReadingContentType) => void;
  bookCache: BookCache;
  getBookById: (id: string) => Promise<ReadingContentType | null>;
}

// Create context with a default value
const BooksContext = createContext<ReadingContentContextType | undefined>(
  undefined,
);

// Provider props
interface ReadingContentProviderProps {
  children: ReactNode;
}

// Provider component
export function ReadingContentProvider({
  children,
}: ReadingContentProviderProps) {
  const [selectedBook, setSelectedBook] = useState<ReadingContentType | null>(
    null,
  );
  const [bookCache, setBookCache] = useState<BookCache>({});

  // Select a book
  const selectBook = (book: ReadingContentType) => {
    setSelectedBook(book);

    // Also cache it for future use
    setBookCache((prev) => ({
      ...prev,
      [book.Id]: book,
    }));
  };

  // Get book by ID (from cache or API)
  const getBookById = async (
    id: string,
  ): Promise<ReadingContentType | null> => {
    // Return from cache if available
    if (bookCache[id]) {
      return bookCache[id];
    }

    // Otherwise fetch from API
    try {
      // In a real app, fetch from your API
      // const response = await fetch(`/api/books/${id}`);
      // const book = await response.json();

      // Simulated API response
      const book: ReadingContentType = {
        Id: id,
        Type: "API",
        Title: `Book ${id}`,
        Author: "Author Name",
        Description: "Book description from the API",
        Cover: "default-cover.png",
        Content: "Book content here loaded from the API...",
        Genre: ["Fiction"],
        Difficulty: 3,
      };

      // Cache the result
      setBookCache((prev) => ({
        ...prev,
        [id]: book,
      }));

      return book;
    } catch (error) {
      console.error("Failed to fetch book:", error);
      return null;
    }
  };

  // Value to provide
  const value: ReadingContentContextType = {
    selectedBook,
    selectBook,
    bookCache,
    getBookById,
  };

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
}

// Custom hook to use the context
export function useBooks(): ReadingContentContextType {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BooksProvider");
  }
  return context;
}
