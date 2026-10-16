import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Estacao, ROTULOS_COMODIDADE } from '../tipos';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { usarFiltros } from '../contexto/ContextoFiltro';
import { usarFavoritos } from '../contexto/ContextoFavoritos';
import { usarAvaliacoes } from '../contexto/ContextoAvaliacoes';
import { conectoresCorrespondentes, statusDosConectores } from '../utilitarios/filtrarEstacoes';
import { resumoAvaliacoes } from '../utilitarios/avaliacoes';
import { Texto } from './Texto';
import { FotoPosto } from './VisualFlui';
import { Conector, StatusConector, corStatus, iconeStatus, usarCoresTela } from './AssinaturaFlui';

export function ImagemPosto({ station }: { station: Estacao }) {
  return <FotoPosto id={station.id} />;
}

const rot = (s: string) => (s === 'available' ? 'disponível' : s === 'busy' ? 'ocupado' : 'fora de serviço');

/* Cartao do posto da prancha r7: foto do local, potencia em numero leve, conectores em segmentos e rodape com extras. */
export function CartaoEstacao({ station, onPress, nivelTitulo = 3 }: { station: Estacao; onPress: () => void; index?: number; nivelTitulo?: 2 | 3 }) {
  const { usuario } = usarAutenticacao();
  const { filters } = usarFiltros();
  const { ehFavorito, alternarFavorito } = usarFavoritos();
  const { reviews } = usarAvaliacoes();
  const { cartao, bordaCartao } = usarCoresTela();
  const cs = conectoresCorrespondentes(station, filters, usuario?.tipoConector);
  const status = statusDosConectores(cs);
  const rating = resumoAvaliacoes(reviews, station.id);
  const favorito = ehFavorito(station.id);
  const max = cs.length ? Math.max(...cs.map((c) => c.powerKw)) : null;
  const st = (!cs.length ? 'offline' : status) as StatusConector;
  const label = !cs.length ? 'Fora dos filtros' : status === 'available' ? 'Conector disponível' : status === 'busy' ? 'Conector ocupado' : 'Fora de serviço';
  const cor = corStatus[st];
  return (
    <View testID="flui-station-card" style={{ backgroundColor: cartao, borderRadius: 24, padding: 16, gap: 12, borderWidth: 1, borderColor: bordaCartao }}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <View style={{ width: 84, flexShrink: 0 }}>
          <FotoPosto id={station.id} style={{ height: 84, borderRadius: 16 }} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Texto accessibilityRole="header" aria-level={nivelTitulo} style={{ fontSize: 17, fontWeight: '600', letterSpacing: -0.2, color: '#1B1A20' }}>{station.name}</Texto>
          <Texto style={{ fontSize: 12, color: '#4E4C58', marginTop: 2 }}>{station.address}</Texto>
          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
            <Ionicons name={iconeStatus[st]} size={14} color={cor} />
            <Texto style={{ fontSize: 12, fontWeight: '600', color: cor }}>{label}</Texto>
          </View>
        </View>
        <Pressable accessibilityRole="checkbox" accessibilityLabel={`Salvar ${station.name}`} accessibilityState={{ checked: favorito }} aria-checked={favorito} onPress={() => alternarFavorito(station.id)} style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F5FB', opacity: pressed ? 0.75 : 1 })}>
          <Ionicons name={favorito ? 'bookmark' : 'bookmark-outline'} size={20} color="#5B2BBF" />
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'baseline' }}>
          <Texto escalaMax={1.15} style={{ fontSize: 30, fontWeight: '300', letterSpacing: -1, color: '#1B1A20', fontVariant: ['tabular-nums'] }}>{max != null ? String(max) : '—'}</Texto>
          <Texto style={{ fontSize: 12, color: '#4E4C58' }}>{max != null ? 'kW nos filtros' : 'Confira conectores'}</Texto>
        </View>
        <Texto style={{ fontSize: 12, fontWeight: '600', color: '#1B1A20' }}>{station.is24h ? 'Aberto 24 horas' : station.openHours}</Texto>
      </View>
      {cs.length ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {cs.map((c) => <Conector key={c.id} tipo={c.type} status={c.status as StatusConector} rotulo={`${c.powerKw} kW · ${rot(c.status)}`} />)}
        </View>
      ) : null}
      <View style={{ borderTopWidth: 1, borderTopColor: '#E2E0F0', paddingTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <View style={{ flex: 1, minWidth: 105, gap: 3 }}>
          <Texto style={{ fontSize: 11, color: '#4E4C58' }}>{station.amenities.slice(0, 3).map((a) => ROTULOS_COMODIDADE[a]).join(' · ')}</Texto>
          <Texto style={{ fontSize: 11, fontWeight: '600', color: '#1B1A20' }}>{rating.nota != null ? `${rating.nota.toFixed(1).replace('.', ',')} ★ · ${rating.quantidade} ${rating.quantidade === 1 ? 'avaliação' : 'avaliações'}` : 'Ainda sem avaliações'}</Texto>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={`Ver posto ${station.name}`} onPress={onPress} style={({ pressed }) => ({ minHeight: 44, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#E6DCFF', flexDirection: 'row', gap: 8, alignItems: 'center', opacity: pressed ? 0.85 : 1 })}>
          <Texto style={{ fontSize: 13, fontWeight: '600', color: '#5B2BBF' }}>Ver ficha</Texto>
          <Ionicons name="arrow-forward" size={16} color="#5B2BBF" />
        </Pressable>
      </View>
    </View>
  );
}
