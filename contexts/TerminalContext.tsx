/**
 * Terminal Context - Manages terminal configuration
 * Stores terminal info (name, city, area, contact) in localStorage
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Terminal information structure
 */
export interface TerminalInfo {
  name: string;
  city: string;
  area: string;
  contactNumber: string;
}

/**
 * Context value type
 */
interface TerminalContextType {
  terminalInfo: TerminalInfo | null;
  isSetupComplete: boolean;
  setTerminalInfo: (info: TerminalInfo) => void;
  clearTerminalInfo: () => void;
}

/**
 * localStorage key for terminal info
 */
const STORAGE_KEY = 'terminal-info';

/**
 * Create the context
 */
const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

/**
 * Hook to use terminal context
 */
export function useTerminal(): TerminalContextType {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}

/**
 * Provider props
 */
interface TerminalProviderProps {
  children: ReactNode;
}

/**
 * Terminal Provider - Manages terminal configuration state
 */
export function TerminalProvider({ children }: TerminalProviderProps) {
  const [terminalInfo, setTerminalInfoState] = useState<TerminalInfo | null>(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as TerminalInfo;
        // Validate that all required fields exist
        if (parsed.name && parsed.city && parsed.area && parsed.contactNumber) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load terminal info from localStorage:', error);
    }

    return null;
  });

  // Check if setup is complete
  const isSetupComplete = terminalInfo !== null;

  // Persist to localStorage whenever terminalInfo changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (terminalInfo) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(terminalInfo));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to save terminal info to localStorage:', error);
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
