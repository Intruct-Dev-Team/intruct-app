import { useTheme } from "@/contexts/theme-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import type { Flashcard } from "@/types";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button, H3, Text, XStack, YStack, useStyle } from "tamagui";

interface FlashcardViewProps {
  cards: Flashcard[];
  onComplete: () => void;
  onProgress: (index: number) => void;
}

export default function FlashcardView({
  cards,
  onComplete,
  onProgress,
}: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const rotateY = useSharedValue(0);
  const colors = useThemeColors();
  const { activeTheme } = useTheme();

  const currentCard = cards[currentIndex];

  const resolvedCard = useStyle(
    {
      backgroundColor:
        activeTheme === "dark" ? "$gray4" : colors.cardBackground,
    },
    { resolveValues: "auto" }
  );
  const cardBackgroundColor =
    typeof resolvedCard.backgroundColor === "string"
      ? resolvedCard.backgroundColor
      : "";

  const resolvedShadow = useStyle(
    { shadowColor: "$black" },
    { resolveValues: "auto" }
  );
  const shadowColor =
    typeof resolvedShadow.shadowColor === "string"
      ? resolvedShadow.shadowColor
      : undefined;

  useEffect(() => {
    onProgress(currentIndex);
  }, [currentIndex, onProgress]);

  const handleFlip = () => {
    rotateY.value = withTiming(isFlipped ? 0 : 180, { duration: 300 });
    setIsFlipped((v) => !v);
  };

  const resetFlip = () => {
    rotateY.value = withTiming(0, { duration: 0 });
    setIsFlipped(false);
  };

  const handleNext = () => {
    resetFlip();
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((v) => v + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex === 0) return;
    resetFlip();
    setCurrentIndex((v) => v - 1);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotateY.value, [0, 180], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateValue}deg` }],
      opacity: rotateY.value < 90 ? 1 : 0,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotateY.value, [0, 180], [180, 360]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateValue}deg` }],
      opacity: rotateY.value >= 90 ? 1 : 0,
    };
  });

  if (!currentCard) return null;

  return (
    <YStack flex={1} padding="$4">
      <YStack marginBottom="$4">
        <H3 color={colors.textPrimary}>Review Flashcards</H3>
        <Text color={colors.textSecondary}>
          Tap the card to flip and review key concepts
        </Text>
      </YStack>

      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        marginVertical="$4"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleFlip}
          style={[styles.cardWrapper, { shadowColor }]}
        >
          <Animated.View
            style={[
              styles.card,
              { backgroundColor: cardBackgroundColor },
              frontAnimatedStyle,
            ]}
          >
            <Text
              fontSize="$6"
              textAlign="center"
              lineHeight="$6"
              color={colors.textPrimary}
            >
              {currentCard.front}
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              { backgroundColor: cardBackgroundColor },
              backAnimatedStyle,
            ]}
          >
            <Text
              fontSize="$6"
              textAlign="center"
              lineHeight="$6"
              color={colors.textPrimary}
            >
              {currentCard.back}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </YStack>

      <YStack marginTop="auto">
        <Text textAlign="center" marginBottom="$4" color={colors.textTertiary}>
          Card {currentIndex + 1} of {cards.length}
        </Text>
        <XStack gap="$3">
          <Button
            flex={1}
            bordered
            borderColor="$gray5"
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            opacity={currentIndex === 0 ? 0.5 : 1}
            color={colors.textPrimary}
          >
            Previous
          </Button>
          <Button
            flex={1}
            backgroundColor={colors.primary}
            color={colors.primaryText}
            onPress={handleNext}
          >
            {currentIndex === cards.length - 1 ? "Finish" : "Next Card"}
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: "100%",
    height: 300,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 16,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
});
