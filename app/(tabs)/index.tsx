import { Clock, Flame, Plus, TrendingUp } from "@tamagui/lucide-icons";
import {
  Button,
  Card,
  H2,
  Progress,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

export default function HomeScreen() {
  return (
    <ScrollView backgroundColor="#F5F5F5" flex={1}>
      <YStack padding="$4" paddingTop="$6" gap="$4" paddingBottom="$8">
        <YStack gap="$2" marginBottom="$2">
          <H2 fontSize="$9" fontWeight="700" color="$gray12">
            Welcome back!
          </H2>
          <Text color="$gray11" fontSize="$4" fontWeight="400">
            Continue your learning journey
          </Text>
        </YStack>

        <XStack gap="$3" justifyContent="space-between">
          <Card
            flex={1}
            padding="$3.5"
            backgroundColor="white"
            borderRadius="$4"
            borderWidth={0}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={8}
          >
            <YStack gap="$2.5" alignItems="flex-start">
              <View
                backgroundColor="#E8F5E9"
                padding="$2.5"
                borderRadius="$3"
                width={44}
                height={44}
                alignItems="center"
                justifyContent="center"
              >
                <TrendingUp size={20} color="#4CAF50" />
              </View>
              <Text fontSize="$9" fontWeight="700" color="$gray12">
                0
              </Text>
              <Text color="$gray10" fontSize="$2" fontWeight="500">
                Completed
              </Text>
            </YStack>
          </Card>

          <Card
            flex={1}
            padding="$3.5"
            backgroundColor="white"
            borderRadius="$4"
            borderWidth={0}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={8}
          >
            <YStack gap="$2.5" alignItems="flex-start">
              <View
                backgroundColor="#F3E5F5"
                padding="$2.5"
                borderRadius="$3"
                width={44}
                height={44}
                alignItems="center"
                justifyContent="center"
              >
                <Clock size={20} color="#9C27B0" />
              </View>
              <Text fontSize="$9" fontWeight="700" color="$gray12">
                2
              </Text>
              <Text
                color="$gray10"
                fontSize="$2"
                fontWeight="500"
                numberOfLines={2}
              >
                Courses in{"\n"}Progress
              </Text>
            </YStack>
          </Card>

          <Card
            flex={1}
            padding="$3.5"
            backgroundColor="white"
            borderRadius="$4"
            borderWidth={0}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={8}
          >
            <YStack gap="$2.5" alignItems="flex-start">
              <View
                backgroundColor="#FFF3E0"
                padding="$2.5"
                borderRadius="$3"
                width={44}
                height={44}
                alignItems="center"
                justifyContent="center"
              >
                <Flame size={20} color="#FF9800" />
              </View>
              <Text fontSize="$9" fontWeight="700" color="$gray12">
                7
              </Text>
              <Text color="$gray10" fontSize="$2" fontWeight="500">
                Day Streak
              </Text>
            </YStack>
          </Card>
        </XStack>

        <Card
          padding="$5"
          backgroundColor="$blue9"
          borderRadius="$5"
          borderWidth={0}
          marginTop="$2"
        >
          <YStack gap="$3.5">
            <Text color="white" fontSize="$7" fontWeight="600">
              Create with AI
            </Text>
            <Text color="white" fontSize="$4" opacity={0.95}>
              Attach materials to create a new course
            </Text>
            <Button
              backgroundColor="white"
              color="$blue9"
              borderRadius="$4"
              fontWeight="600"
              fontSize="$4"
              height={48}
              icon={<Plus size={20} />}
            >
              Create Course
            </Button>
          </YStack>
        </Card>

        <YStack gap="$3.5" marginTop="$3">
          <H2 fontSize="$7" fontWeight="700" color="$gray12">
            My Courses
          </H2>

          <Card
            padding="$4"
            backgroundColor="white"
            borderRadius="$4"
            borderWidth={0}
          >
            <YStack gap="$3">
              <Text fontSize="$6" fontWeight="600" color="$gray12">
                Introduction to React
              </Text>
              <Text color="$gray11" fontSize="$3">
                Learn the basics of React and component-based development
              </Text>
              <XStack gap="$2" alignItems="center" marginTop="$1">
                <Text color="$gray10" fontSize="$2" fontWeight="500">
                  8 lessons
                </Text>
                <Text color="$gray9" fontSize="$2">
                  •
                </Text>
                <Text color="$gray10" fontSize="$2" fontWeight="500">
                  65% complete
                </Text>
              </XStack>
              <Progress
                value={65}
                backgroundColor="$gray4"
                height={6}
                borderRadius="$2"
              >
                <Progress.Indicator
                  animation="bouncy"
                  backgroundColor="$blue9"
                />
              </Progress>
            </YStack>
          </Card>

          <Card
            padding="$4"
            backgroundColor="white"
            borderRadius="$4"
            borderWidth={0}
          >
            <YStack gap="$3">
              <Text fontSize="$6" fontWeight="600" color="$gray12">
                Advanced TypeScript
              </Text>
              <Text color="$gray11" fontSize="$3">
                Master TypeScript type system and advanced patterns
              </Text>
            </YStack>
          </Card>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
