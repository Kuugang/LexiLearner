import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define types
interface Book {
  Id: string;
  Type: string;
  Title: string;
  Author?: string;
  Description?: string;
  Cover: string;
  Content: string;
  Genre: string;
  Difficulty: number;
  [key: string]: any; // For any additional properties
}

interface BookCache {
  [key: string]: Book;
}

interface ReadingContentContextType {
  selectedBook: Book | null;
  selectBook: (book: Book) => void;
  bookCache: BookCache;
  getBookById: (id: string) => Promise<Book | null>;
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
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookCache, setBookCache] = useState<BookCache>({});

  // Select a book
  const selectBook = (book: Book) => {
    setSelectedBook(book);

    // Also cache it for future use
    setBookCache((prev) => ({
      ...prev,
      [book.Id]: book,
    }));
  };

  // Get book by ID (from cache or API)
  const getBookById = async (id: string): Promise<Book | null> => {
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
      const book: Book = {
        Id: id,
        Type: "API",
        Title: `Book ${id}`,
        Author: "Author Name",
        Description: "Book description from the API",
        Cover: "default-cover.png",
        Content: "Book content here loaded from the API...",
        Genre: "Fiction",
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
