import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Texto as Text } from './Texto';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { gradients, radius, shadow, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { Estacao, SessaoRecarga } from '../tipos';
import { formatarDataHistorico } from '../dados/historico';

interface CartaoHistoricoProps {
  sessao: SessaoRecarga;
  station?: Estacao;
  onPress: () => void;
  index?: number;
}

export function CartaoHistorico({ sessao, station, onPress, index = 0 }: CartaoHistoricoProps) {
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify().damping(16)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, shadow.card, pressed && styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel={`Recarga em ${station?.name ?? 'posto'} em ${formatarDataHistorico(sessao.date)}, ${sessao.energyKwh} quilowatt-hora, ${sessao.durationMin} minutos, custou ${sessao.cost.toFixed(2)} reais`}
        accessibilityHint="Toque para ver a ficha do ponto de recarga"
      >
        {station?.imageUrl ? (
          <Image source={{ uri: station.imageUrl }} style={styles.thumb} accessibilityIgnoresInvertColors />
        ) : (
          <LinearGradient colors={gradients.card} style={styles.thumb}>
            <Ionicons name="time-outline" size={20} color={colors.onPrimary} />
          </LinearGradient>
        )}

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1} allowFontScaling>
              {station?.name ?? 'Posto removido'}
            </Text>
            <Text style={styles.date} allowFontScaling>
              {formatarDataHistorico(sessao.date)}
            </Text>
          </View>
          <Text style={styles.address} numberOfLines={1} allowFontScaling>
            {station?.address}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="flash-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText} allowFontScaling>{sessao.energyKwh.toFixed(1)} kWh</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="hourglass-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText} allowFontScaling>{sessao.durationMin} min</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="pricetag-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText} allowFontScaling>R$ {sessao.cost.toFixed(2)}</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="ellipse-outline" size={10} color={colors.textSecondary} />
              <Text style={styles.metaText} allowFontScaling>{sessao.connectorType}</Text>
            </View>
          </View>
        </View>
      </Pressable>
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
  cardPressed: {
    opacity: 0.85,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
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
  date: {
    ...typography.small,
    color: colors.textMuted,
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
