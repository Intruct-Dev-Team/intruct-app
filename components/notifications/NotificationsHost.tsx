import { Portal } from "@tamagui/portal";
import { useEffect } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  FadeOutUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack } from "tamagui";

import { useNotifications } from "@/contexts/NotificationsContext";

import { NotificationToast } from "./NotificationToast";

export function NotificationsHost() {
  const { active, dismiss } = useNotifications();
  const activeId = active?.id;
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!activeId) return;
    translateY.value = 0;
    opacity.value = 1;
  }, [activeId, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  }, [opacity, translateY]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.min(0, event.translationY);
    })
    .onEnd((event) => {
      if (!activeId) return;

      const shouldDismiss = event.translationY < -40 || event.velocityY < -900;

      if (shouldDismiss) {
        translateY.value = withTiming(-80, { duration: 140 });
        opacity.value = withTiming(0, { duration: 140 }, (finished) => {
          if (finished) {
            runOnJS(dismiss)(activeId);
          }
        });
        return;
      }

      translateY.value = withSpring(0);
    });

  if (!active) return null;

  return (
    <Portal>
      <YStack
        position="absolute"
        top={Math.max(8, insets.top + 8)}
        left={0}
        right={0}
        zIndex={1000}
        pointerEvents="box-none"
        paddingHorizontal="$4"
        alignItems="stretch"
      >
        <Animated.View
          entering={FadeInDown.duration(180)}
          exiting={FadeOutUp.duration(140)}
          style={{ width: "100%" }}
        >
          <GestureDetector gesture={panGesture}>
            <View collapsable={false}>
              <Animated.View style={animatedStyle}>
                <NotificationToast
                  type={active.input.type}
                  title={active.input.title}
                  message={active.input.message}
                  action={active.input.action}
                  dismissible={active.input.dismissible}
                  onDismiss={() => dismiss(active.id)}
                />
              </Animated.View>
            </View>
          </GestureDetector>
        </Animated.View>
      </YStack>
    </Portal>
  );
}
