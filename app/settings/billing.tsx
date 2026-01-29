import { useThemeColors } from "@/hooks/use-theme-colors";
import { t } from "@/localization/i18n";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, ScrollView, Text, XStack, YStack } from "tamagui";

type PlanStatus = "available" | "soon";

type Plan = {
  id: "free" | "pro" | "team";
  title: string;
  priceLabel: string;
  status: PlanStatus;
  benefits: string[];
  limitations: string[];
};

export default function BillingScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const plans = useMemo<Plan[]>(
    () => [
      {
        id: "free",
        title: "Free",
        priceLabel: "$0 / month",
        status: "available",
        benefits: [
          "AI course generation from files",
          "Personal library",
          "Learning progress tracking",
          "Catalog browsing",
          "Theme & content language settings",
        ],
        limitations: [
          "5 AI course generations / week",
          "Max 10 created courses",
          "Max 10 MB per file",
          "Standard generation queue",
        ],
      },
      {
        id: "pro",
        title: "Pro",
        priceLabel: "—",
        status: "soon",
        benefits: [
          "Everything in Free",
          "Priority generation queue",
          "Higher file limits",
          "Higher generation limits",
        ],
        limitations: [
          "Coming soon",
          "25 AI course generations / week",
          "Max 50 created courses",
          "Max 50 MB per file",
        ],
      },
      {
        id: "team",
        title: "Team",
        priceLabel: "—",
        status: "soon",
        benefits: [
          "Everything in Pro",
          "Shared team library",
          "Member management",
        ],
        limitations: [
          "Coming soon",
          "50 AI course generations / week",
          "Max 200 created courses",
          "Max 100 MB per file",
          "Up to 5 members",
        ],
      },
    ],
    [],
  );

  const currentPlanId: Plan["id"] = "free";
  const [selectedPlanId, setSelectedPlanId] =
    useState<Plan["id"]>(currentPlanId);

  const selectedPlan = useMemo(() => {
    return plans.find((p) => p.id === selectedPlanId) ?? plans[0];
  }, [plans, selectedPlanId]);

  const isAlreadySelected = selectedPlanId === currentPlanId;
  const isSelectedPlanDisabled = selectedPlan.status === "soon";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <YStack flex={1} backgroundColor={colors.background}>
        <YStack flex={1} padding="$4" paddingTop="$6" gap="$4">
          <XStack alignItems="center" gap="$2">
            <Button
              icon={<ChevronLeft size={24} color={colors.textPrimary} />}
              chromeless
              onPress={() => router.back()}
            />
            <Text fontSize="$7" fontWeight="800" color={colors.textPrimary}>
              {t("Billing")}
            </Text>
          </XStack>

          <YStack gap="$3">
            <Text color={colors.textSecondary} fontSize="$5">
              {t("Choose a plan")}
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$3" paddingVertical="$3" paddingHorizontal="$1">
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const isDisabled = plan.status === "soon";

                  return (
                    <Card
                      key={plan.id}
                      width={280}
                      padding="$4"
                      backgroundColor={colors.cardBackground}
                      borderRadius="$6"
                      borderWidth={isSelected ? 2 : 1}
                      borderColor={isSelected ? colors.primary : "$gray5"}
                      opacity={isDisabled ? 0.5 : 1}
                      pressStyle={
                        isDisabled
                          ? undefined
                          : {
                              scale: 0.98,
                              opacity: 0.95,
                            }
                      }
                      onPress={() => {
                        if (isDisabled) return;
                        setSelectedPlanId(plan.id);
                      }}
                    >
                      <YStack gap="$3">
                        <XStack
                          alignItems="center"
                          justifyContent="space-between"
                          gap="$2"
                        >
                          <Text
                            fontSize="$6"
                            fontWeight="800"
                            color={colors.textPrimary}
                          >
                            {t(plan.title)}
                          </Text>

                          {isDisabled || isSelected ? (
                            <XStack
                              paddingHorizontal="$2"
                              paddingVertical="$1"
                              borderRadius="$10"
                              backgroundColor={
                                isSelected ? colors.primary : "$gray4"
                              }
                            >
                              <Text
                                fontSize="$3"
                                fontWeight="700"
                                color={
                                  isSelected
                                    ? colors.primaryText
                                    : colors.textPrimary
                                }
                              >
                                {isDisabled ? t("Soon") : t("Selected")}
                              </Text>
                            </XStack>
                          ) : null}
                        </XStack>

                        <Text
                          color={colors.textSecondary}
                          fontSize="$5"
                          fontWeight="600"
                        >
                          {t(plan.priceLabel)}
                        </Text>

                        <YStack gap="$2">
                          <Text
                            fontSize="$3"
                            fontWeight="700"
                            color={colors.textPrimary}
                          >
                            {t("Includes")}
                          </Text>
                          <YStack gap="$1">
                            {plan.benefits.map((item, idx) => (
                              <Text
                                key={`${plan.id}-benefit-${idx}`}
                                fontSize="$4"
                                color={colors.textSecondary}
                              >
                                <Text
                                  fontSize="$4"
                                  fontWeight="800"
                                  color="$green10"
                                >
                                  {"+ "}
                                </Text>
                                {t(item)}
                              </Text>
                            ))}
                          </YStack>
                        </YStack>

                        <YStack
                          marginTop="$3"
                          borderTopWidth={1}
                          borderTopColor="$gray5"
                        />

                        <YStack gap="$2" marginTop="$3">
                          <Text
                            fontSize="$3"
                            fontWeight="700"
                            color={colors.textPrimary}
                          >
                            {t("Limits")}
                          </Text>
                          <YStack gap="$1">
                            {plan.limitations.map((item, idx) => (
                              <Text
                                key={`${plan.id}-limit-${idx}`}
                                fontSize="$4"
                                color={colors.textSecondary}
                              >
                                <Text
                                  fontSize="$4"
                                  fontWeight="800"
                                  color="$red10"
                                >
                                  {"- "}
                                </Text>
                                {t(item)}
                              </Text>
                            ))}
                          </YStack>
                        </YStack>
                      </YStack>
                    </Card>
                  );
                })}
              </XStack>
            </ScrollView>
          </YStack>
        </YStack>

        <XStack
          padding="$4"
          paddingBottom={insets.bottom + 16}
          backgroundColor={colors.cardBackground}
          borderTopWidth={1}
          borderTopColor="$gray5"
        >
          <Button
            flex={1}
            size="$5"
            backgroundColor={isAlreadySelected ? "$gray4" : colors.primary}
            color={isAlreadySelected ? colors.textPrimary : colors.primaryText}
            disabled={isAlreadySelected || isSelectedPlanDisabled}
            onPress={() => {
              // no-op
            }}
          >
            {isAlreadySelected
              ? t("Already Selected")
              : t("Change to {{plan}}", {
                  plan: t(selectedPlan.title),
                })}
          </Button>
        </XStack>
      </YStack>
    </>
  );
}
