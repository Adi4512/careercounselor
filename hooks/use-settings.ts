import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Settings {
  aiPersonality: 'professional' | 'friendly' | 'direct';
  responseLength: 'brief' | 'detailed' | 'comprehensive';
  enableNotifications: boolean;
  autoSave: boolean;
  theme: 'dark' | 'light';
}

const SETTINGS_KEY = 'career-counselor-settings';

// Query key factory for settings
export const settingsKeys = {
  all: ['settings'] as const,
  current: () => [...settingsKeys.all, 'current'] as const,
};

// Default settings
const defaultSettings: Settings = {
  aiPersonality: 'professional',
  responseLength: 'detailed',
  enableNotifications: true,
  autoSave: true,
  theme: 'dark',
};

// Get settings from localStorage
const getSettings = (): Settings => {
  if (typeof window === 'undefined') return defaultSettings;
  
  const savedSettings = localStorage.getItem(SETTINGS_KEY);
  if (savedSettings) {
    try {
      return { ...defaultSettings, ...JSON.parse(savedSettings) };
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
};

// Save settings to localStorage
const saveSettings = (settings: Settings) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// Hook to get current settings
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.current(),
    queryFn: getSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to update settings
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSettings: Partial<Settings>) => {
      const currentSettings = getSettings();
      const updatedSettings = { ...currentSettings, ...newSettings };
      saveSettings(updatedSettings);
      return updatedSettings;
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(settingsKeys.current(), updatedSettings);
    },
  });
}
