import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, spacing, typography } from '../tema/tema';

export function SecaoFiltro({
  title,
  children,
  index = 0,
}: {
  title: string;
  children: React.ReactNode;
  index?: number;
}) {
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

const styles = StyleSheet.create({
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
