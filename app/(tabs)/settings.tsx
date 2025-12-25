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
import { UserProfileCard, UserProfileSkeleton } from "@/components/user";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import {
  accountSettingsItems,
  aiSettingsItems,
  languageOptions,
  supportItems,
} from "@/mockdata/settings";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  Languages,
  Lock,
  MessageCircle,
  Moon,
  Sparkles,
  User as UserIcon,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { YStack } from "tamagui";

const iconMap: Record<string, any> = {
  user: UserIcon,
  bell: Bell,
  lock: Lock,
  "credit-card": CreditCard,
  sparkles: Sparkles,
  languages: Languages,
  "help-circle": HelpCircle,
  "message-circle": MessageCircle,
};

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, isLoading: loading } = useAuth();

  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const selectedLanguageLabel = useMemo(() => {
    return (
      languageOptions.find((l) => l.code === selectedLanguage)?.label ||
      "English (US)"
    );
  }, [selectedLanguage]);

  return (
    <ScreenContainer>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <YStack gap="$4">
        {loading ? (
          <UserProfileSkeleton />
        ) : (
          <UserProfileCard
            name={
              user?.user_metadata?.full_name ||
              user?.email?.split("@")[0] ||
              "User"
            }
            email={user?.email || ""}
            avatarUrl={user?.user_metadata?.avatar_url}
            onPress={() => router.push("/settings/profile")}
          />
        )}

        <SectionHeader title="Account Settings" />
        <SettingsCard>
          {accountSettingsItems.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <SettingsItem
                key={item.id}
                icon={
                  Icon ? <Icon size={20} color={colors.textSecondary} /> : null
                }
                title={item.title}
                description={item.description}
                rightElement={
                  <ChevronRight size={20} color={colors.textTertiary} />
                }
                onPress={() => console.log(item.action)}
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
                  Icon ? <Icon size={20} color={colors.textSecondary} /> : null
                }
                title={item.title}
                description={item.description}
                rightElement={
                  <ChevronRight size={20} color={colors.textTertiary} />
                }
                onPress={() => console.log(item.action)}
                showDivider={index < aiSettingsItems.length - 1}
              />
            );
          })}
        </SettingsCard>

        <SectionHeader title="App Settings" />
        <SettingsCard>
          <SettingsItem
            icon={<Moon size={20} color={colors.textSecondary} />}
            title="Dark Mode"
            description="Enable dark theme"
            rightElement={<ThemeToggle />}
            showDivider
          />
          <SettingsItem
            icon={<Globe size={20} color={colors.textSecondary} />}
            title="Language"
            description={selectedLanguageLabel}
            rightElement={
              <ChevronRight size={20} color={colors.textTertiary} />
            }
            onPress={() => setLanguageModalOpen(true)}
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
                  Icon ? <Icon size={20} color={colors.textSecondary} /> : null
                }
                title={item.title}
                description={item.description}
                rightElement={
                  <ChevronRight size={20} color={colors.textTertiary} />
                }
                onPress={() => console.log(item.action)}
                showDivider={index < supportItems.length - 1}
              />
            );
          })}
        </SettingsCard>

        <SettingsFooter />
      </YStack>

      <LanguageModal
        open={languageModalOpen}
        onOpenChange={setLanguageModalOpen}
        value={selectedLanguage}
        onValueChange={setSelectedLanguage}
      />
    </ScreenContainer>
  );
}
