import React, { createContext, useContext, useState } from 'react';

type TheaterModeContextType = {
  isTheaterMode: boolean;
  toggleTheaterMode: () => void;
  enableTheaterMode: () => void;
  disableTheaterMode: () => void;
};

const TheaterModeContext = createContext<TheaterModeContextType>({
  isTheaterMode: false,
  toggleTheaterMode: () => {},
  enableTheaterMode: () => {},
  disableTheaterMode: () => {},
});

export const useTheaterMode = () => useContext(TheaterModeContext);

export const TheaterModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const toggleTheaterMode = () => {
    setIsTheaterMode(prevState => !prevState);
  };

  const enableTheaterMode = () => {
    setIsTheaterMode(true);
  };

  const disableTheaterMode = () => {
    setIsTheaterMode(false);
  };

  const value = {
    isTheaterMode,
    toggleTheaterMode,
    enableTheaterMode,
    disableTheaterMode,
  };

  return (
    <TheaterModeContext.Provider value={value}>
      {children}
    </TheaterModeContext.Provider>
  );
};