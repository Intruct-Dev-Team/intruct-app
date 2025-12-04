import { LanguageOption, SettingsMenuItem } from "@/types";

export const languageOptions: LanguageOption[] = [
  { code: "en", label: "English (US)", flag: "🇺🇸" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export const accountSettingsItems: SettingsMenuItem[] = [
  {
    id: "personal-info",
    title: "Personal Information",
    description: "Update your name, email, and pr...",
    icon: "user",
    action: "navigate:personal-info",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Manage notification preferences",
    icon: "bell",
    action: "navigate:notifications",
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    description: "Password, two-factor authenticat...",
    icon: "lock",
    action: "navigate:privacy",
  },
  {
    id: "billing",
    title: "Billing",
    description: "Manage subscription and payme...",
    icon: "credit-card",
    action: "navigate:billing",
  },
];

export const aiSettingsItems: SettingsMenuItem[] = [
  {
    id: "ai-model",
    title: "AI Model Preference",
    description: "Choose your preferred AI model",
    icon: "sparkles",
    action: "navigate:ai-model",
  },
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
