import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, radius, shadow, spacing, typography } from '../tema/tema';

interface AcaoRapidaProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  selected?: boolean;
  accessibilityHint?: string;
}

export function AcaoRapida({ icon, label, onPress, selected, accessibilityHint }: AcaoRapidaProps) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.95, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      style={styles.wrapper}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected: !!selected }}
    >
      <Animated.View
        style={[
          styles.iconBox,
          shadow.card,
          selected && styles.iconBoxSelected,
          style,
        ]}
      >
        <Ionicons name={icon} size={22} color={selected ? colors.onPrimary : colors.primary} />
      </Animated.View>
      <Text style={styles.label} numberOfLines={2} allowFontScaling>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 76,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconBoxSelected: {
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.small,
    textAlign: 'center',
    color: colors.textOnDarkMuted,
  },
});
