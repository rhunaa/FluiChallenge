import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Texto as Text } from './Texto';
import { Ionicons } from '@expo/vector-icons';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { radius, shadow, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { Estacao } from '../tipos';
import { SeloStatus } from './SeloStatus';

interface CartaoPreviaEstacaoProps {
  station: Estacao;
  onClose: () => void;
  onViewDetails: () => void;
}

export function CartaoPreviaEstacao({ station, onClose, onViewDetails }: CartaoPreviaEstacaoProps) {
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const fastest = Math.max(...station.connectors.map((c) => c.powerKw));

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18)}
      exiting={SlideOutDown.duration(180)}
      style={[styles.card, shadow.floating]}
    >
      <Pressable
        onPress={onClose}
        style={styles.closeButton}
        accessibilityRole="button"
        accessibilityLabel="Fechar prévia do ponto"
        hitSlop={10}
      >
        <Ionicons name="close" size={16} color={colors.textSecondary} />
      </Pressable>

      <View style={styles.row}>
        <Image source={{ uri: station.imageUrl }} style={styles.thumb} accessibilityIgnoresInvertColors />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1} allowFontScaling>
            {station.name}
          </Text>
          <Text style={styles.address} numberOfLines={1} allowFontScaling>
            {station.address} · {station.distanceKm} km
          </Text>
          <View style={styles.metaRow}>
            <SeloStatus status={station.status} />
            <Text style={styles.power} allowFontScaling>
              até {fastest} kW
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={onViewDetails}
        style={styles.detailsButton}
        accessibilityRole="button"
        accessibilityLabel={`Ver ficha completa de ${station.name}`}
      >
        <Text style={styles.detailsText} allowFontScaling>
          Ver detalhes
        </Text>
        <Ionicons name="arrow-forward" size={16} color={colors.onPrimary} />
      </Pressable>
    </Animated.View>
  );
}

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) => StyleSheet.create({
  card: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: 110,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    marginRight: spacing.md,
    backgroundColor: colors.surfaceMuted,
  },
  info: {
    flex: 1,
    paddingRight: spacing.xl,
  },
  name: {
    ...typography.h3,
  },
  address: {
    ...typography.caption,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  power: {
    ...typography.small,
    color: colors.textSecondary,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
  },
  detailsText: {
    ...typography.bodyMedium,
    color: colors.onPrimary,
  },
});
