import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AppSettings } from "@/types";

import { DELAYS, delay, isRecord } from "./core";

const SETTINGS_STORAGE_KEY = "intruct.appSettings";

let didLoadSettingsFromStorage = false;
let inMemorySettings: AppSettings = {
  theme: "system",
  language: "en",
  defaultCourseLanguage: "en",
  notifications: true,
};

const loadSettingsFromStorage = async (): Promise<void> => {
  if (didLoadSettingsFromStorage) return;
  didLoadSettingsFromStorage = true;

  try {
    const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw) as Partial<AppSettings> | null;
    if (parsed && isRecord(parsed)) {
      inMemorySettings = { ...inMemorySettings, ...parsed };
    }
  } catch {
    // Silent
  }
};

const saveSettingsToStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(inMemorySettings),
    );
  } catch {
    // Silent
  }
};

export const settingsApi = {
  async getSettings(): Promise<AppSettings> {
    await delay(DELAYS.settings);
    await loadSettingsFromStorage();
    return inMemorySettings;
  },

  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    await delay(DELAYS.settings);
    await loadSettingsFromStorage();
    inMemorySettings = { ...inMemorySettings, ...settings };
    await saveSettingsToStorage();
    return inMemorySettings;
  },
};
