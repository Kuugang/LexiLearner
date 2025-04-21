import { ReadingContentType } from "@/models/ReadingContent";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";

type ReadingContentStore = {
  contents: ReadingContentType[] | null;
  selectedContent: ReadingContentType | null;

  setContents: (contents: ReadingContentType[]) => void;
  selectContent: (content: ReadingContentType) => void;
};

const ReadingContentContext = createContext<
  StoreApi<ReadingContentStore> | undefined
>(undefined);

type ReadingContentProviderProps = PropsWithChildren & {
  selectedContent: ReadingContentType;
};

export default function ReadingContentProvider({
  children,
  selectedContent,
}: ReadingContentProviderProps) {
  const [store] = useState(() =>
    createStore<ReadingContentStore>((set) => ({
      contents: null,
      selectedContent: selectedContent,
      setContents: (contents: ReadingContentType[]) =>
        set({ contents: contents }),
      selectContent: (content: ReadingContentType) =>
        set({ selectedContent: content }),
    })),
  );

  return (
    <ReadingContentContext.Provider value={store}>
      {children}
    </ReadingContentContext.Provider>
  );
}

export function useCountStore<T>(selector: (state: ReadingContentStore) => T) {
  const context = useContext(ReadingContentContext);

  if (!context) {
    throw new Error("CountContext.Provider is missing");
  }

  return useStore(context, selector);
}
