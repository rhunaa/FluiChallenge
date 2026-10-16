import React, { useId } from 'react';
import { Pressable, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Ellipse, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Texto } from './Texto';
import { VeiculoFlui } from './VisualFlui';
import { usarTema } from '../contexto/ContextoTema';

export type StatusConector = 'available' | 'busy' | 'offline';
export const corStatus: Record<StatusConector, string> = { available: '#177044', busy: '#8A5300', offline: '#5E5B6B' };
export const corStatusPalco: Record<StatusConector, string> = { available: '#C0F589', busy: '#F5C46B', offline: '#A9A6B8' };
export const iconeStatus: Record<StatusConector, keyof typeof Ionicons.glyphMap> = { available: 'checkmark-circle', busy: 'time-outline', offline: 'remove-circle-outline' };

/* Cores da tela na prancha r7: texto e cartao mudam com o modo; palco e dock sao grafite nos dois modos. */
export function usarCoresTela() {
  const { colors, modo } = usarTema();
  const escuro = modo === 'dark';
  return {
    escuro,
    txt: colors.textOnDark,
    txt2: colors.textOnDarkMuted,
    cartao: colors.card,
    bordaCartao: escuro ? 'transparent' : '#E2E0F0',
    energia: colors.energyText,
    fio: escuro ? 'rgba(238,237,248,0.14)' : '#D6D3E6',
    controle: colors.control,
    controleBorda: colors.controlBorder,
    controleTexto: colors.controlText,
    controleTextoSuave: colors.controlTextMuted,
    erro: escuro ? '#FF8FA6' : '#B42343',
  };
}

/* Palco: superficie grafite com o brilho roxo no canto e a nevoa lima embaixo. */
export function Palco({ children, style, testID }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; testID?: string }) {
  const { escuro } = usarCoresTela();
  const p = 'pl' + useId().replace(/[^a-z0-9]/gi, '');
  return (
    <View testID={testID} style={[{ borderRadius: 32, padding: 18, gap: 12, overflow: 'hidden', borderWidth: 1, borderColor: escuro ? 'rgba(201,182,255,0.16)' : 'rgba(238,237,248,0.07)', backgroundColor: escuro ? 'rgba(36,36,40,0.80)' : '#242428' }, style]}>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" focusable={false}>
          <Defs>
            <RadialGradient id={`${p}e`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 0) scale(120 80)">
              <Stop offset="0" stopColor="#8B4DF0" stopOpacity={escuro ? 0.42 : 0.4} />
              <Stop offset="0.6" stopColor="#8B4DF0" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id={`${p}l`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 100) scale(80 60)">
              <Stop offset="0" stopColor="#C0F589" stopOpacity={0.12} />
              <Stop offset="0.62" stopColor="#C0F589" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100" height="100" fill={`url(#${p}e)`} />
          <Rect x="0" y="0" width="100" height="100" fill={`url(#${p}l)`} />
        </Svg>
      </View>
      {children}
    </View>
  );
}

export function Overline({ children, cor = '#A9A6B8', espaco = 1.6, style }: { children: React.ReactNode; cor?: string; espaco?: number; style?: StyleProp<TextStyle> }) {
  return <Texto style={[{ fontSize: 10.5, fontWeight: '600', letterSpacing: espaco, textTransform: 'uppercase', color: cor }, style]}>{children}</Texto>;
}

/* Numero heroi: peso leve, algarismos tabulares; a escala de fonte para em 1,15 para nao estourar o palco. */
export function Numero({ valor, unidade, tamanho = 40, cor = '#EEEDF8', corUnidade = '#A9A6B8', tamanhoUnidade = 15, espaco = -1.2 }: { valor: string; unidade?: string; tamanho?: number; cor?: string; corUnidade?: string; tamanhoUnidade?: number; espaco?: number }) {
  return (
    <Texto escalaMax={1.15} style={{ fontSize: tamanho, fontWeight: '300', letterSpacing: espaco, color: cor, fontVariant: ['tabular-nums'], lineHeight: Math.round(tamanho * 1.08) }}>
      {valor}
      {unidade ? <Texto escalaMax={1.15} style={{ fontSize: tamanhoUnidade, fontWeight: '500', color: corUnidade, letterSpacing: 0 }}>{unidade}</Texto> : null}
    </Texto>
  );
}

