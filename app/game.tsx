import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const API_URL = 'http://10.0.2.2:3000/questions';
const PRIZES = [0, 500, 1000, 2000, 3000, 5000, 7500, 15000, 30000, 60000, 125000, 250000, 1000000];

// ─── Tip Tanımları ────────────────────────────────────────────────────────────
type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed';

// ─── Renk Sistemi ─────────────────────────────────────────────────────────────
const C = {
  gold: '#F5C842',
  goldDim: 'rgba(245,200,66,0.3)',
  goldFaint: 'rgba(245,200,66,0.08)',
  surface: 'rgba(16,16,26,0.92)',
  surfaceLow: 'rgba(12,12,20,0.75)',
  border: 'rgba(245,200,66,0.18)',
  borderHigh: 'rgba(245,200,66,0.7)',
  text: '#F0F0F8',
  textMuted: 'rgba(200,200,220,0.5)',
  success: '#22D47C',
  error: '#FF4560',
  bg: '#07070E',
};


function getOptionColors(state: OptionState) {
  switch (state) {
    case 'selected': return { border: 'rgba(245,200,66,0.9)', bg: 'rgba(245,200,66,0.1)', label: C.gold };
    case 'correct': return { border: C.success, bg: 'rgba(34,212,124,0.12)', label: C.success };
    case 'wrong': return { border: C.error, bg: 'rgba(255,69,96,0.12)', label: C.error };
    case 'dimmed': return { border: 'rgba(255,255,255,0.05)', bg: 'rgba(10,10,18,0.35)', label: 'rgba(255,255,255,0.2)' };
    default: return { border: 'rgba(255,255,255,0.1)', bg: C.surfaceLow, label: C.textMuted };
  }
}

// ─── Animasyonlu Seçenek ──────────────────────────────────────────────────────
type OptionProps = {
  letter: string;
  text: string;
  state: OptionState;
  onPress: (l: string) => void;
  index: number;
};

const AnimatedOption = React.memo(({ letter, text, state, onPress, index }: OptionProps) => {
  // ⚠️ Tüm hook'lar koşulsuz — erken return'den ÖNCE çağrılmalı
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const { border, bg, label } = getOptionColors(state);

  // Erken return hook'lardan sonra ✓
  if (state === 'dimmed') {
    return <View style={{ height: 62, marginBottom: 12 }} />;
  }

  const handlePressIn = () => {
    if (state !== 'idle') return;
    opacity.value = withTiming(0.75, { duration: 80 });
  };
  const handlePressOut = () => {
    opacity.value = withTiming(1, { duration: 150 });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70).duration(300)}
      style={[styles.optionWrapper, animStyle]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(letter)}
        disabled={state !== 'idle'}
        style={[styles.optionBtn, { borderColor: border, backgroundColor: bg }]}
      >
        <View style={[styles.optionAccent, { backgroundColor: border }]} />
        <Text style={[styles.optionLetter, { color: label }]}>{letter}</Text>
        <Text style={styles.optionText}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
});

// ─── Prize Kutusu (Basit, animasyonsuz) ─────────────────────────────────────
const PrizeBox = ({ amount, onPress }: { amount: number; onPress: () => void }) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.prizeBox}>
        <Text style={styles.prizeLabel}>KAZANILAN</Text>
        <Text style={styles.prizeAmount}>{amount.toLocaleString('tr-TR')} ₺</Text>
      </View>
    </Pressable>
  );
};

// ─── Joker Buton (hafif opacity feedback) ───────────────────────────────────
const JokerBtn = ({ label, used, onPress }: { label: string; used: boolean; onPress: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={used}
      style={({ pressed }) => [
        styles.jokerBtn,
        used && styles.jokerUsed,
        pressed && { opacity: 0.6 },
      ]}
    >
      <Text style={[styles.jokerText, used && styles.jokerTextUsed]}>{label}</Text>
    </Pressable>
  );
};

