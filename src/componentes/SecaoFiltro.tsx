import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Texto as Text } from './Texto';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';

export function SecaoFiltro({
  title,
  children,
  index = 0,
}: {
  title: string;
  children: React.ReactNode;
  index?: number;
}) {
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 70).springify().damping(16)}
      style={styles.section}
    >
      <Text style={styles.title} accessibilityRole="header" allowFontScaling>
        {title}
      </Text>
      <View style={styles.row}>{children}</View>
    </Animated.View>
  );
}

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) => StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.textOnDark,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
