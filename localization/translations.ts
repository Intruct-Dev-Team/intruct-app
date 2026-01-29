import de from "./de.json";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import hi from "./hi.json";
import pt from "./pt.json";
import ru from "./ru.json";
import sr from "./sr.json";
import zh from "./zh.json";

export type TranslationDictionary = Record<string, string>;
export type Translations = Record<string, TranslationDictionary>;

export const translations: Translations = {
  en,
  sr,
  zh,
  hi,
  ru,
  de,
  es,
  fr,
  pt,
};
