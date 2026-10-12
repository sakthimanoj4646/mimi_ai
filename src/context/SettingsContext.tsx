import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScreenID, ToastNotification } from '../types';
import { StorageService } from '../services/storageService';

interface SettingsContextType {
  currentScreen: ScreenID;
  navigate: (screen: ScreenID) => void;
  language: 'en' | 'tanglish' | 'ta';
  setLanguage: (lang: 'en' | 'tanglish' | 'ta') => void;
  theme: 'ocean' | 'dark-blue' | 'midnight';
  setTheme: (theme: 'ocean' | 'dark-blue' | 'midnight') => void;
  mockMode: boolean;
  setMockMode: (mock: boolean) => void;
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', title?: string) => void;
  removeToast: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Determine initial screen based on onboarding completion
  const [currentScreen, setCurrentScreen] = useState<ScreenID>('splash');
  const [language, setLanguage] = useState<'en' | 'tanglish' | 'ta'>('en');
  const [theme, setTheme] = useState<'ocean' | 'dark-blue' | 'midnight'>('ocean');
  const [mockMode, setMockMode] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    // Check if onboarding completed
    const done = StorageService.isOnboardingCompleted();
    const timer = setTimeout(() => {
      if (done) {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('onboarding');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const navigate = (screen: ScreenID) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentScreen(screen);
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastNotification = { id, message, type, title };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <SettingsContext.Provider
      value={{
        currentScreen,
        navigate,
        language,
        setLanguage,
        theme,
        setTheme,
        mockMode,
        setMockMode,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
