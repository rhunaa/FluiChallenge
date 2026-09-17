import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Texto as Text } from './Texto';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { radius, shadow, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';

interface AcaoRapidaProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  selected?: boolean;
  accessibilityHint?: string;
}

export function AcaoRapida({ icon, label, onPress, selected, accessibilityHint }: AcaoRapidaProps) {
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
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

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) => StyleSheet.create({
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
    color: colors.textOnGradientMuted,
  },
});
