import { ThemeToggle } from "@/components/common";
import {
  PageHeader,
  ScreenContainer,
  SectionHeader,
} from "@/components/layout";
import { LanguageModal } from "@/components/modals";
import {
  SettingsCard,
  SettingsFooter,
  SettingsItem,
} from "@/components/settings";
import { UserProfileCard } from "@/components/user";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/language-context";
import { useTheme as useAppTheme } from "@/contexts/theme-context";
import { t } from "@/localization/i18n";
import {
  accountSettingsItems,
  aiSettingsItems,
  languageOptions,
  supportItems,
} from "@/mockdata/settings";
import { settingsApi } from "@/services/api";
import {
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  Languages,
  MessageCircle,
  Moon,
  User as UserIcon,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import { InteractionManager } from "react-native";
import { YStack, useTheme as useTamaguiTheme } from "tamagui";

type IconComponent = ComponentType<{ size?: number; color?: string }>;

const iconMap: Record<string, IconComponent> = {
  user: UserIcon,
  "credit-card": CreditCard,
  languages: Languages,
  "help-circle": HelpCircle,
  "message-circle": MessageCircle,
};

type LanguageModalTarget = "ui" | "content" | null;

type PendingLanguageChange = {
  target: Exclude<LanguageModalTarget, null>;
  value: string;
} | null;

export default function SettingsScreen() {
  const router = useRouter();
  const tamaguiTheme = useTamaguiTheme();
  const { activeTheme } = useAppTheme();
  const { user, profile } = useAuth();
  const { language: uiLanguage, setLanguage } = useLanguage();

  const copy = useMemo(() => {
    void uiLanguage;
    return {
      settingsTitle: t("Settings"),
      settingsSubtitle: t("Manage your account and preferences"),
      accountSettings: t("Account Settings"),
      aiSettings: t("AI Settings"),
      appSettings: t("App Settings"),
      support: t("Support"),
      darkMode: t("Dark Mode"),
      enableDarkTheme: t("Enable dark theme"),
      language: t("Language"),
      appLanguage: t("App Language"),
      contentLanguage: t("Content Language"),
      userFallback: t("User"),
    };
  }, [uiLanguage]);

  const settingsIconColor = tamaguiTheme.colorHover.get();
  const chevronIconColor = tamaguiTheme.colorPress.get();

  const avatarUrl =
    profile?.avatar ??
    (typeof user?.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : undefined);

  const [languageModalTarget, setLanguageModalTarget] =
    useState<LanguageModalTarget>(null);
  const [pendingLanguageChange, setPendingLanguageChange] =
    useState<PendingLanguageChange>(null);

  const [defaultCourseLanguage, setDefaultCourseLanguage] = useState("en");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const settings = await settingsApi.getSettings();
      if (cancelled) return;
      setDefaultCourseLanguage(settings.defaultCourseLanguage);
    })().catch(() => {
      // Non-blocking: screen can still function with defaults
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setLanguageModalTarget(null);
  }, [uiLanguage]);

  const uiLanguageLabel = useMemo(() => {
    return (
      languageOptions.find((l) => l.code === uiLanguage)?.label ||
      "English (US)"
    );
  }, [uiLanguage]);

  const defaultCourseLanguageLabel = useMemo(() => {
    return (
      languageOptions.find((l) => l.code === defaultCourseLanguage)?.label ||
      "English (US)"
    );
  }, [defaultCourseLanguage]);

  const handleSettingsItemPress = (itemId: string) => {
    switch (itemId) {
      case "personal-info":
        router.push("/settings/profile");
        return;
      case "billing":
        router.push("/settings/billing");
        return;
      case "help-center":
        router.push("/settings/help-center");
        return;
      case "contact-support":
        router.push("/settings/contact-support");
        return;
      case "content-language":
        setLanguageModalTarget("content");
        return;
      default:
        return;
    }
  };

  const modalValue =
    languageModalTarget === "ui" ? uiLanguage : defaultCourseLanguage;
  const isLanguageModalOpen = languageModalTarget !== null;

  const handleModalValueChange = (languageCode: string) => {
    if (!languageModalTarget) return;

    setPendingLanguageChange({
      target: languageModalTarget,
      value: languageCode,
    });
    setLanguageModalTarget(null);
  };

  useEffect(() => {
    if (isLanguageModalOpen || !pendingLanguageChange) return;

    const { target, value } = pendingLanguageChange;
    const interaction = InteractionManager.runAfterInteractions(() => {
      setPendingLanguageChange(null);

      if (target === "ui") {
        void setLanguage(value);
        return;
      }

      setDefaultCourseLanguage(value);
      settingsApi
        .updateSettings({ defaultCourseLanguage: value })
        .catch(() => {});
    });

    return () => {
      interaction.cancel();
    };
  }, [isLanguageModalOpen, pendingLanguageChange, setLanguage]);

  return (
    <ScreenContainer>
      <PageHeader title={copy.settingsTitle} subtitle={copy.settingsSubtitle} />

      <YStack gap="$4">
        <UserProfileCard
          name={
            (profile?.name && profile?.surname
              ? `${profile.name} ${profile.surname}`.trim()
              : profile?.name || profile?.surname) ||
            user?.user_metadata?.full_name ||
            user?.email?.split("@")[0] ||
            copy.userFallback
          }
          email={profile?.email || user?.email || ""}
          avatarUrl={avatarUrl}
          onPress={() => router.push("/settings/profile")}
        />

        <SectionHeader title={copy.accountSettings} />
        <SettingsCard>
          {accountSettingsItems.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <SettingsItem
                key={item.id}
                icon={
                  Icon ? (
                    <Icon
                      key={`${item.id}-${activeTheme}`}
                      size={20}
                      color={settingsIconColor}
                    />
                  ) : null
                }
                title={t(item.title)}
                description={item.description ? t(item.description) : ""}
                rightElement={
                  <ChevronRight
                    key={`chevron-${item.id}-${activeTheme}`}
                    size={20}
                    color={chevronIconColor}
                  />
                }
                onPress={() => handleSettingsItemPress(item.id)}
                showDivider={index < accountSettingsItems.length - 1}
              />
            );
          })}
        </SettingsCard>

        <SectionHeader title={copy.aiSettings} />
        <SettingsCard>
          {aiSettingsItems.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <SettingsItem
                key={item.id}
                icon={
                  Icon ? (
                    <Icon
                      key={`${item.id}-${activeTheme}`}
                      size={20}
                      color={settingsIconColor}
                    />
                  ) : null
                }
                title={t(item.title)}
                description={
                  item.id === "content-language"
                    ? defaultCourseLanguageLabel
                    : item.description
                      ? t(item.description)
                      : ""
                }
                rightElement={
                  <ChevronRight
                    key={`chevron-${item.id}-${activeTheme}`}
                    size={20}
                    color={chevronIconColor}
                  />
                }
                onPress={() => handleSettingsItemPress(item.id)}
                showDivider={index < aiSettingsItems.length - 1}
              />
            );
          })}
        </SettingsCard>

        <SectionHeader title={copy.appSettings} />
        <SettingsCard>
          <SettingsItem
            icon={
              <Moon
                key={`moon-${activeTheme}`}
                size={20}
                color={settingsIconColor}
              />
            }
            title={copy.darkMode}
            description={copy.enableDarkTheme}
            rightElement={<ThemeToggle />}
            showDivider
          />
          <SettingsItem
            icon={
              <Globe
                key={`globe-${activeTheme}`}
                size={20}
                color={settingsIconColor}
              />
            }
            title={copy.language}
            description={uiLanguageLabel}
            rightElement={
              <ChevronRight
                key={`chevron-language-${activeTheme}`}
                size={20}
                color={chevronIconColor}
              />
            }
            onPress={() => {
              setLanguageModalTarget("ui");
            }}
          />
        </SettingsCard>

        <SectionHeader title={copy.support} />
        <SettingsCard>
          {supportItems.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <SettingsItem
                key={item.id}
                icon={
                  Icon ? (
                    <Icon
                      key={`${item.id}-${activeTheme}`}
                      size={20}
                      color={settingsIconColor}
                    />
                  ) : null
                }
                title={t(item.title)}
                description={item.description ? t(item.description) : ""}
                rightElement={
                  <ChevronRight
                    key={`chevron-${item.id}-${activeTheme}`}
                    size={20}
                    color={chevronIconColor}
                  />
                }
                onPress={() => handleSettingsItemPress(item.id)}
                showDivider={index < supportItems.length - 1}
              />
            );
          })}
        </SettingsCard>

        <SettingsFooter />
      </YStack>

      {isLanguageModalOpen && (
        <LanguageModal
          key={`language-modal-${uiLanguage}`}
          open
          onOpenChange={(open) => {
            if (!open) setLanguageModalTarget(null);
          }}
          value={modalValue}
          onValueChange={handleModalValueChange}
          title={
            languageModalTarget === "ui"
              ? copy.appLanguage
              : copy.contentLanguage
          }
        />
      )}
    </ScreenContainer>
  );
}
