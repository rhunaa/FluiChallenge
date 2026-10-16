import React, { useId, useMemo, useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Estacao } from '../tipos';
import { estacoes as todas } from '../dados/estacoes';
import { usarTema } from '../contexto/ContextoTema';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { usarFiltros } from '../contexto/ContextoFiltro';
import { conectoresCorrespondentes, statusDosConectores } from '../utilitarios/filtrarEstacoes';
import { Texto } from './Texto';

interface Props {
  estacoes: Estacao[];
  selectedId?: string;
  fadedIds?: string[];
  onSelectStation: (id: string) => void;
  altura?: number;
}

/* Mapa ilustrativo da prancha r7: rio, parque e vias desenhados; pinos em pilula com a potencia; selecionado em energia. */
export function MapaEstilizado({ estacoes, selectedId, fadedIds = [], onSelectStation, altura = 520 }: Props) {
  const [width, setWidth] = useState(393);
  const { colors, modo, fontScale } = usarTema();
  const janela = useWindowDimensions();
  /* Em tela estreita ou com fonte grande, o pino selecionado mostra so a potencia, para caber inteiro na tela; o nome segue no painel abaixo do mapa e no nome acessivel. */
  const compacto = janela.width < 380 || fontScale > 1.2;
  const largSel = compacto ? 130 : 236;
  const escuro = modo === 'dark';
  const { usuario } = usarAutenticacao();
  const { filters } = usarFiltros();
  const p = 'mp' + useId().replace(/[^a-z0-9]/gi, '');
  const b = useMemo(() => ({ minLat: Math.min(...todas.map((s) => s.lat)), maxLat: Math.max(...todas.map((s) => s.lat)), minLng: Math.min(...todas.map((s) => s.lng)), maxLng: Math.max(...todas.map((s) => s.lng)) }), []);
  const topo = Math.round(altura * 0.34);
  const base = altura - 96;
  const lista = estacoes.filter((s) => !fadedIds.includes(s.id));
  /* Ordem fixa dos pinos (teclado e leitor de tela); o selecionado sobe só por camada. */
  const ordenada = lista;
  /* Halo do pino selecionado, como na prancha (só no escuro), na mesma posição calculada para o pino. */
  const selecionada = escuro ? lista.find((s) => s.id === selectedId) : undefined;
  const haloFx = selecionada ? (selecionada.lng - b.minLng) / (b.maxLng - b.minLng || 1) : 0;
  const haloFy = selecionada ? (b.maxLat - selecionada.lat) / (b.maxLat - b.minLat || 1) : 0;
  const halo = selecionada ? { cx: Math.max(10, Math.min(width - largSel - 10, 14 + haloFx * (width - 28 - 80))) + Math.round((largSel * 100) / 236), cy: topo + haloFy * (base - topo) + 15 } : null;
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="Selecionar posto no mapa ilustrativo" onLayout={(e) => { const w = e.nativeEvent.layout.width; if (w > 80) setWidth(w); }} style={{ height: altura, overflow: 'hidden', backgroundColor: colors.mapBase }}>
      <Svg pointerEvents="none" aria-hidden={true} focusable={false} width="100%" height="100%" viewBox="0 0 393 600" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <RadialGradient id={`${p}t`} cx="393" cy="0" r="320" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#8B4DF0" stopOpacity={escuro ? 0.42 : 0} />
            <Stop offset="0.55" stopColor="#8B4DF0" stopOpacity={escuro ? 0.12 : 0} />
            <Stop offset="1" stopColor="#8B4DF0" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="393" height="600" fill={colors.mapBase} />
        <Path d="M300 0 C 270 120, 330 210, 300 330 S 240 520, 270 600" stroke={colors.mapRiver} strokeWidth={38} fill="none" />
        <Rect x="40" y="300" width="120" height="86" rx="18" fill={colors.mapPark} />
        <Path d="M0 160 H393 M0 420 H393 M120 0 V600 M200 0 V600 M0 520 L393 470 M20 0 L90 600" stroke={colors.mapRoadMinor} strokeWidth={5} fill="none" />
        <Path d="M-10 280 C 120 260, 230 300, 410 250 M170 -10 C 160 200, 190 380, 150 610 M-10 560 C 140 520, 260 540, 410 500" stroke={colors.mapRoad} strokeWidth={13} strokeLinecap="round" fill="none" />
        <Rect x="0" y="0" width="393" height="600" fill={`url(#${p}t)`} />
      </Svg>
      {halo ? (
        <Svg pointerEvents="none" aria-hidden={true} focusable={false} width={width} height={altura} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Defs>
            <RadialGradient id={`${p}s`} cx={halo.cx} cy={halo.cy} r={160} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#8B4DF0" stopOpacity={0.55} />
              <Stop offset="0.5" stopColor="#8B4DF0" stopOpacity={0.18} />
              <Stop offset="1" stopColor="#8B4DF0" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={altura} fill={`url(#${p}s)`} />
        </Svg>
      ) : null}
      {ordenada.map((s) => {
        const cs = conectoresCorrespondentes(s, filters, usuario?.tipoConector);
        const status = statusDosConectores(cs);
        const sel = selectedId === s.id;
        const kw = Math.max(...(cs.length ? cs : s.connectors).map((c) => c.powerKw));
        const fx = (s.lng - b.minLng) / (b.maxLng - b.minLng || 1);
        const fy = (b.maxLat - s.lat) / (b.maxLat - b.minLat || 1);
        const larg = sel ? largSel : 80;
        const left = Math.max(10, Math.min(width - larg - 10, 14 + fx * (width - 28 - 80)));
        const top = topo + fy * (base - topo);
        const fora = status === 'offline';
        const fundo = sel ? '#8B4DF0' : fora ? (escuro ? '#2F2E35' : '#FFFFFF') : escuro ? '#EEEDF8' : '#242428';
        const corTexto = sel ? '#FFFFFF' : fora ? (escuro ? '#C9C6DA' : '#5E5B6B') : escuro ? '#1B1A20' : '#EEEDF8';
        const ponto = status === 'available' ? (escuro ? '#177044' : '#C0F589') : escuro ? '#8A5300' : '#F5C46B';
        return (
          <Pressable key={s.id} accessibilityRole="radio" accessibilityLabel={`${s.name}, ${status === 'available' ? 'conector disponível' : status === 'busy' ? 'conector ocupado' : 'fora de serviço'}, demonstração`} accessibilityState={{ checked: sel }} aria-checked={sel} onPress={() => onSelectStation(s.id)} style={{ position: 'absolute', left, top: top - 7, minHeight: 44, justifyContent: 'center', maxWidth: width - 20, zIndex: sel ? 2 : 1 }}>
            {sel ? <View style={{ position: 'absolute', left: 22, bottom: -3, width: 12, height: 12, backgroundColor: '#8B4DF0', transform: [{ rotate: '45deg' }] }} /> : null}
            <View style={{ height: sel ? 38 : 30, paddingHorizontal: sel ? 14 : 11, borderRadius: 999, backgroundColor: fundo, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: fora && !sel ? 1 : 0, borderColor: '#858293', shadowColor: sel ? '#8B4DF0' : '#000000', shadowOffset: { width: 0, height: sel ? 0 : 4 }, shadowOpacity: sel ? 0.6 : escuro ? 0.45 : 0.22, shadowRadius: sel ? 18 : 10 }}>
              {sel ? <Ionicons name="flash" size={13} color="#FFFFFF" /> : fora ? <View style={{ width: 9, height: 9, borderRadius: 5, borderWidth: 2, borderColor: escuro ? '#C9C6DA' : '#5E5B6B' }} /> : <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: ponto }} />}
              <Texto numberOfLines={1} style={{ fontSize: sel ? 13 : 12, fontWeight: '600', color: corTexto, fontVariant: ['tabular-nums'], flexShrink: 1 }}>{sel && !compacto ? `${kw} kW · ${s.name}` : `${kw} kW`}</Texto>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
