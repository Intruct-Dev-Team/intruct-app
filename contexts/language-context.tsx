import { setI18nLanguage } from "@/localization/i18n";
import { settingsApi } from "@/services/api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UiLanguageCode = string;

export type LanguageContextValue = {
  language: UiLanguageCode;
  isLoaded: boolean;
  setLanguage: (next: UiLanguageCode) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

const DEFAULT_LANGUAGE: UiLanguageCode = "en";

const SUPPORTED_UI_LANGUAGES = new Set<UiLanguageCode>([
  "en",
  "zh",
  "hi",
  "de",
  "es",
  "fr",
  "pt",
  "ru",
  "sr",
]);

function normalizeLanguage(value: unknown): UiLanguageCode {
  if (typeof value !== "string") return DEFAULT_LANGUAGE;
  if (SUPPORTED_UI_LANGUAGES.has(value)) return value;
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] =
    useState<UiLanguageCode>(DEFAULT_LANGUAGE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const settings = await settingsApi.getSettings();
      if (cancelled) return;

      const nextLanguage = normalizeLanguage(settings.language);
      setLanguageState(nextLanguage);
      setI18nLanguage(nextLanguage);
      setIsLoaded(true);
    })().catch((error: unknown) => {
      if (cancelled) return;

      console.error("Failed to load language:", error);
      setLanguageState(DEFAULT_LANGUAGE);
      setI18nLanguage(DEFAULT_LANGUAGE);
      setIsLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = useCallback(async (next: UiLanguageCode) => {
    const normalized = normalizeLanguage(next);

    setLanguageState(normalized);
    setI18nLanguage(normalized);

    try {
      await settingsApi.updateSettings({ language: normalized });
    } catch (error: unknown) {
      console.error("Failed to save language:", error);
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    return { language, isLoaded, setLanguage };
  }, [language, isLoaded, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
