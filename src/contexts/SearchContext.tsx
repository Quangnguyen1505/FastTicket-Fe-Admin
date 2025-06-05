"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  context: string;
  searchTerm: string;
  setSearchContext: (context: string, term: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [context, setContext] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const setSearchContext = (newContext: string, term: string) => {
    setContext(newContext);
    setSearchTerm(term);
  };

  return (
    <SearchContext.Provider value={{ context, searchTerm, setSearchContext }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};