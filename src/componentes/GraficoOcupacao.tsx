import React from 'react';
import { View } from 'react-native';
import { Texto } from './Texto';

/* Ocupacao ilustrativa dentro de cartao claro: barras em energia, pico em energia escura. */
export function GraficoOcupacao({ occupancy }: { occupancy: number[] }) {
  if (occupancy.length !== 24 || occupancy.some((n) => !Number.isFinite(n)))
    return <Texto style={{ color: '#4E4C58', fontSize: 14 }}>Curva de ocupação não informada.</Texto>;
  const pico = Math.max(...occupancy);
  return (
    <View style={{ gap: 10 }}>
      <View accessible accessibilityRole="image" accessibilityLabel={'Ocupação ilustrativa por hora: ' + occupancy.map((n, h) => `${h} horas, ${Math.round(n * 100)} por cento`).join('; ')} style={{ height: 90, flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
        {occupancy.map((n, h) => (
          <View key={h} style={{ flex: 1, height: Math.max(4, Math.min(1, Math.max(0, n)) * 85), backgroundColor: n === pico ? '#5B2BBF' : '#8B4DF0', borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {['00h', '06h', '12h', '18h', '23h'].map((l) => (
          <Texto key={l} style={{ fontSize: 11, color: '#4E4C58' }}>{l}</Texto>
        ))}
      </View>
      <Texto style={{ fontSize: 12, lineHeight: 17, color: '#4E4C58' }}>Curva de exemplo. Não é uma previsão de fila ou disponibilidade em tempo real.</Texto>
    </View>
  );
}
