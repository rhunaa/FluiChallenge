import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Texto as Text } from './Texto';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { gradients, radius, shadow, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { Avaliacao, Estacao } from '../tipos';

const MOOD_EMOJI = ['😖', '🙁', '😐', '🙂', '🤩'];

function average(ratings: Avaliacao['ratings']) {
  const values = Object.values(ratings);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function CartaoAvaliacao({
  review,
  station,
  index = 0,
  onPressStation,
}: {
  review: Avaliacao;
  station?: Estacao;
  index?: number;
  onPressStation?: () => void;
}) {
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const avg = average(review.ratings);
  const topCategories = Object.entries(review.ratings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  const categoryLabel: Record<string, string> = {
    availability: 'Disponibilidade',
    queue: 'Fila/Espera',
    speed: 'Velocidade',
    comfort: 'Conforto',
    value: 'Custo-benefício',
  };

  return (
    <Animated.View entering={FadeInUp.delay(index * 70).springify().damping(16)} style={[styles.card, shadow.card]}>
      <Pressable onPress={onPressStation} style={styles.header} accessibilityRole="button" accessibilityLabel={`Ver ${station?.name ?? 'posto'}`}>
        <LinearGradient colors={gradients.card} style={styles.thumb}>
          <Ionicons name="flash" size={18} color={colors.onPrimary} />
        </LinearGradient>
        <View style={styles.headerInfo}>
          <Text style={styles.stationName} numberOfLines={1} allowFontScaling>
            {station?.name ?? 'Posto'}
          </Text>
          <Text style={styles.address} numberOfLines={1} allowFontScaling>
            {station?.address}
          </Text>
        </View>
        <Text style={styles.mood} allowFontScaling accessibilityLabel={`Avaliação geral: ${avg.toFixed(1)} de 5`}>
          {MOOD_EMOJI[review.mood - 1]}
        </Text>
      </Pressable>

      <View style={styles.chipsRow}>
        {topCategories.map(([key, val]) => (
          <View key={key} style={styles.chip}>
            <Ionicons name="star" size={11} color={colors.warning} />
            <Text style={styles.chipText} allowFontScaling>
              {categoryLabel[key]} {val.toFixed(1)}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.comment} numberOfLines={3} allowFontScaling>
        {review.comment}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.author} allowFontScaling>
          {review.authorName} · {review.createdAt}
        </Text>
        <View style={styles.footerActions}>
          <View style={styles.footerAction}>
            <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.footerActionText} allowFontScaling>
              {review.comments}
            </Text>
          </View>
          <Ionicons name="share-social-outline" size={16} color={colors.textSecondary} />
        </View>
      </View>
    </Animated.View>
  );
}

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  stationName: {
    ...typography.bodyMedium,
  },
  address: {
    ...typography.small,
    color: colors.textMuted,
  },
  mood: {
    fontSize: 22,
    marginLeft: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.warningLight,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  chipText: {
    ...typography.small,
    color: colors.textPrimary,
  },
  comment: {
    ...typography.body,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    ...typography.small,
    color: colors.textMuted,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  footerActionText: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
