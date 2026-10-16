import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Texto } from './Texto';
import { FotoPosto } from './VisualFlui';
import { usarCoresTela } from './AssinaturaFlui';
import { Estacao, SessaoRecarga } from '../tipos';
import { formatarDataHistorico } from '../dados/historico';

interface CartaoHistoricoProps {
  sessao: SessaoRecarga;
  station?: Estacao;
  onPress: () => void;
  index?: number;
}

type NomeIcone = React.ComponentProps<typeof Ionicons>['name'];

/* Histórico r7: cartão claro com a foto do local do posto; sem imagens genéricas. */
export function CartaoHistorico({ sessao, station, onPress, index = 0 }: CartaoHistoricoProps) {
  const { cartao, bordaCartao } = usarCoresTela();
  const metas: { icone: NomeIcone; texto: string }[] = [
    { icone: 'flash-outline', texto: `${sessao.energyKwh.toFixed(1)} kWh` },
    { icone: 'hourglass-outline', texto: `${sessao.durationMin} min` },
    { icone: 'pricetag-outline', texto: `R$ ${sessao.cost.toFixed(2)}` },
    { icone: 'ellipse-outline', texto: sessao.connectorType },
  ];
  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(240)}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Recarga em ${station?.name ?? 'posto'} em ${formatarDataHistorico(sessao.date)}, ${sessao.energyKwh} quilowatt-hora, ${sessao.durationMin} minutos, custou ${sessao.cost.toFixed(2)} reais`}
        accessibilityHint="Toque para ver a ficha do ponto de recarga"
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          padding: 14,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: bordaCartao,
          backgroundColor: cartao,
          opacity: pressed ? 0.88 : 1,
        })}
      >
        {station ? (
          <FotoPosto
            id={station.id}
            legenda={false}
            style={{ width: 56, height: 56, borderRadius: 16 }}
          />
        ) : (
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: '#E6DCFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="time-outline" size={22} color="#5B2BBF" />
          </View>
        )}
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Texto
              numberOfLines={1}
              style={{ flex: 1, fontSize: 16, fontWeight: '600', letterSpacing: -0.2, color: '#1B1A20' }}
            >
              {station?.name ?? 'Posto removido'}
            </Texto>
            <Texto style={{ fontSize: 12, color: '#5F5D69' }}>
              {formatarDataHistorico(sessao.date)}
            </Texto>
          </View>
          <Texto numberOfLines={1} style={{ fontSize: 13, color: '#4E4C58' }}>
            {station?.address}
          </Texto>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
            {metas.map((m) => (
              <View key={m.icone} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name={m.icone} size={12} color="#5B2BBF" />
                <Texto style={{ fontSize: 12, fontWeight: '600', color: '#4E4C58' }}>{m.texto}</Texto>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
