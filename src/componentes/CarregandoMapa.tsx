import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing, typography } from '../tema/tema';

export function CarregandoMapa({ label = 'Carregando pontos de recarga...' }: { label?: string }) {
  const rotate = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    rotate.value = withRepeat(withTiming(360, { duration: 1400 }), -1, false);
    pulse.value = withRepeat(withSequence(withTiming(1.15, { duration: 500 }), withTiming(1, { duration: 500 })), -1, true);
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.container} accessibilityLiveRegion="polite" accessibilityLabel={label}>
      <View style={styles.badge}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <Animated.View style={iconStyle}>
          <Ionicons name="flash" size={22} color={colors.primary} />
        </Animated.View>
      </View>
      <Text style={styles.label} allowFontScaling>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: colors.primaryLight,
    borderTopColor: colors.primary,
  },
  label: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
  },
});
