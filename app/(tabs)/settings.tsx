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
  User,
} from "@tamagui/lucide-icons";
import { useState } from "react";
import { YStack } from "tamagui";

export default function SettingsScreen() {
  const colors = useThemeColors();
  const [languageModalOpen, setLanguageModalOpen] = useState(false);

  return (
    <ScreenContainer>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <YStack gap="$4">
        <UserProfileCard
          name="John Doe"
          email="john.doe@example.com"
          onPress={() => console.log("Open profile")}
        />

        <SectionHeader title="Account Settings" />
        <SettingsCard>
          <SettingsItem
            icon={<User size={20} color={colors.textSecondary} />}
            title="Personal Information"
            description="Update your name, email, and pr..."
            rightElement={
              <ChevronRight size={20} color={colors.textTertiary} />
            }
            onPress={() => console.log("Personal info")}
            showDivider
          />
          <SettingsItem
            icon={<Bell size={20} color={colors.textSecondary} />}
            title="Notifications"
            description="Manage notification preferences"
            rightElement={
              <ChevronRight size={20} color={colors.textTertiary} />
            }
            onPress={() => console.log("Notifications")}
            showDivider
          />
          <SettingsItem
            icon={<Lock size={20} color={colors.textSecondary} />}
            title="Privacy & Security"
            description="Password, two-factor authenticat..."
            rightElement={
              <ChevronRight size={20} color={colors.textTertiary} />
            }
            onPress={() => console.log("Privacy")}
            showDivider
          />
          <SettingsItem
            icon={<CreditCard size={20} color={colors.textSecondary} />}
            title="Billing"
            description="Manage subscription and payme..."
            rightElement={
              <ChevronRight size={20} color={colors.textTertiary} />
            }
            onPress={() => console.log("Billing")}
          />
        </SettingsCard>

        <SectionHeader title="AI Settings" />
        <SettingsCard>
          <SettingsItem
            icon={<Sparkles size={20} color={colors.textSecondary} />}
            title="AI Model Preference"
            description="Choose your preferred AI model"
            rightElement={
              <ChevronRight size={20} color={colors.textTertiary} />
            }
            onPress={() => console.log("AI model")}
            showDivider
          />
          <SettingsItem
            icon={<Languages size={20} color={colors.textSecondary} />}
            title="Content Language"
            description="Set default language for content"
            rightElement={
              <ChevronRight size={20} color={colors.textTertiary} />
            }
            onPress={() => console.log("Content language")}
          />
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
          <SettingsItem
            icon={<HelpCircle size={20} color={colors.textSecondary} />}
            title="Help Center"
            description="FAQs and tutorials"
            rightElement={
              <ChevronRight size={20} color={colors.textTertiary} />
            }
            onPress={() => console.log("Help center")}
            showDivider
          />
          <SettingsItem
            icon={<MessageCircle size={20} color={colors.textSecondary} />}
            title="Contact Support"
            description="Get help from our team"
            rightElement={
              <ChevronRight size={20} color={colors.textTertiary} />
            }
            onPress={() => console.log("Contact support")}
          />
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
