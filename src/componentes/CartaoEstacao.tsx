import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Texto as Text } from './Texto';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { radius, shadow, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { Estacao } from '../tipos';
import { SeloStatus } from './SeloStatus';
import { usarFavoritos } from '../contexto/ContextoFavoritos';

interface CartaoEstacaoProps {
  station: Estacao;
  onPress: () => void;
  index?: number;
}

export function CartaoEstacao({ station, onPress, index = 0 }: CartaoEstacaoProps) {
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const { ehFavorito, alternarFavorito } = usarFavoritos();
  const saved = ehFavorito(station.id);
  const fastest = Math.max(...station.connectors.map((c) => c.powerKw));

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify().damping(16)}>
      <View style={[styles.card, shadow.card]}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [StyleSheet.absoluteFill, styles.tapLayer, pressed && styles.cardPressed]}
          accessibilityRole="button"
          accessibilityLabel={`${station.name}, ${station.address}, a ${station.distanceKm} quilômetros`}
          accessibilityHint="Toque para ver a ficha completa do ponto de recarga"
        />

        <Image source={{ uri: station.imageUrl }} style={styles.thumb} accessibilityIgnoresInvertColors />

        <View style={styles.info} pointerEvents="box-none">
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1} allowFontScaling>
              {station.name}
            </Text>
            <Pressable
              onPress={() => alternarFavorito(station.id)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={saved ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              accessibilityState={{ selected: saved }}
            >
              <Ionicons name={saved ? 'heart' : 'heart-outline'} size={18} color={saved ? colors.danger : colors.textMuted} />
            </Pressable>
          </View>
          <Text style={styles.address} numberOfLines={1} allowFontScaling>
            {station.address}
          </Text>

          <View style={styles.metaRow}>
            <SeloStatus status={station.status} />
            <View style={styles.metaChip}>
              <Ionicons name="flash-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText} allowFontScaling>{fastest} kW</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="navigate-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText} allowFontScaling>{station.distanceKm} km</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tapLayer: {
    borderRadius: radius.lg,
    zIndex: 0,
  },
  cardPressed: {
    opacity: 0.85,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    marginRight: spacing.md,
    backgroundColor: colors.surfaceMuted,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.h3,
    flex: 1,
    marginRight: spacing.sm,
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
    flexWrap: 'wrap',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