// ─── Ana Oyun Ekranı ──────────────────────────────────────────────────────────
export default function GameScreen() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [prizeLevel, setPrizeLevel] = useState(0);
  const [eliminated, setEliminated] = useState<string[]>([]);
  const [usedHalf, setUsedHalf] = useState(false);
  const [usedPhone, setUsedPhone] = useState(false);
  const [usedAudience, setUsedAudience] = useState(false);
  const [usedSwap, setUsedSwap] = useState(false);
  const [ladderOpen, setLadderOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phoneStep, setPhoneStep] = useState<'select' | 'answer'>('select');
  const [phoneSug, setPhoneSug] = useState('');
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [audienceData, setAudienceData] = useState<any>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const ladderScrollRef = useRef<ScrollView>(null);

  // Ödül ağacı açılınca otomatik en alta (ilk sorulara) scroll yap
  useEffect(() => {
    if (ladderOpen) {
      setTimeout(() => {
        if (prizeLevel <= 6) {
          ladderScrollRef.current?.scrollToEnd({ animated: true });
        }
      }, 50);
    }
  }, [ladderOpen]);

  // Soru giriş animasyonu için key
  const [questionKey, setQuestionKey] = useState(0);

  useEffect(() => { fetchQ(); }, []);

  const fetchQ = async () => {
    try {
      const r = await axios.get(API_URL);
      const allQ = r.data;
      setAllQuestions(allQ);

      const byDiff: Record<number, any[]> = {};
      allQ.forEach((q: any) => {
        if (!byDiff[q.difficultyLevel]) byDiff[q.difficultyLevel] = [];
        byDiff[q.difficultyLevel].push(q);
      });

      let selected: any[] = [];
      for (let i = 1; i <= 6; i++) {
        const pool = byDiff[i] || [];
        pool.sort(() => Math.random() - 0.5); // Karıştır
        selected = selected.concat(pool.slice(0, 2)); // 2 tane seç
      }

      // Seçilen soruların şıklarını kendi içinde karıştır
      const finalQuestions = selected.map(q => {
        const opts = [
          { key: 'A', text: q.optionA },
          { key: 'B', text: q.optionB },
          { key: 'C', text: q.optionC },
          { key: 'D', text: q.optionD }
        ];
        // Orijinal doğru cevabın metni
        const correctText = opts.find(o => o.key === q.correctAnswer)?.text;

        // Şıkları karıştır
        opts.sort(() => Math.random() - 0.5);

        // Yeni şıkları yerleştir ve doğru cevap harfini güncelle
        const shuffledQ = { ...q };
        ['A', 'B', 'C', 'D'].forEach((letter, index) => {
          shuffledQ[`option${letter}`] = opts[index].text;
          if (opts[index].text === correctText) {
            shuffledQ.correctAnswer = letter;
          }
        });
        return shuffledQ;
      });

      setQuestions(finalQuestions);
    } catch (_) { }
    finally { setLoading(false); }
  };

  const getOptionState = (letter: string): OptionState => {
    if (eliminated.includes(letter)) return 'dimmed';
    if (!isChecking || (isChecking && !isRevealed)) {
      return selectedOpt === letter ? 'selected' : 'idle';
    }
    const cq = questions[currentIndex];
    if (letter === cq.correctAnswer) return 'correct';
    if (letter === selectedOpt) return 'wrong';
    return 'dimmed';
  };

  const handleOption = (opt: string) => {
    if (isChecking) return;
    setSelectedOpt(opt);
    setIsChecking(true);
    setIsRevealed(false);

    const cq = questions[currentIndex];
    const diff = cq.difficultyLevel || 1;
    // 1. Dinamik sarı yanma (bekleme) süresi
    const waitTime = diff === 1 ? 2000 : diff === 2 ? 3000 : diff === 3 ? 4000 : diff === 4 ? 5000 : diff >= 5 ? 6500 : 2000;

    setTimeout(() => {
      setIsRevealed(true); // Renkler yeşile/kırmızıya döner

      // 2. Doğru/Yanlış belli olduktan sonra 1.5 saniye bekle
      setTimeout(() => {
        if (opt === cq.correctAnswer) {
          const next = prizeLevel + 1;

          if (currentIndex + 1 < questions.length && next < PRIZES.length - 1) {
            setLadderOpen(true); // Ödül ağacını güncel adımda aç

            // 3. Tablo açıldıktan sonra animasyonla bir üst adıma tırman
            setTimeout(() => {
              setPrizeLevel(next);

              setTimeout(() => {
                setLadderOpen(false);
                setTimeout(() => {
                  setCurrentIndex(i => i + 1);
                  setSelectedOpt(null);
                  setIsChecking(false);
                  setIsRevealed(false);
                  setEliminated([]);
                  setQuestionKey(k => k + 1);
                }, 400);
              }, 2000); // Yeni seviyeyi 2 saniye göster
            }, 800);

          } else {
            setPrizeLevel(next);
            router.push({ pathname: '/score', params: { prize: PRIZES[next] } });
          }
        } else {
          let won = 0;
          if (prizeLevel >= 2) won = 1000;
          if (prizeLevel >= 7) won = 15000;
          router.push({ pathname: '/score', params: { prize: won } });
        }
      }, 1500);
    }, waitTime);
  };

  const useHalf = () => {
    if (usedHalf || isChecking) return;
    const cq = questions[currentIndex];
    const wrong = ['A', 'B', 'C', 'D']
      .filter(o => o !== cq.correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    setEliminated(wrong);
    setUsedHalf(true);
  };

  const useSwap = () => {
    if (usedSwap || isChecking) return;
    const cq = questions[currentIndex];
    const diff = cq.difficultyLevel || 1;

    // Aynı zorluktan kullanılmayan bir soru bul
    const available = allQuestions.filter(q => q.difficultyLevel === diff && !questions.includes(q));

    if (available.length > 0) {
      const newQ = available[Math.floor(Math.random() * available.length)];

      const opts = [
        { key: 'A', text: newQ.optionA },
        { key: 'B', text: newQ.optionB },
        { key: 'C', text: newQ.optionC },
        { key: 'D', text: newQ.optionD }
      ];
      const correctText = opts.find(o => o.key === newQ.correctAnswer)?.text;
      opts.sort(() => Math.random() - 0.5);

      const shuffledQ = { ...newQ };
      ['A', 'B', 'C', 'D'].forEach((letter, index) => {
        shuffledQ[`option${letter}`] = opts[index].text;
        if (opts[index].text === correctText) {
          shuffledQ.correctAnswer = letter;
        }
      });

      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex] = shuffledQ;
      setQuestions(updatedQuestions);
      setUsedSwap(true);
      setEliminated([]);
      setIsRevealed(false);
      setQuestionKey(k => k + 1);
    }
  };

  const usePhone = () => {
    if (usedPhone || isChecking) return;
    setPhoneStep('select');
    setPhoneOpen(true);
  };

  const callFriend = (friendName: string) => {
    const cq = questions[currentIndex];
    const diff = cq.difficultyLevel || 1;

    // Zorluk seviyesine göre doğru bilme ihtimali
    let correctChance = 0.85;
    if (diff >= 5) correctChance = 0.40; // Zor sorularda %40 ihtimal
    else if (diff >= 3) correctChance = 0.65; // Orta sorularda %65 ihtimal

    const ok = Math.random() < correctChance;
    let g = cq.correctAnswer;
    if (!ok) {
      const w = ['A', 'B', 'C', 'D'].filter(o => o !== cq.correctAnswer && !eliminated.includes(o));
      g = w[Math.floor(Math.random() * w.length)] || cq.correctAnswer;
    }
    setPhoneSug(`"${friendName}:\n\nEmin değilim ama bence cevap ${g} şıkkı olabilir, başarılar dilerim!"`);
    if (ok && diff < 3) {
      setPhoneSug(`"${friendName}:\n\nBunu biliyorum! Kesinlikle cevap ${g} şıkkı, güven bana!"`);
    }

    setUsedPhone(true);
    setPhoneStep('answer');
  };

  const useAudience = () => {
    if (usedAudience || isChecking) return;
    const cq = questions[currentIndex];
    const diff = cq.difficultyLevel || 1;

    // Zorluğa göre seyircinin doğru bilme oranı ve tereddütü
    let minCorrect = 50;
    let maxCorrect = 80;
    if (diff >= 5) {
      minCorrect = 25; // Seyirci zor soruda çok dağılır
      maxCorrect = 45;
    } else if (diff >= 3) {
      minCorrect = 40;
      maxCorrect = 60;
    }

    const cp = Math.floor(Math.random() * (maxCorrect - minCorrect + 1)) + minCorrect;
    let rem = 100 - cp;
    const wrong = ['A', 'B', 'C', 'D'].filter(o => o !== cq.correctAnswer && !eliminated.includes(o));
    const res: any = { [cq.correctAnswer]: cp };
    wrong.forEach((o, i) => {
      if (i === wrong.length - 1) res[o] = rem;
      else { const p = Math.floor(Math.random() * rem); res[o] = p; rem -= p; }
    });
    eliminated.forEach(o => { res[o] = 0; });
    setAudienceData(res);
    setUsedAudience(true);
    setAudienceOpen(true);
  };

  if (loading) return (
    <View style={styles.centerWrap}>
      <ActivityIndicator size="large" color={C.gold} />
      <Text style={styles.loadingText}>Sorular yükleniyor...</Text>
    </View>
  );

  if (!questions.length) return (
    <View style={styles.centerWrap}>
      <Text style={styles.errText}>Soru bulunamadı</Text>
      <TouchableOpacity style={styles.errBtn} onPress={() => router.back()}>
        <Text style={styles.errBtnText}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );

  const cq = questions[currentIndex];

  return (
    <View style={styles.container}>

      {/* ── Üst Bar ──────────────────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.topBar}>
        <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>

        <PrizeBox amount={PRIZES[prizeLevel]} onPress={() => setLadderOpen(true)} />

        <View style={styles.jokerRow}>
          <JokerBtn label="%50" used={usedHalf} onPress={useHalf} />
          <JokerBtn label="📞" used={usedPhone} onPress={usePhone} />
          <JokerBtn label="👥" used={usedAudience} onPress={useAudience} />
          {prizeLevel >= 5 && (
            <Animated.View entering={FadeIn.duration(400)}>
              <JokerBtn label="🔄" used={usedSwap} onPress={useSwap} />
            </Animated.View>
          )}
        </View>
      </Animated.View>

      {/* ── Soru Kartı ───────────────────────────────────────────────────── */}
      <Animated.View
        key={questionKey}
        entering={FadeInDown.delay(120).springify().damping(20)}
        style={styles.questionCard}
      >
        {/* Üst altın kenar */}
        <View style={styles.questionTopBar} />
        <Text style={styles.questionMeta}>
          Soru {currentIndex + 1}  ·  Hedef: {PRIZES[prizeLevel + 1]?.toLocaleString('tr-TR')} ₺
        </Text>
        <Text style={styles.questionText}>{cq.questionText}</Text>
      </Animated.View>

      {/* ── Seçenekler ───────────────────────────────────────────────────── */}
      <View style={styles.optionsArea}>
        {(['A', 'B', 'C', 'D'] as const).map((letter, i) => (
          <AnimatedOption
            key={`${questionKey}-${letter}`}
            letter={letter}
            text={cq[`option${letter}`]}
            state={getOptionState(letter)}
            onPress={handleOption}
            index={i}
          />
        ))}
      </View>

      {/* ── Telefon Joker Modal ──────────────────────────────────────────── */}
      <Modal visible={phoneOpen} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.overlay}>
          <Animated.View entering={FadeInDown.duration(300)} style={styles.modalCard}>
            <View style={styles.modalTopBar} />
            <Text style={styles.modalIcon}>📞</Text>

            {phoneStep === 'select' ? (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={[styles.modalTitle, { fontSize: 16 }]}>KİMİ ARAMAK İSTERSİNİZ?</Text>
                <View style={{ width: '100%', gap: 12, marginBottom: 20 }}>
                  {['Ahmet Bey (Tarihçi)', 'Mert Bey (Doktor)', 'Yavuz Bey (Mühendis)'].map(f => (
                    <TouchableOpacity key={f} style={styles.friendBtn} onPress={() => callFriend(f)}>
                      <Text style={styles.friendBtnText}>{f}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.modalBtn} onPress={() => setPhoneOpen(false)}>
                  <Text style={styles.modalBtnText}>İPTAL</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={styles.modalTitle}>TELEFON JOKERİ</Text>
                <Text style={styles.phoneText}>{phoneSug}</Text>
                <TouchableOpacity style={styles.modalBtn} onPress={() => setPhoneOpen(false)}>
                  <Text style={styles.modalBtnText}>TAMAM</Text>
                </TouchableOpacity>
              </View>
            )}

          </Animated.View>
        </View>
      </Modal>

      {/* ── Seyirci Joker Modal ──────────────────────────────────────────── */}
      <Modal visible={audienceOpen} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.overlay}>
          <Animated.View entering={FadeInDown.duration(300)} style={styles.modalCard}>
            <View style={styles.modalTopBar} />
            <Text style={styles.modalIcon}>👥</Text>
            <Text style={styles.modalTitle}>SEYİRCİ OYLAMASI</Text>
            <View style={styles.chartWrap}>
              {['A', 'B', 'C', 'D'].map(opt => (
                <View key={opt} style={styles.barRow}>
                  <Text style={styles.barLetter}>{opt}</Text>
                  <View style={styles.barTrack}>
                    <Animated.View
                      entering={FadeIn.delay(200)}
                      style={[styles.barFill, { width: `${audienceData?.[opt] || 0}%` as any }]}
                    />
                  </View>
                  <Text style={styles.barPct}>{audienceData?.[opt] || 0}%</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setAudienceOpen(false)}>
              <Text style={styles.modalBtnText}>TAMAM</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* ── Ödül Ağacı Modal ─────────────────────────────────────────────── */}
      <Modal visible={ladderOpen} transparent animationType="fade" statusBarTranslucent>
        <View style={[styles.overlay, { justifyContent: 'flex-end', paddingBottom: 0 }]} >
          <Animated.View entering={SlideInDown.duration(350)} style={styles.ladderSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>ÖDÜL AĞACI</Text>
            <ScrollView ref={ladderScrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.ladderList}>
              {[...PRIZES].reverse().map((p, idx) => {
                const step = PRIZES.length - 1 - idx;
                if (step === 0) return null;
                const isCurrent = step === prizeLevel;
                const isPassed = step < prizeLevel;
                const isBaraj = step === 2 || step === 7;
                return (
                  <View
                    key={step}
                    style={[
                      styles.ladderRow,
                      isCurrent && styles.ladderRowCurrent,
                      isPassed && styles.ladderRowPassed,
                      isBaraj && !isCurrent && styles.ladderRowBaraj,
                    ]}
                  >
                    <Text style={[styles.ladderStep, isCurrent && styles.ladderStepCurrent]}>
                      {isBaraj ? '🛡' : step}
                    </Text>
                    <Text style={[styles.ladderPrize, isCurrent && styles.ladderPrizeCurrent]}>
                      {p.toLocaleString('tr-TR')} ₺
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.sheetClose} onPress={() => setLadderOpen(false)}>
              <Text style={styles.sheetCloseText}>KAPAT</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', paddingHorizontal: 20, paddingBottom: 24 },
  centerWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { color: C.textMuted, fontSize: 14, marginTop: 12 },
  errText: { color: C.error, fontSize: 18 },
  errBtn: { paddingVertical: 12, paddingHorizontal: 28, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  errBtnText: { color: C.text, fontSize: 16 },

  // Top bar
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, marginBottom: 20 },
  exitBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.surfaceLow, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  exitText: { color: C.text, fontSize: 16, fontWeight: '700' },

  prizeBox: { alignItems: 'center', backgroundColor: C.surface, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: C.border },
  prizeLabel: { color: C.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 2 },
  prizeAmount: { color: C.gold, fontSize: 18, fontWeight: '900' },

  jokerRow: { flexDirection: 'row', gap: 8 },
  jokerBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: C.surfaceLow, borderWidth: 1, borderColor: C.border, justifyContent: 'center', alignItems: 'center' },
  jokerUsed: { opacity: 0.22, borderColor: 'rgba(255,255,255,0.05)' },
  jokerText: { fontSize: 13, color: C.gold, fontWeight: '800' },
  jokerTextUsed: { color: C.textMuted },

  // Soru kartı
  questionCard: { backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 24, marginBottom: 28, overflow: 'hidden' },
  questionTopBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: C.gold, opacity: 0.7 },
  questionMeta: { color: C.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 14 },
  questionText: { color: C.text, fontSize: 20, fontWeight: '600', lineHeight: 30 },

  // Seçenekler
  optionsArea: { gap: 0 },
  optionWrapper: { marginBottom: 12, borderRadius: 14, overflow: 'hidden' },
  optionBtn: { flexDirection: 'row', alignItems: 'center', minHeight: 58, borderWidth: 1, borderRadius: 14, paddingRight: 16 },
  optionAccent: { width: 3, height: '60%', borderRadius: 2, marginHorizontal: 14 },
  optionLetter: { fontSize: 16, fontWeight: '900', marginRight: 12, width: 22 },
  optionText: { color: C.text, fontSize: 16, flex: 1, fontWeight: '500', lineHeight: 22 },

  // Overlay & modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { width: '100%', backgroundColor: 'rgba(16,16,26,0.98)', borderRadius: 24, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  modalTopBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: C.gold, opacity: 0.8 },
  modalIcon: { fontSize: 36, marginBottom: 8 },
  modalTitle: { color: C.gold, fontSize: 18, fontWeight: '900', letterSpacing: 2, marginBottom: 20, textAlign: 'center' },
  phoneText: { color: C.text, fontSize: 17, textAlign: 'center', fontStyle: 'italic', lineHeight: 26, marginBottom: 28 },
  modalBtn: { backgroundColor: C.goldFaint, paddingVertical: 14, paddingHorizontal: 36, borderRadius: 14, borderWidth: 1, borderColor: C.goldDim },
  modalBtnText: { color: C.gold, fontWeight: '800', letterSpacing: 2 },
  friendBtn: { width: '100%', padding: 16, backgroundColor: C.surfaceLow, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
  friendBtnText: { color: C.text, fontSize: 16, fontWeight: '600' },

  // Chart
  chartWrap: { width: '100%', marginBottom: 24, gap: 14 },
  barRow: { flexDirection: 'row', alignItems: 'center' },
  barLetter: { color: C.gold, fontSize: 15, fontWeight: '900', width: 22 },
  barTrack: { flex: 1, height: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 5, marginHorizontal: 12, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: C.gold, borderRadius: 5 },
  barPct: { color: C.textMuted, fontSize: 14, width: 36, textAlign: 'right' },

  // Ladder sheet
  ladderSheet: { backgroundColor: 'rgba(12,12,20,0.98)', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, paddingBottom: 40, maxHeight: height * 0.8, borderTopWidth: 1, borderColor: C.border },
  sheetHandle: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { color: C.gold, fontSize: 16, fontWeight: '900', letterSpacing: 3, textAlign: 'center', marginBottom: 20 },
  ladderList: { paddingHorizontal: 20, paddingBottom: 20 },
  ladderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13, paddingHorizontal: 16, borderRadius: 10, marginBottom: 6 },
  ladderRowCurrent: { backgroundColor: 'rgba(245,200,66,0.12)', borderWidth: 1, borderColor: 'rgba(245,200,66,0.5)' },
  ladderRowPassed: { opacity: 0.3 },
  ladderRowBaraj: { borderLeftWidth: 2, borderLeftColor: 'rgba(245,200,66,0.3)' },
  ladderStep: { color: C.textMuted, fontSize: 15, fontWeight: '700', width: 32 },
  ladderStepCurrent: { color: C.gold },
  ladderPrize: { color: 'rgba(220,220,240,0.7)', fontSize: 16, fontWeight: '600' },
  ladderPrizeCurrent: { color: C.gold, fontWeight: '900' },
  sheetClose: { marginHorizontal: 24, marginTop: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  sheetCloseText: { color: C.textMuted, fontWeight: '700', letterSpacing: 2 },
});
