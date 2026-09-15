import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Texto as Text } from './Texto';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { radius, shadow, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { LocalProximo, ROTULOS_COMODIDADE } from '../tipos';

const ICONE_CATEGORIA: Record<LocalProximo['category'], keyof typeof Ionicons.glyphMap> = {
  cafe: 'cafe-outline',
  food: 'fast-food-outline',
  shopping: 'bag-outline',
};

interface CartaoLocalProximoProps {
  local: LocalProximo;
  index?: number;
}

export function CartaoLocalProximo({ local, index = 0 }: CartaoLocalProximoProps) {
  const { colors } = usarTema();
  const styles = criarEstilos(colors);

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 70).springify().damping(16)}
      style={[styles.card, shadow.card]}
      accessible
      accessibilityLabel={`${local.name}, ${ROTULOS_COMODIDADE[local.category]}, a ${local.walkMin} minutos a pé, avaliação ${local.rating.toFixed(1)}`}
    >
      <Image source={{ uri: local.imageUrl }} style={styles.thumb} accessibilityIgnoresInvertColors />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1} allowFontScaling>
          {local.name}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name={ICONE_CATEGORIA[local.category]} size={12} color={colors.textSecondary} />
          <Text style={styles.metaText} numberOfLines={1} allowFontScaling>
            {ROTULOS_COMODIDADE[local.category]}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="walk-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.metaText} allowFontScaling>
            {local.walkMin} min
          </Text>
          <Ionicons name="star" size={12} color={colors.warning} style={styles.starIcon} />
          <Text style={styles.metaText} allowFontScaling>
            {local.rating.toFixed(1)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) =>
  StyleSheet.create({
    card: {
      width: 160,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      overflow: 'hidden',
      marginRight: spacing.md,
    },
    thumb: {
      width: '100%',
      height: 90,
      backgroundColor: colors.surfaceMuted,
    },
    info: {
      padding: spacing.sm,
    },
    name: {
      ...typography.bodyMedium,
      fontSize: 13,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    metaText: {
      ...typography.small,
      color: colors.textSecondary,
    },
    starIcon: {
      marginLeft: 6,
    },
  });
