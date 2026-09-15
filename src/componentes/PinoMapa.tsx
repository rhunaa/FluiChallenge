import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { usarTema } from '../contexto/ContextoTema';
import { Estacao } from '../tipos';

interface PinoMapaProps {
  station: Estacao;
  selected: boolean;
  faded: boolean;
  onPress: () => void;
}

export function PinoMapa({ station, selected, faded, onPress }: PinoMapaProps) {
  const { colors } = usarTema();
  const STATUS_COLOR: Record<Estacao['status'], string> = {
    available: colors.primary,
    busy: colors.warning,
    offline: colors.offline,
  };
  const pulse = useSharedValue(1);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (station.status === 'available') {
      pulse.value = withRepeat(withSequence(withTiming(1.15, { duration: 900 }), withTiming(1, { duration: 900 })), -1, true);
    }
  }, [station.status]);

  const isFast = Math.max(...station.connectors.map((c) => c.powerKw)) >= 100;
  const color = STATUS_COLOR[station.status];

  const containerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(faded ? 0.25 : 1, { duration: 250 }),
    transform: [
      { scale: withTiming(selected ? 1.25 : 1, { duration: 200 }) },
      { scale: pressScale.value },
    ],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.35,
  }));

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { left: `${station.x * 100}%`, top: `${station.y * 100}%` },
        containerStyle,
      ]}
      pointerEvents={faded ? 'none' : 'auto'}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          pressScale.value = withSpring(1.15, { damping: 10 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1, { damping: 10 });
        }}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`${station.name}, ${station.status === 'available' ? 'disponível' : station.status === 'busy' ? 'ocupada' : 'indisponível'}`}
        accessibilityHint="Toque para ver detalhes do ponto de recarga"
      >
        {station.status === 'available' && (
          <Animated.View style={[styles.pulse, { backgroundColor: color }, pulseStyle]} />
        )}
        <View style={[styles.pin, { backgroundColor: color, borderColor: colors.surface }]}>
          <Ionicons name={isFast ? 'flash' : 'battery-charging'} size={16} color={colors.onPrimary} />
        </View>
        <View style={[styles.pinTail, { borderTopColor: color }]} />
      </Pressable>
    </Animated.View>
  );
}

const PIN_SIZE = 32;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -PIN_SIZE / 2,
    marginTop: -PIN_SIZE,
  },
  pulse: {
    position: 'absolute',
    top: 0,
    width: PIN_SIZE,
    height: PIN_SIZE,
    borderRadius: PIN_SIZE / 2,
  },
  pin: {
    width: PIN_SIZE,
    height: PIN_SIZE,
    borderRadius: PIN_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
});
