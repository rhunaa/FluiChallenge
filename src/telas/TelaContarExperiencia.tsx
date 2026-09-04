import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, gradients, radius, spacing, typography } from '../tema/tema';
import { estacoes } from '../dados/estacoes';
import { ROTULOS_CATEGORIA_AVALIACAO, CategoriasAvaliacao } from '../tipos';
import { AvaliacaoEstrelas } from '../componentes/AvaliacaoEstrelas';
import { usarAvaliacoes } from '../contexto/ContextoAvaliacoes';

const MOODS = [
  { value: 1, emoji: '😖', label: 'Péssima' },
  { value: 2, emoji: '🙁', label: 'Ruim' },
  { value: 3, emoji: '😐', label: 'Regular' },
  { value: 4, emoji: '🙂', label: 'Boa' },
  { value: 5, emoji: '🤩', label: 'Incrível' },
];

const DEFAULT_RATINGS: CategoriasAvaliacao = {
  availability: 0,
  queue: 0,
  speed: 0,
  comfort: 0,
  value: 0,
};

const MAX_COMMENT_LENGTH = 500;

export default function TelaContarExperiencia() {
  const navigation = useNavigation<any>();
  const { adicionarAvaliacao } = usarAvaliacoes();

  const [query, setQuery] = useState('');
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [ratings, setRatings] = useState<CategoriasAvaliacao>(DEFAULT_RATINGS);
  const [comment, setComment] = useState('');

  const suggestions = useMemo(() => {
    if (selectedStationId || query.trim().length === 0) return [];
    return estacoes.filter((s) => s.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4);
  }, [query, selectedStationId]);

  const selectedStation = estacoes.find((s) => s.id === selectedStationId);
  const canPublish = !!selectedStationId && !!mood && Object.values(ratings).every((v) => v > 0);

  function updateRating(key: keyof CategoriasAvaliacao, value: number) {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }

  function handlePublish() {
    if (!selectedStationId || !mood) return;
    adicionarAvaliacao({
      stationId: selectedStationId,
      authorName: 'Você',
      mood,
      ratings,
      comment: comment.trim() || 'Sem comentários adicionais.',
    });
    Alert.alert('Obrigado!', 'Sua experiência foi publicada na comunidade.');
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.hero} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTopRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="arrow-back" size={18} color={colors.onPrimary} />
            </Pressable>
          </View>
          <Text style={styles.title} accessibilityRole="header" allowFontScaling>
            Contar experiência
          </Text>
          <Text style={styles.subtitle} allowFontScaling>
            Sua opinião ajuda a comunidade
          </Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionLabel} allowFontScaling>
          Selecione um posto
        </Text>
        {selectedStation ? (
          <View style={styles.selectedStation}>
            <Text style={styles.selectedStationText} allowFontScaling>
              {selectedStation.name}
            </Text>
            <Pressable
              onPress={() => {
                setSelectedStationId(null);
                setQuery('');
              }}
              accessibilityRole="button"
              accessibilityLabel="Trocar posto selecionado"
            >
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
        ) : (
          <>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Escreva o endereço ou nome do posto"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              accessibilityLabel="Buscar posto pelo nome ou endereço"
            />
            {suggestions.map((s) => (
              <Pressable
                key={s.id}
                onPress={() => {
                  setSelectedStationId(s.id);
                  setQuery(s.name);
                }}
                style={styles.suggestionRow}
                accessibilityRole="button"
                accessibilityLabel={`Selecionar ${s.name}`}
              >
                <Ionicons name="location-outline" size={16} color={colors.primary} />
                <Text style={styles.suggestionText} allowFontScaling>
                  {s.name} — {s.address}
                </Text>
              </Pressable>
            ))}
          </>
        )}

        <Text style={[styles.sectionLabel, styles.sectionSpacing]} allowFontScaling>
          Como foi sua experiência geral?
        </Text>
        <View style={styles.moodRow}>
          {MOODS.map((m) => {
            const active = mood === m.value;
            return (
              <Pressable
                key={m.value}
                onPress={() => setMood(m.value)}
                style={[styles.moodButton, active && styles.moodButtonActive]}
                accessibilityRole="button"
                accessibilityLabel={m.label}
                accessibilityState={{ selected: active }}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, styles.sectionSpacing]} allowFontScaling>
          Avalie os principais aspectos
        </Text>
        {(Object.keys(ROTULOS_CATEGORIA_AVALIACAO) as (keyof CategoriasAvaliacao)[]).map((key, i) => (
          <Animated.View key={key} entering={FadeInUp.delay(i * 60).springify().damping(16)} style={styles.categoryRow}>
            <View style={styles.categoryText}>
              <Text style={styles.categoryTitle} allowFontScaling>
                {ROTULOS_CATEGORIA_AVALIACAO[key].label}
              </Text>
              <Text style={styles.categoryHint} allowFontScaling>
                {ROTULOS_CATEGORIA_AVALIACAO[key].hint}
              </Text>
            </View>
            <AvaliacaoEstrelas value={ratings[key]} onChange={(v) => updateRating(key, v)} label={ROTULOS_CATEGORIA_AVALIACAO[key].label} />
          </Animated.View>
        ))}

        <Text style={[styles.sectionLabel, styles.sectionSpacing]} allowFontScaling>
          Conte mais sobre sua experiência
        </Text>
        <TextInput
          value={comment}
          onChangeText={(t) => setComment(t.slice(0, MAX_COMMENT_LENGTH))}
          placeholder="Escreva aqui sua experiência, dicas ou observações..."
          placeholderTextColor={colors.textMuted}
          style={styles.textarea}
          multiline
          numberOfLines={4}
          accessibilityLabel="Comentário sobre sua experiência"
        />
        <Text style={styles.charCount} allowFontScaling>
          {comment.length}/{MAX_COMMENT_LENGTH}
        </Text>

        <Pressable
          onPress={handlePublish}
          disabled={!canPublish}
          style={[styles.publishButton, !canPublish && styles.publishButtonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Publicar experiência"
          accessibilityState={{ disabled: !canPublish }}
        >
          <Text style={styles.publishText} allowFontScaling>
            Publicar Experiência
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  headerTopRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.textOnDark,
  },
  subtitle: {
    ...typography.body,
    color: colors.textOnDarkMuted,
    marginTop: 2,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 60,
  },
  sectionLabel: {
    ...typography.h3,
    color: colors.textOnDark,
    marginBottom: spacing.sm,
  },
  sectionSpacing: {
    marginTop: spacing.xl,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  suggestionText: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
  },
  selectedStation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  selectedStationText: {
    ...typography.bodyMedium,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodButtonActive: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  moodEmoji: {
    fontSize: 24,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  categoryTitle: {
    ...typography.bodyMedium,
  },
  categoryHint: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  textarea: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
    color: colors.textPrimary,
    fontSize: 14,
  },
  charCount: {
    ...typography.small,
    color: colors.textOnDarkMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  publishButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  publishButtonDisabled: {
    opacity: 0.4,
  },
  publishText: {
    ...typography.bodyMedium,
    color: colors.onPrimary,
  },
});
