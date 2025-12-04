import { LanguageModal } from "@/components/language-modal";
import { PageHeader } from "@/components/page-header";
import { ScreenContainer } from "@/components/screen-container";
import { SectionHeader } from "@/components/section-header";
import { SettingsCard } from "@/components/settings-card";
import { SettingsFooter } from "@/components/settings-footer";
import { SettingsItem } from "@/components/settings-item";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserProfileCard } from "@/components/user-profile-card";
import { useThemeColors } from "@/hooks/use-theme-colors";
import {
  accountSettingsItems,
  aiSettingsItems,
  supportItems,
} from "@/mockdata/settings";
import { userApi } from "@/services/api";
import type { User } from "@/types";
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
import { useEffect, useState } from "react";
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
  const colors = useThemeColors();
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await userApi.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  return (
    <ScreenContainer>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <YStack gap="$4">
        {user && (
          <UserProfileCard
            name={user.name}
            email={user.email}
            onPress={() => console.log("Open profile")}
          />
        )}

        <SectionHeader title="Account Settings" />
        <SettingsCard>
          {accountSettingsItems.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <SettingsItem
                key={item.id}
                icon={Icon && <Icon size={20} color={colors.textSecondary} />}
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
                icon={Icon && <Icon size={20} color={colors.textSecondary} />}
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
            description="English (US)"
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
                icon={Icon && <Icon size={20} color={colors.textSecondary} />}
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
      />
    </ScreenContainer>
  );
}
