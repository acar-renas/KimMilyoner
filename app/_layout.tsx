import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing as REasing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// ─── Obsidian Gold Minimal Arka Plan ─────────────────────────────────────────
// Koyu lacivert-siyah taban + 2 yumuşak altın/amber ışık halesi
function PersistentBackground() {
  const pulse1 = useSharedValue(0.18);
  const pulse2 = useSharedValue(0.12);
  const move1  = useSharedValue(0);
  const move2  = useSharedValue(0);

  useEffect(() => {
    // Hale 1 — yavaş nefes + hafif sağa sola hareket
    pulse1.value = withRepeat(
      withSequence(
        withTiming(0.3,  { duration: 6000, easing: REasing.inOut(REasing.sin) }),
        withTiming(0.14, { duration: 6000, easing: REasing.inOut(REasing.sin) }),
      ),
      -1,
      false,
    );
    move1.value = withRepeat(
      withSequence(
        withTiming(60,  { duration: 12000, easing: REasing.inOut(REasing.sin) }),
        withTiming(-60, { duration: 12000, easing: REasing.inOut(REasing.sin) }),
      ),
      -1,
      false,
    );

    // Hale 2 — farklı hızda
    pulse2.value = withRepeat(
      withSequence(
        withTiming(0.22, { duration: 8000, easing: REasing.inOut(REasing.sin) }),
        withTiming(0.08, { duration: 8000, easing: REasing.inOut(REasing.sin) }),
      ),
      -1,
      false,
    );
    move2.value = withRepeat(
      withSequence(
        withTiming(-80, { duration: 15000, easing: REasing.inOut(REasing.sin) }),
        withTiming(80,  { duration: 15000, easing: REasing.inOut(REasing.sin) }),
      ),
      -1,
      false,
    );
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    opacity: pulse1.value,
    transform: [{ translateX: move1.value }],
  }));
  const orb2Style = useAnimatedStyle(() => ({
    opacity: pulse2.value,
    transform: [{ translateX: move2.value }],
  }));

  const ORB1 = width * 1.1;
  const ORB2 = width * 0.85;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Derin koyu taban */}
      <View style={styles.baseBg} />

      {/* İnce yatay ışık şeridi — üst */}
      <View style={styles.topGlow} />

      {/* Altın hale — sol üst */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: ORB1,
            height: ORB1,
            borderRadius: ORB1 / 2,
            backgroundColor: '#C8960A',
            top: -ORB1 * 0.55,
            left: -ORB1 * 0.3,
          },
          orb1Style,
        ]}
      />

      {/* Amber hale — sağ alt */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: ORB2,
            height: ORB2,
            borderRadius: ORB2 / 2,
            backgroundColor: '#8B4A00',
            bottom: -ORB2 * 0.5,
            right: -ORB2 * 0.35,
          },
          orb2Style,
        ]}
      />

      {/* Hafif blur katmanı — haleleri yumuşatır */}
      <View style={styles.blurOverlay} />

      {/* Nokta grid overlay — minimal derinlik */}
      <View style={styles.dotGrid} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <PersistentBackground />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
        <Stack.Screen name="score" />
        <Stack.Screen name="leaderboard" />
        <Stack.Screen name="settings" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  baseBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#07070E',
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(245,200,66,0.35)',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,7,14,0.62)',
  },
  dotGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.018,
    // CSS dot grid simülasyonu — ince görsel doku
    backgroundColor: 'transparent',
  },
});
