import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface TerminalInfo {
  name: string;
  city: string;
  area: string;
  contactNumber: string;
}

interface TerminalContextType {
  terminalInfo: TerminalInfo | null;
  isSetupComplete: boolean;
  setTerminalInfo: (info: TerminalInfo) => void;
  clearTerminalInfo: () => void;
}

const STORAGE_KEY = "terminal-info";

const TerminalContext = createContext<TerminalContextType | undefined>(
  undefined
);

export function useTerminal(): TerminalContextType {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
}

interface TerminalProviderProps {
  children: ReactNode;
}

export function TerminalProvider({ children }: TerminalProviderProps) {
  const [terminalInfo, setTerminalInfoState] = useState<TerminalInfo | null>(
    () => {
      if (typeof window === "undefined") return null;

      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as TerminalInfo;
          // Validate that all required fields exist
          if (
            parsed.name &&
            parsed.city &&
            parsed.area &&
            parsed.contactNumber
          ) {
            return parsed;
          }
        }
      } catch (error) {
        console.error("Failed to load terminal info from localStorage:", error);
      }

      return null;
    }
  );

  // Check if setup is complete
  const isSetupComplete = terminalInfo !== null;

  // Persist to localStorage whenever terminalInfo changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (terminalInfo) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(terminalInfo));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error("Failed to save terminal info to localStorage:", error);
      }
    }
  }, [terminalInfo]);

  const setTerminalInfo = (info: TerminalInfo) => {
    setTerminalInfoState(info);
  };

  const clearTerminalInfo = () => {
    setTerminalInfoState(null);
  };

  const value: TerminalContextType = {
    terminalInfo,
    isSetupComplete,
    setTerminalInfo,
    clearTerminalInfo,
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}
