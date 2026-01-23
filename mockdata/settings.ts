import type { LanguageOption, SettingsMenuItem } from "@/types";

export const languageOptions: LanguageOption[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "sr", label: "Srpski", flag: "🇷🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];

export const accountSettingsItems: SettingsMenuItem[] = [
  {
    id: "personal-info",
    title: "Personal Information",
    description: "View your personal information",
    icon: "user",
    action: "navigate:personal-info",
  },
  {
    id: "billing",
    title: "Billing",
    description: "View plans and billing details",
    icon: "credit-card",
    action: "navigate:billing",
  },
];

export const aiSettingsItems: SettingsMenuItem[] = [
  {
    id: "content-language",
    title: "Content Language",
    description: "Set default language for content",
    icon: "languages",
    action: "navigate:content-language",
  },
];

export const supportItems: SettingsMenuItem[] = [
  {
    id: "help-center",
    title: "Help Center",
    description: "FAQs and tutorials",
    icon: "help-circle",
    action: "navigate:help-center",
  },
  {
    id: "contact-support",
    title: "Contact Support",
    description: "Get help from our team",
    icon: "message-circle",
    action: "navigate:contact-support",
  },
];