export function Faixa({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(238,237,248,0.10)' }}>{children}</View>;
}

export function SeparadorFaixa() {
  return <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(238,237,248,0.12)' }} />;
}

export function Segmentos({ total = 24, cheios }: { total?: number; cheios: number }) {
  return (
    <View aria-hidden={true} style={{ flexDirection: 'row', gap: 3 }}>
      {Array.from({ length: total }, (_, i) => <View key={i} style={{ flex: 1, height: 6, borderRadius: 2, backgroundColor: i < cheios ? '#C9B6FF' : '#46434F' }} />)}
    </View>
  );
}

/* Carro no palco: luz no chao e a linha de energia, como na prancha. */
export function CarroPalco({ altura = 112 }: { altura?: number }) {
  const p = 'lz' + useId().replace(/[^a-z0-9]/gi, '');
  return (
    <View style={{ marginTop: -4, marginHorizontal: -4, marginBottom: -6 }}>
      <View pointerEvents="none" style={{ position: 'absolute', left: '10%', right: '10%', bottom: 4, height: 34 }}>
        <Svg width="100%" height="100%" viewBox="0 0 100 34" preserveAspectRatio="none" focusable={false}>
          <Defs>
            <RadialGradient id={p} cx="0.5" cy="0.5" r="0.5">
              <Stop offset="0" stopColor="#C9B6FF" stopOpacity={0.34} />
              <Stop offset="1" stopColor="#C9B6FF" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx="50" cy="17" rx="50" ry="17" fill={`url(#${p})`} />
        </Svg>
      </View>
      <VeiculoFlui altura={altura} />
      <LinearGradient colors={['rgba(139,77,240,0)', '#8B4DF0', '#C9B6FF', 'rgba(201,182,255,0)']} locations={[0, 0.28, 0.72, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 2, marginHorizontal: 22, borderRadius: 2 }} />
    </View>
  );
}

/* Capitulo: numero em energia, titulo e fio ate a borda. */
export function Capitulo({ num, titulo }: { num: string; titulo: string }) {
  const { energia, txt, fio } = usarCoresTela();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
      <Texto style={{ fontSize: 12, fontWeight: '600', letterSpacing: 1.4, color: energia, fontVariant: ['tabular-nums'] }}>{num}</Texto>
      <Texto accessibilityRole="header" aria-level={2} style={{ fontSize: 17, fontWeight: '600', letterSpacing: -0.2, color: txt, flexShrink: 1 }}>{titulo}</Texto>
      <View style={{ flex: 1, minWidth: 12, height: 1, backgroundColor: fio }} />
    </View>
  );
}

export function Secao({ titulo, sub, acao }: { titulo: string; sub?: string; acao?: { label: string; onPress: () => void; nome?: string } }) {
  const { txt, txt2 } = usarCoresTela();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginTop: 4 }}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Texto accessibilityRole="header" aria-level={2} style={{ fontSize: 21, fontWeight: '600', letterSpacing: -0.3, color: txt }}>{titulo}</Texto>
        {sub ? <Texto style={{ fontSize: 14, lineHeight: 19, color: txt2, marginTop: 3 }}>{sub}</Texto> : null}
      </View>
      {acao ? (
        <Pressable accessibilityRole="button" accessibilityLabel={acao.nome ?? acao.label} onPress={acao.onPress} style={{ minHeight: 44, justifyContent: 'center' }}>
          <Texto style={{ fontSize: 13, fontWeight: '600', color: txt }}>{acao.label}</Texto>
        </Pressable>
      ) : null}
    </View>
  );
}

/* Segmento de conector: faixa de status no topo, tipo, potencia e estado escrito. */
export function Conector({ tipo, potencia, status, rotulo, grande = false, fundo }: { tipo: string; potencia?: number; status: StatusConector; rotulo: string; grande?: boolean; fundo?: string }) {
  const { escuro } = usarCoresTela();
  const cor = corStatus[status];
  return (
    <View style={{ flex: 1, minWidth: 0, borderRadius: grande ? 16 : 12, backgroundColor: fundo ?? (grande ? (escuro ? '#EEEDF8' : '#FFFFFF') : '#F6F5FB'), paddingVertical: grande ? 12 : 8, paddingHorizontal: grande ? 14 : 10, gap: 3, borderWidth: grande && !escuro ? 1 : 0, borderColor: '#E2E0F0', borderTopWidth: 4, borderTopColor: cor }}>
      <Texto numberOfLines={1} style={{ fontSize: 12, fontWeight: '600', color: '#1B1A20' }}>{tipo}</Texto>
      {grande && potencia != null ? <Numero valor={String(potencia)} unidade=" kW" tamanho={30} cor="#1B1A20" corUnidade="#4E4C58" tamanhoUnidade={13} espaco={-1} /> : null}
      <Texto style={{ fontSize: 11, fontWeight: '600', color: cor }}>{rotulo}</Texto>
    </View>
  );
}
