import { useTheme } from "@/contexts/theme-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import type { TestQuestion } from "@/types";
import React, { useMemo, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Button, H3, Text, XStack, YStack } from "tamagui";

interface TestViewProps {
  questions: TestQuestion[];
  onComplete: (score: number) => void;
  onProgress: (index: number) => void;
}

export default function TestView({
  questions,
  onComplete,
  onProgress,
}: TestViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const colors = useThemeColors();
  const { activeTheme } = useTheme();

  const currentQuestion = questions[currentIndex];

  const baseOptionBackground = useMemo(() => {
    return activeTheme === "dark" ? "$gray2" : "$gray2";
  }, [activeTheme]);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const checkAnswer = () => {
    if (!currentQuestion || selectedOption === null) return;
    setIsAnswered(true);

    // Progress should only advance after the user explicitly checks the answer.
    onProgress(currentIndex + 1);

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((v) => v + 1);
    }
  };

  const handleNext = () => {
    if (!currentQuestion) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((v) => v + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(score);
    }
  };

  const getOptionBackgroundColor = (index: number) => {
    if (!currentQuestion) return baseOptionBackground;
    if (!isAnswered) {
      return selectedOption === index ? "$blue3" : baseOptionBackground;
    }
    if (index === currentQuestion.correctAnswer) return "$green3";
    if (selectedOption === index && index !== currentQuestion.correctAnswer) {
      return "$red3";
    }
    return baseOptionBackground;
  };

  const getOptionBorderColor = (index: number) => {
    if (!currentQuestion) return "$gray4";
    if (!isAnswered) {
      return selectedOption === index ? colors.primary : "$gray4";
    }
    if (index === currentQuestion.correctAnswer) return "$green9";
    if (selectedOption === index) return "$red9";
    return "$gray4";
  };

  if (!currentQuestion) return null;

  return (
    <YStack flex={1} padding="$4">
      <YStack marginBottom="$4">
        <H3 color={colors.textPrimary}>Test Your Knowledge</H3>
        <Text color={colors.textSecondary}>
          Question {currentIndex + 1} of {questions.length}
        </Text>
      </YStack>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <YStack
          backgroundColor={colors.cardBackground}
          padding="$4"
          borderRadius="$6"
          marginBottom="$4"
          borderWidth={1}
          borderColor="$gray4"
          shadowColor="$black"
          shadowOpacity={0.05}
          shadowRadius={4}
        >
          <Text
            fontSize="$5"
            fontWeight="600"
            color={colors.textPrimary}
            marginBottom="$4"
            lineHeight="$6"
          >
            {currentQuestion.question}
          </Text>

          <YStack gap="$3">
            {currentQuestion.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectOption(index)}
                disabled={isAnswered}
              >
                <XStack
                  padding="$3"
                  borderRadius="$4"
                  borderWidth={1}
                  backgroundColor={getOptionBackgroundColor(index)}
                  borderColor={getOptionBorderColor(index)}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text
                    flex={1}
                    color={
                      isAnswered && index === currentQuestion.correctAnswer
                        ? "$green11"
                        : isAnswered && selectedOption === index
                        ? "$red11"
                        : colors.textPrimary
                    }
                    fontSize="$4"
                  >
                    {option}
                  </Text>

                  {isAnswered && index === currentQuestion.correctAnswer && (
                    <Text color="$green11" fontWeight="700">
                      ✓
                    </Text>
                  )}
                  {isAnswered &&
                    selectedOption === index &&
                    index !== currentQuestion.correctAnswer && (
                      <Text color="$red11" fontWeight="700">
                        ✕
                      </Text>
                    )}
                </XStack>
              </TouchableOpacity>
            ))}
          </YStack>

          {isAnswered && (
            <YStack
              marginTop="$4"
              padding="$3"
              borderRadius="$4"
              backgroundColor={
                selectedOption === currentQuestion.correctAnswer
                  ? "$green2"
                  : "$red2"
              }
              borderWidth={1}
              borderColor={
                selectedOption === currentQuestion.correctAnswer
                  ? "$green6"
                  : "$red6"
              }
            >
              <Text
                fontWeight="700"
                color={
                  selectedOption === currentQuestion.correctAnswer
                    ? "$green11"
                    : "$red11"
                }
                marginBottom="$1"
              >
                {selectedOption === currentQuestion.correctAnswer
                  ? "Correct!"
                  : "Incorrect"}
              </Text>
              <Text color={colors.textPrimary}>
                {selectedOption !== currentQuestion.correctAnswer
                  ? "The correct answer is highlighted above."
                  : "Great job!"}
              </Text>
            </YStack>
          )}
        </YStack>
      </ScrollView>

      <YStack marginTop="auto">
        {!isAnswered ? (
          <Button
            backgroundColor={colors.primary}
            color={colors.primaryText}
            onPress={checkAnswer}
            disabled={selectedOption === null}
            opacity={selectedOption === null ? 0.5 : 1}
            size="$4"
            borderRadius="$4"
          >
            Check Answer
          </Button>
        ) : (
          <Button
            backgroundColor={colors.primary}
            color={colors.primaryText}
            onPress={handleNext}
            size="$4"
            borderRadius="$4"
          >
            {currentIndex === questions.length - 1
              ? "Finish Lesson"
              : "Next Question"}
          </Button>
        )}
      </YStack>
    </YStack>
  );
}
