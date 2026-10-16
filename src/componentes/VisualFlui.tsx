import React, { useId } from 'react';
import { ImageStyle, StyleProp } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { FotoLugar } from './FotoLugar';
import { fotosLugares } from '../dados/fotosLugares';

export function FotoPosto({ id, style, legenda = true }: { id: string; style?: StyleProp<ImageStyle>; legenda?: boolean }) {
  return <FotoLugar id={id} style={style} legenda={legenda} referencia={fotosLugares[id]?.arquivo} fallback={<VeiculoFlui compact />} />;
}

/* Carro r7 aprovado: geometria convertida da prancha sem redesenho; olha para a direita, ligado ao carregador. */
export function VeiculoFlui({ compact = false, altura }: { compact?: boolean; altura?: number }) {
  const p = 'car' + useId().replace(/[^a-z0-9]/gi, '');
  return (
    <Svg width="100%" height={altura ?? (compact ? 125 : 190)} viewBox="0 0 500 245" aria-hidden={true} focusable={false}>
<Defs>
<LinearGradient id={`${p}-lataria`} x1="0" y1="96" x2="0" y2="202" gradientUnits="userSpaceOnUse">
<Stop offset="0" stopColor="#FFFFFF" />
<Stop offset="0.26" stopColor="#EFEEF8" />
<Stop offset="0.40" stopColor="#CBC8DD" />
<Stop offset="0.52" stopColor="#F3F2FA" />
<Stop offset="0.64" stopColor="#B7B4CB" />
<Stop offset="0.82" stopColor="#6E6B85" />
<Stop offset="1" stopColor="#34323F" />
</LinearGradient>
<LinearGradient id={`${p}-faixa`} x1="0" y1="182" x2="0" y2="200" gradientUnits="userSpaceOnUse">
<Stop offset="0" stopColor="#3A3846" />
<Stop offset="1" stopColor="#141319" />
</LinearGradient>
<LinearGradient id={`${p}-teto`} x1="0" y1="76" x2="0" y2="128" gradientUnits="userSpaceOnUse">
<Stop offset="0" stopColor="#55546B" />
<Stop offset="0.35" stopColor="#2A2933" />
<Stop offset="1" stopColor="#0E0D13" />
</LinearGradient>
<LinearGradient id={`${p}-vidro`} x1="0" y1="84" x2="0" y2="124" gradientUnits="userSpaceOnUse">
<Stop offset="0" stopColor="#565B8C" />
<Stop offset="0.45" stopColor="#262C4B" />
<Stop offset="1" stopColor="#0A0E1D" />
</LinearGradient>
<LinearGradient id={`${p}-espelho`} x1="0" y1="117" x2="0" y2="126" gradientUnits="userSpaceOnUse">
<Stop offset="0" stopColor="#E9E7F4" />
<Stop offset="1" stopColor="#9D9AB2" />
</LinearGradient>
<LinearGradient id={`${p}-energia`} x1="170" y1="0" x2="338" y2="0" gradientUnits="userSpaceOnUse">
<Stop offset="0" stopColor="#8B4DF0" stopOpacity="0" />
<Stop offset="0.28" stopColor="#8B4DF0" />
<Stop offset="0.72" stopColor="#C9B6FF" />
<Stop offset="1" stopColor="#C9B6FF" stopOpacity="0" />
</LinearGradient>
<LinearGradient id={`${p}-cabo`} x1="52" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
<Stop offset="0" stopColor="#C0F589" />
<Stop offset="0.5" stopColor="#C0F589" stopOpacity="0.95" />
<Stop offset="1" stopColor="#C0F589" stopOpacity="0" />
</LinearGradient>
<RadialGradient id={`${p}-aro`} cx="0.38" cy="0.32" r="0.8">
<Stop offset="0" stopColor="#B3B1C6" />
<Stop offset="0.55" stopColor="#6E6C82" />
<Stop offset="1" stopColor="#3A3947" />
</RadialGradient>
<RadialGradient id={`${p}-sombra`} cx="0.5" cy="0.5" r="0.5">
<Stop offset="0" stopColor="#000000" stopOpacity="0.6" />
<Stop offset="1" stopColor="#000000" stopOpacity="0" />
</RadialGradient>
<RadialGradient id={`${p}-farol`} cx="0.5" cy="0.5" r="0.5">
<Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.8" />
<Stop offset="0.5" stopColor="#C9B6FF" stopOpacity="0.3" />
<Stop offset="1" stopColor="#C9B6FF" stopOpacity="0" />
</RadialGradient>
<RadialGradient id={`${p}-lanterna`} cx="0.5" cy="0.5" r="0.5">
<Stop offset="0" stopColor="#FF5C7A" stopOpacity="0.55" />
<Stop offset="1" stopColor="#FF5C7A" stopOpacity="0" />
</RadialGradient>
<RadialGradient id={`${p}-plugue`} cx="0.5" cy="0.5" r="0.5">
<Stop offset="0" stopColor="#C0F589" stopOpacity="0.6" />
<Stop offset="1" stopColor="#C0F589" stopOpacity="0" />
</RadialGradient>
<ClipPath id={`${p}-corpo`}>
<Path d="M52 200C42 200 35 195 34 184L34 166C34 150 35 140 38 134C40 130 44 128 50 127C70 124 92 118 116 108C150 94 196 80 240 78C280 76 316 86 346 106C356 113 364 120 372 124C402 131.5 436 140.5 455 148C466 152.5 471.5 160 472.5 170C473.5 182 469 192 460 198C456 200 450 200 444 200L426.93 200A42 42 0 1 0 353.07 200L154.93 200A42 42 0 1 0 81.07 200Z" />
</ClipPath>
<ClipPath id={`${p}-janela`}>
<Path d="M354 122.6C345 116 333 106.5 322 100.5C300 88.5 270 84 240 84.2C205 84.5 168 93 140 106C132 110 126 114.5 122 118.8C190 122.6 290 124.6 354 122.6Z" />
</ClipPath>
<ClipPath id={`${p}-cabine`}>
<Path d="M94.9 116C101.8 113.6 108.8 111 116 108C150 94 196 80 240 78C280 76 316 86 346 106C356 113 364 120 372 124C330 127.5 200 127.5 130 122C115 121 102 118.6 94.9 116Z" />
</ClipPath>
</Defs>
<Ellipse cx="254" cy="213" rx="238" ry="11" fill={`url(#${p}-sombra)`} />
<Ellipse cx="254" cy="207" rx="170" ry="6" fill={`url(#${p}-sombra)`} />
<Ellipse cx="118" cy="213.5" rx="41" ry="4.6" fill={`url(#${p}-sombra)`} />
<Ellipse cx="390" cy="213.5" rx="41" ry="4.6" fill={`url(#${p}-sombra)`} />
<Path d="M52 200C42 200 35 195 34 184L34 166C34 150 35 140 38 134C40 130 44 128 50 127C70 124 92 118 116 108C150 94 196 80 240 78C280 76 316 86 346 106C356 113 364 120 372 124C402 131.5 436 140.5 455 148C466 152.5 471.5 160 472.5 170C473.5 182 469 192 460 198C456 200 450 200 444 200L426.93 200A42 42 0 1 0 353.07 200L154.93 200A42 42 0 1 0 81.07 200Z" fill={`url(#${p}-lataria)`} />
<G clipPath={`url(#${p}-corpo)`} fill="none" strokeLinecap="round">
<Path d="M0 189C100 183 320 181 500 192L500 245L0 245Z" fill={`url(#${p}-faixa)`} stroke="none" />
<Path d="M98 120.2C112 123.2 120 124.7 132 125.2C200 130.4 330 130.6 370 126.6" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="1.3" />
<Path d="M60 183.6C120 180.4 300 178.6 470 186.6" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1" />
<Path d="M343 170A48 48 0 0 1 437 170M71 170A48 48 0 0 1 165 170" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.3" />
<Path d="M343.6 128C343.1 150 342.7 168 342.5 184M250.6 128.4C250.1 150 249.4 168 249 184M169.2 124.6C168.8 146 168.4 166 168.2 184" stroke="#15141A" strokeOpacity="0.26" strokeWidth="1.1" />
<Path d="M344.8 128C344.3 150 343.9 168 343.7 184M251.8 128.4C251.3 150 250.6 168 250.2 184M170.4 124.6C170 146 169.6 166 169.4 184" stroke="#FFFFFF" strokeOpacity="0.32" strokeWidth="0.8" />
<Path d="M34 170L34 184C35 195 42 200 52 200L81.07 200M154.93 200L353.07 200M426.93 200L444 200C450 200 456 200 460 198C469 192 473.5 182 472.5 172" stroke="#C9B6FF" strokeOpacity="0.45" strokeWidth="2.2" />
<Path d="M438 145C448 147.2 456.5 150.6 462.5 155.2" stroke="#15141A" strokeOpacity="0.9" strokeWidth="3.6" />
<Path d="M438 145C448 147.2 456.5 150.6 462.5 155.2" stroke="#FFFFFF" strokeWidth="1.5" />
<Path d="M38.4 140C39.8 135 43.6 131.6 50.6 130.2" stroke="#15141A" strokeOpacity="0.9" strokeWidth="3.6" />
<Path d="M38.4 140C39.8 135 43.6 131.6 50.6 130.2" stroke="#FF5C7A" strokeWidth="1.5" />
</G>
<Path d="M172 184.9Q254 184.3 337 186.1" fill="none" stroke={`url(#${p}-energia)`} strokeWidth="1.8" strokeLinecap="round" />
<Rect x="296" y="138.6" width="22" height="3.6" rx="1.8" fill="#FFFFFF" fillOpacity="0.92" />
<Rect x="296.5" y="142.2" width="21" height="1.1" rx="0.55" fill="#15141A" fillOpacity="0.22" />
<Rect x="206" y="137.8" width="22" height="3.6" rx="1.8" fill="#FFFFFF" fillOpacity="0.92" />
<Rect x="206.5" y="141.4" width="21" height="1.1" rx="0.55" fill="#15141A" fillOpacity="0.22" />
<Path d="M94.9 116C101.8 113.6 108.8 111 116 108C150 94 196 80 240 78C280 76 316 86 346 106C356 113 364 120 372 124C330 127.5 200 127.5 130 122C115 121 102 118.6 94.9 116Z" fill={`url(#${p}-teto)`} />
<Path d="M354 122.6C345 116 333 106.5 322 100.5C300 88.5 270 84 240 84.2C205 84.5 168 93 140 106C132 110 126 114.5 122 118.8C190 122.6 290 124.6 354 122.6Z" fill={`url(#${p}-vidro)`} />
<G clipPath={`url(#${p}-janela)`}>
<Path d="M251 78L259.6 78L257.4 130L248.8 130Z" fill="#0F0E14" />
<Path d="M298 78L316 78L284 130L266 130Z" fill="#FFFFFF" fillOpacity="0.09" />
<Path d="M322 78L328 78L296 130L290 130Z" fill="#FFFFFF" fillOpacity="0.07" />
<Path d="M180 78L193 78L165 130L152 130Z" fill="#FFFFFF" fillOpacity="0.06" />
</G>
<G clipPath={`url(#${p}-cabine)`} fill="none">
<Path d="M116 108C150 94 196 80 240 78C280 76 316 86 346 106" stroke="#C9B6FF" strokeOpacity="0.5" strokeWidth="2.4" />
</G>
<Path d="M347 124.6C348.6 119.2 356 117 361.6 118.6C364.4 119.4 365 122 363 123.8C358.6 126 351.4 126.4 347 124.6Z" fill={`url(#${p}-espelho)`} />
<Path d="M348 124.8C352.6 126.2 358.6 125.8 363 123.8" fill="none" stroke="#15141A" strokeOpacity="0.4" strokeWidth="1" />
<Ellipse cx="468" cy="152" rx="13" ry="7" fill={`url(#${p}-farol)`} />
<Ellipse cx="38" cy="136" rx="9" ry="6" fill={`url(#${p}-lanterna)`} />
<Path d="M52 200C42 200 35 195 34 184L34 166C34 150 35 140 38 134C40 130 44 128 50 127C70 124 92 118 116 108C150 94 196 80 240 78C280 76 316 86 346 106C356 113 364 120 372 124C402 131.5 436 140.5 455 148C466 152.5 471.5 160 472.5 170C473.5 182 469 192 460 198C456 200 450 200 444 200L426.93 200A42 42 0 1 0 353.07 200L154.93 200A42 42 0 1 0 81.07 200Z" fill="none" stroke="#15141A" strokeOpacity="0.3" strokeWidth="1" />
<Path d="M426.93 200A42 42 0 1 0 353.07 200Z" fill="#0B0A0F" />
<Path d="M154.93 200A42 42 0 1 0 81.07 200Z" fill="#0B0A0F" />
{[118, 390].map((cx) => (
<G key={cx} transform={`translate(${cx} 179)`}>
<Circle r="35" fill="#111015" />
<Circle r="32" fill="none" stroke="#2C2B34" strokeWidth="1.6" />
<Circle r="26.4" fill={`url(#${p}-aro)`} />
{[0, 72, 144, 216, 288].map((a) => (
<Path key={'l' + a} d="M4.2 -5.2C9.6 -13.4 16.4 -20.2 23 -10.6C17.6 -8.6 11.8 -5 6.4 1.4Z" transform={`rotate(${a}) scale(1.03)`} fill="#0E0D12" fillOpacity="0.62" />
))}
{[0, 72, 144, 216, 288].map((a) => (
<Path key={'b' + a} d="M4.2 -5.2C9.6 -13.4 16.4 -20.2 23 -10.6" transform={`rotate(${a}) scale(1.03)`} fill="none" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="0.9" />
))}
<Circle r="26.4" fill="none" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="1" />
<Circle r="7.6" fill="#16151B" />
<Circle r="7.6" fill="none" stroke="#C9B6FF" strokeWidth="1.6" />
<Circle r="2.2" fill="#C9B6FF" />
</G>
))}
<Ellipse cx="63" cy="151" rx="18" ry="15" fill={`url(#${p}-plugue)`} />
<Ellipse cx="64" cy="150.4" rx="5.4" ry="6.2" fill="#17161C" stroke="#C0F589" strokeOpacity="0.8" strokeWidth="1.2" />
<Path d="M50.5 161.8C40 166 30 176 26 190C22.4 202.6 13 210.6 0 212.6" fill="none" stroke={`url(#${p}-cabo)`} strokeWidth="3.8" strokeLinecap="round" />
<G transform="translate(56.8 156.4) rotate(139.8)">
<Rect x="-9" y="-4.7" width="18" height="9.4" rx="4.7" fill="#C0F589" />
<Rect x="-2" y="-4.7" width="2.4" height="9.4" fill="#15141A" fillOpacity="0.22" />
</G>
    </Svg>
  );
}

export function TracoEnergia() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 800 400" aria-hidden={true} focusable={false}>
      <Path d="M-80 360C80 490 220 270 310 240S410 90 530 145S720 110 890-50" fill="none" stroke="#C9B6FF" strokeWidth="2" opacity=".34" />
      <Path d="M-80 385C80 515 220 295 310 265S410 115 530 170S720 135 890-25" fill="none" stroke="#C9B6FF" strokeWidth="1" opacity=".18" />
      <Circle cx="527" cy="143" r="8" fill="#C0F589" />
    </Svg>
  );
}
