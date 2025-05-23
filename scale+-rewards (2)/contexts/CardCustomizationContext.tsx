
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CardSettings } from '../types';

interface CardCustomizationContextType {
  cardSettings: CardSettings;
  updateCardSettings: (newSettings: Partial<CardSettings>) => void; 
  resetCardSettings: () => void;
}

export const CardCustomizationContext = createContext<CardCustomizationContextType | undefined>(undefined);

const DEFAULT_CARD_SETTINGS: CardSettings = { 
  logoUrl: undefined, 
  coverImageUrl: undefined, 
  cardTitle: 'LOYALTY REWARDS', 
  primaryColor: '#1F2937', 
  secondaryColor: '#FFFFFF', 
};

interface CardCustomizationProviderProps {
  children: ReactNode;
}

export const CardCustomizationProvider: React.FC<CardCustomizationProviderProps> = ({ children }) => {
  const [cardSettings, setCardSettings] = useState<CardSettings>(() => {
    const storedSettings = localStorage.getItem('cardCustomizationSettings');
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        // Ensure all keys from default are present, and types are correct
        // FIX: Remove destructuring of numberOfStamps as it is no longer part of CardSettings
        // const { numberOfStamps, ...restOfParsed } = parsed; // Destructure out numberOfStamps
        return {
          ...DEFAULT_CARD_SETTINGS,
          ...parsed, // Spread parsed settings, any legacy numberOfStamps will be ignored due to CardSettings type
        } as CardSettings; 
      } catch (error) {
        console.error("Failed to parse card settings from localStorage:", error);
        return DEFAULT_CARD_SETTINGS;
      }
    }
    return DEFAULT_CARD_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('cardCustomizationSettings', JSON.stringify(cardSettings));
  }, [cardSettings]);

  // FIX: Removed destructuring of numberOfStamps from prevSettings.
  // Changed newSettings type to Partial<CardSettings> as Omit<CardSettings, 'numberOfStamps'> is redundant.
  const updateCardSettings = useCallback((newSettings: Partial<CardSettings>) => {
    setCardSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings,
    }));
  }, []);

  const resetCardSettings = useCallback(() => {
    setCardSettings(DEFAULT_CARD_SETTINGS);
    localStorage.removeItem('cardCustomizationSettings');
  }, []);

  return (
    <CardCustomizationContext.Provider value={{ cardSettings, updateCardSettings, resetCardSettings }}>
      {children}
    </CardCustomizationContext.Provider>
  );
};
