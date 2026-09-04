import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, gradients, radius, shadow, spacing, typography } from '../tema/tema';
import { Estacao } from '../tipos';
import { SeloStatus } from './SeloStatus';
import { usarFavoritos } from '../contexto/ContextoFavoritos';

interface CartaoEstacaoProps {
  station: Estacao;
  onPress: () => void;
  index?: number;
}

export function CartaoEstacao({ station, onPress, index = 0 }: CartaoEstacaoProps) {
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

        <LinearGradient colors={gradients.card} style={styles.thumb} pointerEvents="none">
          <Ionicons name="flash" size={22} color={colors.onPrimary} />
        </LinearGradient>

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
              <Text style={styles.metaText}>{fastest} kW</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="navigate-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText}>{station.distanceKm} km</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
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
