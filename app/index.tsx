import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  FadeInDown,
  FadeIn,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// ─── Renkler ──────────────────────────────────────────────────────────────────
const C = {
  gold:        '#F5C842',
  goldDim:     'rgba(245,200,66,0.35)',
  goldFaint:   'rgba(245,200,66,0.12)',
  surface:     'rgba(18,18,28,0.88)',
  border:      'rgba(245,200,66,0.2)',
  borderHigh:  'rgba(245,200,66,0.65)',
  text:        '#F0F0F8',
  textMuted:   'rgba(200,200,220,0.5)',
};

// ─── Animasyonlu Buton (Reanimated) ──────────────────────────────────────────
type ButtonProps = {
  title: string;
  subtitle?: string;
  onPress: () => void;
  primary?: boolean;
  delay?: number;
};

const AnimButton = ({ title, subtitle, onPress, primary = false, delay = 0 }: ButtonProps) => {
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    opacity.value = withTiming(0.72, { duration: 80 });
  };
  const handlePressOut = () => {
    opacity.value = withTiming(1, { duration: 160 });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(350)}
      style={[styles.btnWrapper, animStyle]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.pressable}
      >
        {/* Sol aksan çizgisi */}
        <View style={[styles.accentBar, primary && styles.accentBarPrimary]} />

        {/* İçerik */}
        <View style={styles.btnContent}>
          <Text style={[styles.btnTitle, primary && styles.btnTitlePrimary]}>{title}</Text>
          {subtitle ? <Text style={styles.btnSubtitle}>{subtitle}</Text> : null}
        </View>

        {/* Sağ ok */}
        <Text style={[styles.btnArrow, primary && styles.btnArrowPrimary]}>›</Text>
      </Pressable>
    </Animated.View>
  );
};

// ─── Logo Parlaması (Reanimated) ─────────────────────────────────────────────
const LogoGlow = () => {
  const shimmer = useSharedValue(0.4);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1,   { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.4, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  return <Animated.View style={[styles.logoGlow, style]} />;
};

// ─── Yüzen Logo Kapsayıcı ────────────────────────────────────────────────────
const FloatingLogo = () => {
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming( 0, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.delay(100).duration(700)}
      style={[styles.logoContainer, floatStyle]}
    >
      <LogoGlow />
      <Text style={styles.logoEyebrow}>KİM MİLYONER</Text>
      <View style={styles.logoDivider} />
      <Text style={styles.logoMain}>OLMAK{'\n'}İSTER?</Text>
      <View style={styles.logoDividerBottom} />
      <Text style={styles.logoTagline}>Bilgin kadar kazan</Text>
    </Animated.View>
  );
};

// ─── Ana Menü ────────────────────────────────────────────────────────────────
export const AnimatedBackground = () => null; // fallback export

export default function MainMenu() {
  const overlayOpacity = useSharedValue(0);

  useFocusEffect(useCallback(() => {
    overlayOpacity.value = 0;
  }, []));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const handleStart = () => {
    overlayOpacity.value = withTiming(1, { duration: 450 }, (done) => {
      if (done) runOnJS(router.push)('/game');
    });
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <FloatingLogo />

      {/* Butonlar */}
      <View style={styles.buttonArea}>
        <AnimButton
          title="YENİ OYUN"
          subtitle="Oyunu başlat"
          onPress={handleStart}
          primary
          delay={200}
        />
        <AnimButton
          title="LİDERLİK"
          subtitle="Skor tablosu"
          onPress={() => router.push('/leaderboard')}
          delay={320}
        />
        <AnimButton
          title="AYARLAR"
          subtitle="Zorluk ve ses"
          onPress={() => router.push('/settings')}
          delay={440}
        />
      </View>

      {/* Geçiş karartması */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { backgroundColor: '#07070E' }, overlayStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    paddingBottom: 48,
  },

  // ── Logo ──────────────────────────────────────────────────────────────────
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  logoGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(245,200,66,0.08)',
    alignSelf: 'center',
  },
  logoEyebrow: {
    color: C.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 6,
    marginBottom: 16,
  },
  logoDivider: {
    width: 48,
    height: 2,
    backgroundColor: C.gold,
    marginBottom: 20,
    borderRadius: 2,
  },
  logoMain: {
    color: C.text,
    fontSize: 52,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 58,
    letterSpacing: 1,
  },
  logoDividerBottom: {
    width: 64,
    height: 2,
    backgroundColor: C.goldDim,
    marginTop: 20,
    marginBottom: 14,
    borderRadius: 2,
  },
  logoTagline: {
    color: C.gold,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 3,
  },

  // ── Butonlar ──────────────────────────────────────────────────────────────
  buttonArea: {
    paddingHorizontal: 24,
    gap: 14,
  },
  btnWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 68,
    paddingRight: 20,
  },
  btnGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(245,200,66,0.05)',
  },
  btnGlowPrimary: {
    backgroundColor: 'rgba(245,200,66,0.1)',
  },
  accentBar: {
    width: 3,
    height: '55%',
    backgroundColor: C.textMuted,
    borderRadius: 2,
    marginHorizontal: 18,
  },
  accentBarPrimary: {
    backgroundColor: C.gold,
    height: '70%',
  },
  btnContent: {
    flex: 1,
  },
  btnTitle: {
    color: C.textMuted,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  btnTitlePrimary: {
    color: C.text,
    fontSize: 17,
  },
  btnSubtitle: {
    color: 'rgba(200,200,220,0.35)',
    fontSize: 12,
    marginTop: 3,
    letterSpacing: 0.5,
  },
  btnArrow: {
    color: C.textMuted,
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 28,
  },
  btnArrowPrimary: {
    color: C.gold,
  },
});
