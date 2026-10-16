import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Texto } from './Texto';
import { LocalProximo, ROTULOS_COMODIDADE } from '../tipos';
import { usarCoresTela } from './AssinaturaFlui';

const ICONE_CATEGORIA: Record<LocalProximo['category'], keyof typeof Ionicons.glyphMap> = {
  cafe: 'cafe-outline',
  food: 'fast-food-outline',
  shopping: 'bag-outline',
};

/* Local proximo sem foto generica: bloco com o icone da categoria, no estilo dos cartoes r7. */
export function CartaoLocalProximo({ local, index = 0 }: { local: LocalProximo; index?: number }) {
  const { cartao, bordaCartao } = usarCoresTela();
  return (
    <Animated.View entering={FadeInRight.delay(index * 70).duration(240)} accessible accessibilityLabel={`${local.name}, ${ROTULOS_COMODIDADE[local.category]}, a ${local.walkMin} minutos a pé, avaliação ${local.rating.toFixed(1)}`} style={{ width: 160, marginRight: 12, borderRadius: 24, overflow: 'hidden', backgroundColor: cartao, borderWidth: 1, borderColor: bordaCartao }}>
      <View style={{ height: 90, backgroundColor: '#E6DCFF', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={ICONE_CATEGORIA[local.category]} size={28} color="#5B2BBF" />
      </View>
      <View style={{ padding: 12, gap: 4 }}>
        <Texto numberOfLines={1} style={{ fontSize: 13, fontWeight: '600', color: '#1B1A20' }}>{local.name}</Texto>
        <Texto numberOfLines={1} style={{ fontSize: 11, color: '#4E4C58' }}>{ROTULOS_COMODIDADE[local.category]}</Texto>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="walk-outline" size={12} color="#4E4C58" />
          <Texto style={{ fontSize: 11, color: '#4E4C58' }}>{`${local.walkMin} min`}</Texto>
          <Ionicons name="star" size={12} color="#8A5300" style={{ marginLeft: 6 }} />
          <Texto style={{ fontSize: 11, color: '#4E4C58' }}>{local.rating.toFixed(1)}</Texto>
        </View>
      </View>
    </Animated.View>
  );
}
