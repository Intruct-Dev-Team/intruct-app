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

export default function SettingsScreen() {
  const router = useRouter();
  const tamaguiTheme = useTamaguiTheme();
  const { activeTheme } = useAppTheme();
  const { user, profile } = useAuth();
  const { language: uiLanguage, setLanguage } = useLanguage();

  const settingsIconColor = tamaguiTheme.colorHover.get();
  const chevronIconColor = tamaguiTheme.colorPress.get();

  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [languageModalTarget, setLanguageModalTarget] =
    useState<LanguageModalTarget>(null);

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
        setLanguageModalOpen(true);
        return;
      default:
        return;
    }
  };

  const modalValue =
    languageModalTarget === "ui" ? uiLanguage : defaultCourseLanguage;

  const handleModalValueChange = (languageCode: string) => {
    if (languageModalTarget === "ui") {
      void setLanguage(languageCode);
      return;
    }

    setDefaultCourseLanguage(languageCode);
    settingsApi
      .updateSettings({ defaultCourseLanguage: languageCode })
      .catch(() => {});
  };

  return (
    <ScreenContainer>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <YStack gap="$4">
        <UserProfileCard
          name={
            (profile?.name && profile?.surname
              ? `${profile.name} ${profile.surname}`.trim()
              : profile?.name || profile?.surname) ||
            user?.user_metadata?.full_name ||
            user?.email?.split("@")[0] ||
            "User"
          }
          email={profile?.email || user?.email || ""}
          avatarUrl={profile?.avatar || user?.user_metadata?.avatar_url}
          onPress={() => router.push("/settings/profile")}
        />

        <SectionHeader title="Account Settings" />
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
                title={item.title}
                description={item.description}
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

        <SectionHeader title="AI Settings" />
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
                title={item.title}
                description={
                  item.id === "content-language"
                    ? defaultCourseLanguageLabel
                    : item.description
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

        <SectionHeader title="App Settings" />
        <SettingsCard>
          <SettingsItem
            icon={
              <Moon
                key={`moon-${activeTheme}`}
                size={20}
                color={settingsIconColor}
              />
            }
            title="Dark Mode"
            description="Enable dark theme"
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
            title="Language"
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
              setLanguageModalOpen(true);
            }}
          />
        </SettingsCard>

        <SectionHeader title="Support" />
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
                title={item.title}
                description={item.description}
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

      <LanguageModal
        open={languageModalOpen}
        onOpenChange={(open) => {
          setLanguageModalOpen(open);
          if (!open) setLanguageModalTarget(null);
        }}
        value={modalValue}
        onValueChange={handleModalValueChange}
        title={
          languageModalTarget === "ui" ? "App Language" : "Content Language"
        }
      />
    </ScreenContainer>
  );
}
