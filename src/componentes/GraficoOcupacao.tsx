import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Texto as Text } from './Texto';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { radius, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { obterHorarioMenosMovimentado } from '../dados/estacoes';

const CHART_HEIGHT = 64;
const LABELED_HOURS = [0, 6, 12, 18, 23];

export function GraficoOcupacao({ hourlyOccupancy }: { hourlyOccupancy: number[] }) {
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const quiet = obterHorarioMenosMovimentado(hourlyOccupancy);

  return (
    <View>
      <View style={styles.chartRow}>
        {hourlyOccupancy.map((value, hour) => {
          const isQuiet = hour >= quiet.start && hour < quiet.start + 3;
          return (
            <Animated.View
              key={hour}
              entering={FadeInUp.delay(hour * 18).duration(300)}
              style={styles.barTrack}
            >
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max(4, value * CHART_HEIGHT),
                    backgroundColor: isQuiet ? colors.primary : colors.borderLight,
                  },
                ]}
              />
            </Animated.View>
          );
        })}
      </View>
      <View style={styles.axisRow}>
        {LABELED_HOURS.map((h) => (
          <Text key={h} style={styles.axisLabel} allowFontScaling>
            {h}h
          </Text>
        ))}
      </View>

      <View style={styles.quietBanner}>
        <View style={styles.quietDot} />
        <Text style={styles.quietText} allowFontScaling>
          Menor movimento entre {quiet.start}h e {quiet.start + 3}h
        </Text>
      </View>
    </View>
  );
}

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) => StyleSheet.create({
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT,
    gap: 2,
  },
  barTrack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: CHART_HEIGHT,
  },
  bar: {
    width: '70%',
    borderRadius: 3,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  axisLabel: {
    ...typography.small,
    color: colors.textMuted,
  },
  quietBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  quietDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  quietText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
});
