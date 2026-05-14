import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, FlatList, Pressable,
} from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';

const API_URL = 'http://10.0.2.2:3000/scores';

const C = {
  gold:      '#F5C842',
  goldDim:   'rgba(245,200,66,0.28)',
  goldFaint: 'rgba(245,200,66,0.08)',
  surface:   'rgba(16,16,26,0.92)',
  border:    'rgba(245,200,66,0.18)',
  text:      '#F0F0F8',
  muted:     'rgba(200,200,220,0.5)',
  success:   '#22D47C',
};

// ─── Sıra Rozetleri ───────────────────────────────────────────────────────────
const MEDALS = ['🥇', '🥈', '🥉'];

// ─── Animasyonlu Satır ────────────────────────────────────────────────────────
const LeaderRow = ({ item, index }: { item: any; index: number }) => {
  const isTop = index < 3;
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify().damping(20)}
      style={[styles.row, isTop && index === 0 && styles.rowGold]}
    >
      <Text style={[styles.rank, isTop && styles.rankMedal]}>
        {isTop ? MEDALS[index] : `#${index + 1}`}
      </Text>
      <Text style={[styles.name, isTop && styles.nameTop]} numberOfLines={1}>
        {item.playerName}
      </Text>
      <Text style={[styles.prize, isTop && index === 0 && styles.prizeGold]}>
        {item.prizeWon.toLocaleString('tr-TR')} ₺
      </Text>
    </Animated.View>
  );
};

// ─── Geri Butonu ─────────────────────────────────────────────────────────────
const BackBtn = ({ onPress }: { onPress: () => void }) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.96, { damping: 18 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 14 }); }}
      onPress={onPress}
    >
      <Animated.View style={[styles.backBtn, animStyle]}>
        <Text style={styles.backBtnText}>← ANA MENÜ</Text>
      </Animated.View>
    </Pressable>
  );
};

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export default function LeaderboardScreen() {
  const [scores, setScores]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchScores(); }, []);

  const fetchScores = async () => {
    try {
      const r = await axios.get(API_URL);
      setScores(r.data);
    } catch {}
    finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>

      {/* Başlık */}
      <Animated.View entering={FadeIn.delay(100).duration(500)} style={styles.header}>
        <View style={styles.headerLine} />
        <Text style={styles.title}>LİDERLİK</Text>
        <Text style={styles.titleSub}>TABLOSU</Text>
        <View style={styles.headerLine} />
      </Animated.View>

      {/* Liste */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.listCard}>
        <View style={styles.listTopBar} />
        {loading ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator size="large" color={C.gold} />
          </View>
        ) : scores.length === 0 ? (
          <View style={styles.centerWrap}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyText}>Henüz kayıt yok</Text>
            <Text style={styles.emptySubText}>İlk seni görmek istiyoruz!</Text>
          </View>
        ) : (
          <FlatList
            data={scores}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item, index }) => <LeaderRow item={item} index={index} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12 }}
          />
        )}
      </Animated.View>

      {/* Geri Dön */}
      <Animated.View entering={FadeInDown.delay(350).springify()} style={styles.backWrap}>
        <BackBtn onPress={() => router.replace('/')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 36,
  },

  // Header
  header:     { alignItems: 'center', marginBottom: 28 },
  headerLine: { width: 40, height: 2, backgroundColor: C.gold, borderRadius: 1, marginVertical: 10 },
  title:      { color: C.text,  fontSize: 34, fontWeight: '900', letterSpacing: 2 },
  titleSub:   { color: C.gold,  fontSize: 16, fontWeight: '700', letterSpacing: 6, marginTop: -4 },

  // Liste kartı
  listCard:   { flex: 1, backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 16, overflow: 'hidden' },
  listTopBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: C.gold, opacity: 0.6 },

  centerWrap:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptyIcon:     { fontSize: 40 },
  emptyText:     { color: C.muted, fontSize: 16, fontWeight: '600' },
  emptySubText:  { color: 'rgba(200,200,220,0.28)', fontSize: 13 },

  // Satırlar
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  rowGold: {
    backgroundColor: 'rgba(245,200,66,0.07)',
    borderColor: 'rgba(245,200,66,0.3)',
  },
  rank:       { fontSize: 16, fontWeight: '800', width: 42, color: C.muted },
  rankMedal:  { fontSize: 20 },
  name:       { flex: 1, color: C.text, fontSize: 16, fontWeight: '500' },
  nameTop:    { fontWeight: '700' },
  prize:      { color: C.success, fontSize: 15, fontWeight: '800' },
  prizeGold:  { color: C.gold },

  // Geri butonu
  backWrap:   { marginTop: 18 },
  backBtn:    {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: { color: C.gold, fontSize: 15, fontWeight: '800', letterSpacing: 2 },
});
