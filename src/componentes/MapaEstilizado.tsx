import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../tema/tema';
import { Estacao } from '../tipos';
import { PinoMapa } from './PinoMapa';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CANVAS_W = SCREEN_W * 1.6;
const CANVAS_H = SCREEN_H * 1.5;
const MIN_SCALE = 1;
const MAX_SCALE = 2.4;

interface MapaEstilizadoProps {
  estacoes: Estacao[];
  selectedId: string | null;
  fadedIds: Set<string>;
  onSelectStation: (id: string) => void;
}

// OBS: esta é a superfície estilizada (com pan/zoom) usada como alternativa
// ao mapa real na versão web — o mapa nativo de verdade (Google Maps) fica
// em MapaGoogle.native.tsx, já usando os mesmos lat/lng das estações.
export function MapaEstilizado({ estacoes, selectedId, fadedIds, onSelectStation }: MapaEstilizadoProps) {
  const translateX = useSharedValue(-(CANVAS_W - SCREEN_W) / 2);
  const translateY = useSharedValue(-(CANVAS_H - SCREEN_H) / 2.4);
  const scale = useSharedValue(1);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startScale = useSharedValue(1);

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      const maxX = 0;
      const minX = -(CANVAS_W * scale.value - SCREEN_W);
      const maxY = 0;
      const minY = -(CANVAS_H * scale.value - SCREEN_H);
      translateX.value = clamp(startX.value + e.translationX, minX, maxX);
      translateY.value = clamp(startY.value + e.translationY, minY, maxY);
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = clamp(startScale.value * e.scale, MIN_SCALE, MAX_SCALE);
    })
    .onEnd(() => {
      scale.value = withTiming(clamp(scale.value, MIN_SCALE, MAX_SCALE));
    });

  const composed = Gesture.Simultaneous(pan, pinch);

  const canvasStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.viewport}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.canvas, canvasStyle]}>
          <RoadNetwork />
          {estacoes.map((station) => (
            <PinoMapa
              key={station.id}
              station={station}
              selected={selectedId === station.id}
              faded={fadedIds.has(station.id)}
              onPress={() => onSelectStation(station.id)}
            />
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function RoadNetwork() {
  const verticalRoads = [0.12, 0.3, 0.5, 0.7, 0.88];
  const horizontalRoads = [0.15, 0.35, 0.55, 0.72, 0.9];

  return (
    <Svg width={CANVAS_W} height={CANVAS_H} style={StyleSheet.absoluteFill}>
      <Rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill={colors.mapBase} />
      {verticalRoads.map((v, i) => (
        <Line
          key={`v-${i}`}
          x1={v * CANVAS_W}
          y1={0}
          x2={v * CANVAS_W}
          y2={CANVAS_H}
          stroke={i % 2 === 0 ? colors.mapRoad : colors.mapRoadMinor}
          strokeWidth={i % 2 === 0 ? 10 : 5}
        />
      ))}
      {horizontalRoads.map((h, i) => (
        <Line
          key={`h-${i}`}
          x1={0}
          y1={h * CANVAS_H}
          x2={CANVAS_W}
          y2={h * CANVAS_H}
          stroke={i % 2 === 0 ? colors.mapRoad : colors.mapRoadMinor}
          strokeWidth={i % 2 === 0 ? 10 : 5}
        />
      ))}
      {verticalRoads.map((v, i) =>
        horizontalRoads.map((h, j) => (
          <Circle key={`n-${i}-${j}`} cx={v * CANVAS_W} cy={h * CANVAS_H} r={2.5} fill={colors.mapRoadMinor} />
        )),
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.mapBase,
  },
  canvas: {
    width: CANVAS_W,
    height: CANVAS_H,
  },
});
