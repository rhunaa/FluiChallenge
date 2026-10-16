import React, { useId } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { usarTema } from '../contexto/ContextoTema';
import { ClimaFundo, fundoVivo } from '../tema/tema';

/* Fundo vivo da prancha r7: degrade do clima, ate 2 brilhos, linhas de fluxo e faisca. Nao recebe toque nem foco. */
export function FundoFlui({ clima = 'padrao' }: { clima?: ClimaFundo }) {
  const { modo } = usarTema();
  const p = 'fv' + useId().replace(/[^a-z0-9]/gi, '');
  const C = fundoVivo.cores[modo];
  const cfg = fundoVivo.climas[clima];
  const { largura: W, altura: H } = fundoVivo.quadro;
  const L = fundoVivo.linhas;
  const fy = cfg.faisca ? cfg.faisca.y + (cfg.linhasDy || 0) : 0;
  return (
    <View testID="flui-fundo" pointerEvents="none" aria-hidden={true} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', backgroundColor: C.base }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMin slice" focusable={false}>
        <Defs>
          <LinearGradient id={`${p}b`} x1="0" y1="0" x2="0" y2={H} gradientUnits="userSpaceOnUse">
            <Stop offset={cfg.paradas[0]} stopColor={C.topo} />
            <Stop offset={cfg.paradas[1]} stopColor={C.meio} />
            <Stop offset={cfg.paradas[2]} stopColor={C.base} />
          </LinearGradient>
          {cfg.brilhos.map((b, i) => (
            <RadialGradient key={i} id={`${p}a${i}`} cx={b.x} cy={b.y} r={b.r} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={C[b.cor]} stopOpacity={b.opacidade[modo]} />
              <Stop offset="0.55" stopColor={C[b.cor]} stopOpacity={Number((b.opacidade[modo] * 0.38).toFixed(3))} />
              <Stop offset="1" stopColor={C[b.cor]} stopOpacity={0} />
            </RadialGradient>
          ))}
          <RadialGradient id={`${p}f`} cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor={C.lima} stopOpacity={modo === 'dark' ? 0.55 : 0.7} />
            <Stop offset="1" stopColor={C.lima} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={W} height={H} fill={`url(#${p}b)`} />
        {cfg.brilhos.map((b, i) => (b.opacidade[modo] > 0 ? <Rect key={i} x="0" y="0" width={W} height={H} fill={`url(#${p}a${i})`} /> : null))}
        {cfg.linhasDy !== null ? (
          <G transform={`translate(0 ${cfg.linhasDy})`}>
            {L.deslocamentos.map((dy, i) => (
              <Path key={i} d={L.curva} transform={`translate(0 ${dy})`} fill="none" stroke={C.linha} strokeLinecap="round" strokeWidth={L.larguras[i]} opacity={L.opacidade[modo][i]} />
            ))}
          </G>
        ) : null}
        {cfg.faisca ? <Circle cx={cfg.faisca.x} cy={fy} r={16} fill={`url(#${p}f)`} /> : null}
        {cfg.faisca ? <Circle cx={cfg.faisca.x} cy={fy} r={4.2} fill={C.lima} stroke={modo === 'dark' ? 'none' : '#242428'} strokeWidth={modo === 'dark' ? 0 : 1.4} /> : null}
      </Svg>
    </View>
  );
}
