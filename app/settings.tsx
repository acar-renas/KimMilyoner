import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';

const C = {
  gold:      '#F5C842',
  goldDim:   'rgba(245,200,66,0.28)',
  goldFaint: 'rgba(245,200,66,0.08)',
  surface:   'rgba(16,16,26,0.92)',
  border:    'rgba(245,200,66,0.18)',
  text:      '#F0F0F8',
  muted:     'rgba(200,200,220,0.5)',
  mutedLow:  'rgba(200,200,220,0.25)',
};

// ─── Toggle Seçenek ───────────────────────────────────────────────────────────
const ToggleOption = ({
  label, active, onPress,
}: { label: string; active: boolean; onPress: () => void }) => {
  const scale    = useSharedValue(1);
  const bgOpacity = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    bgOpacity.value = withTiming(active ? 1 : 0, { duration: 200 });
  }, [active]);

  const handleIn  = () => { scale.value = withSpring(0.92, { damping: 16, stiffness: 380 }); };
  const handleOut = () => { scale.value = withSpring(1,    { damping: 14, stiffness: 300 }); };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const activeBgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  return (
    <Pressable onPressIn={handleIn} onPressOut={handleOut} onPress={onPress} style={{ flex: 1, marginHorizontal: 4 }}>
      <Animated.View style={[styles.toggleBtn, active && styles.toggleBtnActive, containerStyle]}>
        {/* Aktif arka plan katmanı */}
        <Animated.View style={[styles.toggleActiveBg, activeBgStyle]} />
        <Text style={[styles.toggleLabel, active && styles.toggleLabelActive]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

// ─── Bölüm Başlığı ───────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: string }) => (
  <View style={styles.sectionRow}>
    <View style={styles.sectionDot} />
    <Text style={styles.sectionTitle}>{children}</Text>
  </View>
);

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const [difficulty, setDifficulty] = useState('Orta');
  const [volume, setVolume]         = useState('Yüksek');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const d = await AsyncStorage.getItem('difficulty');
      const v = await AsyncStorage.getItem('volume');
      if (d) setDifficulty(d);
      if (v) setVolume(v);
    } catch {}
  };

  const save = async () => {
    try {
      await AsyncStorage.setItem('difficulty', difficulty);
      await AsyncStorage.setItem('volume', volume);
      router.back();
    } catch {}
  };

  return (
    <View style={styles.container}>

      {/* Başlık */}
      <Animated.View entering={FadeIn.delay(100).duration(500)} style={styles.header}>
        <View style={styles.headerLine} />
        <Text style={styles.title}>AYARLAR</Text>
        <View style={styles.headerLine} />
      </Animated.View>

      {/* Zorluk Kartı */}
      <Animated.View entering={FadeInDown.delay(200).springify().damping(20)} style={styles.card}>
        <View style={styles.cardTopBar} />

        <SectionTitle>ZORLUK SEVİYESİ</SectionTitle>
        <View style={styles.toggleRow}>
          {['Kolay', 'Orta', 'Zor'].map(d => (
            <ToggleOption
              key={d}
              label={d}
              active={difficulty === d}
              onPress={() => setDifficulty(d)}
            />
          ))}
        </View>

        {/* Ayırıcı */}
        <View style={styles.divider} />

        <SectionTitle>SES SEVİYESİ</SectionTitle>
        <View style={styles.toggleRow}>
          {['Kapalı', 'Düşük', 'Yüksek'].map(v => (
            <ToggleOption
              key={v}
              label={v}
              active={volume === v}
              onPress={() => setVolume(v)}
            />
          ))}
        </View>
      </Animated.View>

      {/* Kaydet Butonu */}
      <Animated.View entering={FadeInDown.delay(380).springify().damping(20)} style={styles.saveBtnWrap}>
        <SaveButton onPress={save} />
      </Animated.View>
    </View>
  );
}

// ─── Kaydet Butonu (ayrı component) ──────────────────────────────────────────
const SaveButton = ({ onPress }: { onPress: () => void }) => {
  const opacity = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Pressable
      onPressIn={() => { opacity.value = withTiming(0.7, { duration: 80 }); }}
      onPressOut={() => { opacity.value = withTiming(1, { duration: 150 }); }}
      onPress={onPress}
    >
      <Animated.View style={[styles.saveBtn, animStyle]}>
        <Text style={styles.saveBtnText}>KAYDET VE ÇIK</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 48,
  },

  // Başlık
  header:     { alignItems: 'center', marginBottom: 36 },
  headerLine: { width: 32, height: 2, backgroundColor: C.gold, borderRadius: 1, marginVertical: 10 },
  title:      { color: C.text, fontSize: 30, fontWeight: '900', letterSpacing: 4 },

  // Kart
  card:       { backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 24, overflow: 'hidden' },
  cardTopBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: C.gold, opacity: 0.6 },

  // Bölüm başlığı
  sectionRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 4 },
  sectionDot:   { width: 4, height: 4, borderRadius: 2, backgroundColor: C.gold, marginRight: 10 },
  sectionTitle: { color: C.muted, fontSize: 11, fontWeight: '800', letterSpacing: 3 },

  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 24 },

  // Toggle
  toggleRow: { flexDirection: 'row', marginBottom: 4 },
  toggleBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(10,10,18,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  toggleBtnActive:  { borderColor: C.goldDim },
  toggleActiveBg:   { ...StyleSheet.absoluteFillObject, backgroundColor: C.goldFaint },
  toggleLabel:      { color: C.mutedLow, fontSize: 14, fontWeight: '700' },
  toggleLabelActive:{ color: C.gold },

  // Kaydet
  saveBtnWrap: { marginTop: 'auto', paddingTop: 32 },
  saveBtn: {
    height: 58,
    borderRadius: 18,
    backgroundColor: C.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: { color: '#07070E', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
});
