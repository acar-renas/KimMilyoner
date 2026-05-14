import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert, Pressable,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  FadeIn,
  FadeInDown,
  ZoomIn,
  Easing,
} from 'react-native-reanimated';

const API_URL = 'http://10.0.2.2:3000/scores';

const C = {
  gold:      '#F5C842',
  goldDim:   'rgba(245,200,66,0.3)',
  goldFaint: 'rgba(245,200,66,0.09)',
  surface:   'rgba(16,16,26,0.96)',
  border:    'rgba(245,200,66,0.2)',
  text:      '#F0F0F8',
  muted:     'rgba(200,200,220,0.5)',
  success:   '#22D47C',
  bg:        '#07070E',
};

// ─── Para Animasyonu ──────────────────────────────────────────────────────────
const AnimatedPrize = ({ amount }: { amount: number }) => {
  const scale = useSharedValue(0.6);
  const glow  = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(300, withSpring(1, { damping: 12, stiffness: 180 }));
    glow.value  = withDelay(500, withRepeat(
      withSequence(
        withTiming(1,   { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, false,
    ));
  }, []);

  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const glowStyle  = useAnimatedStyle(() => ({ opacity: glow.value }));

  const isWin = amount > 0;

  return (
    <View style={styles.prizeWrap}>
      <Animated.View style={[styles.prizeGlow, glowStyle, isWin && styles.prizeGlowWin]} />
      <Animated.View style={scaleStyle}>
        <Text style={styles.prizeEmoji}>{isWin ? '🏆' : '💫'}</Text>
        <Text style={[styles.prizeAmount, isWin && styles.prizeAmountWin]}>
          {amount.toLocaleString('tr-TR')} ₺
        </Text>
        <Text style={styles.prizeCaption}>{isWin ? 'Tebrikler!' : 'Bu sefer olmadı'}</Text>
      </Animated.View>
    </View>
  );
};

// ─── Animasyonlu Kaydet Butonu ────────────────────────────────────────────────
const SaveBtn = ({ onPress, loading }: { onPress: () => void; loading: boolean }) => {
  const opacity = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Pressable
      onPressIn={() => { opacity.value = withTiming(0.7, { duration: 80 }); }}
      onPressOut={() => { opacity.value = withTiming(1, { duration: 150 }); }}
      onPress={onPress}
      disabled={loading}
    >
      <Animated.View style={[styles.saveBtn, animStyle]}>
        {loading
          ? <ActivityIndicator color={C.bg} />
          : <Text style={styles.saveBtnText}>KAYDET</Text>
        }
      </Animated.View>
    </Pressable>
  );
};

// ─── Ana Ekran ───────────────────────────────────────────────────────────────
export default function ScoreScreen() {
  const { prize }      = useLocalSearchParams();
  const prizeAmount    = parseInt(prize as string) || 0;
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const saveScore = async () => {
    if (!name.trim()) { Alert.alert('Hata', 'Lütfen adınızı girin!'); return; }
    setLoading(true);
    try {
      await axios.post(API_URL, { playerName: name.trim(), prizeWon: prizeAmount });
      Alert.alert('Kaydedildi!', 'Skorun tabloya eklendi.', [
        { text: 'Liderlik Tablosu', onPress: () => router.push('/leaderboard') },
      ]);
    } catch {
      Alert.alert('Hata', 'Skor kaydedilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* ─── Kart ─────────────────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(100).springify().damping(20)} style={styles.card}>
        {/* Altın üst kenar */}
        <View style={styles.cardTopLine} />

        {/* Başlık */}
        <Animated.Text entering={FadeIn.delay(200).duration(500)} style={styles.cardTitle}>
          OYUN BİTTİ
        </Animated.Text>

        {/* Ödül */}
        <AnimatedPrize amount={prizeAmount} />

        {/* İsim Girişi */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.inputSection}>
          <Text style={styles.inputLabel}>OYUNCU ADINIZ</Text>
          <TextInput
            style={styles.input}
            placeholder="Adınızı girin..."
            placeholderTextColor="rgba(200,200,220,0.25)"
            value={name}
            onChangeText={setName}
            maxLength={20}
            autoCapitalize="words"
          />
        </Animated.View>

        {/* Kaydet Butonu */}
        <Animated.View entering={FadeInDown.delay(650).duration(400)} style={styles.btnGroup}>
          <SaveBtn onPress={saveScore} loading={loading} />

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => router.replace('/')}
            activeOpacity={0.6}
          >
            <Text style={styles.skipText}>Kaydetmeden Ana Menüye Dön</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'transparent',
  },

  // Kart
  card: {
    width: '100%',
    backgroundColor: C.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
    padding: 28,
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardTopLine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: C.gold,
    opacity: 0.8,
  },
  cardTitle: {
    color: C.muted,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 5,
    marginTop: 12,
    marginBottom: 8,
  },

  // Ödül
  prizeWrap:     { alignItems: 'center', marginVertical: 28, position: 'relative' },
  prizeGlow:     { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(200,200,220,0.04)' },
  prizeGlowWin:  { backgroundColor: 'rgba(245,200,66,0.07)' },
  prizeEmoji:    { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  prizeAmount:   { color: C.text, fontSize: 44, fontWeight: '900', textAlign: 'center' },
  prizeAmountWin:{ color: C.gold },
  prizeCaption:  { color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 8, letterSpacing: 1 },

  // Input
  inputSection: { width: '100%', marginBottom: 24 },
  inputLabel:   { color: C.muted, fontSize: 11, fontWeight: '700', letterSpacing: 3, marginBottom: 10 },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: 'rgba(10,10,18,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.25)',
    borderRadius: 14,
    paddingHorizontal: 16,
    color: C.text,
    fontSize: 17,
  },

  // Butonlar
  btnGroup: { width: '100%', gap: 16, alignItems: 'center' },
  saveBtn:  {
    width: '100%',
    height: 56,
    backgroundColor: C.gold,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: { color: '#07070E', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  skipBtn:     { paddingVertical: 8 },
  skipText:    { color: 'rgba(200,200,220,0.35)', fontSize: 13, textDecorationLine: 'underline' },
});
