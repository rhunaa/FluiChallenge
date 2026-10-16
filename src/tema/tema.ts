export type ModoTema = 'dark' | 'light';

export interface CoresTema {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  borderLight: string;

  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;

  primary: string;
  primaryDark: string;
  primaryLight: string;

  accent: string;
  accentLight: string;

  success: string;
  successLight: string;

  warning: string;
  warningLight: string;

  danger: string;
  dangerLight: string;

  offline: string;
  offlineLight: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  textOnDark: string;
  textOnDarkMuted: string;
  textOnGradient: string;
  textOnGradientMuted: string;

  onPrimary: string;

  overlay: string;
  mapBase: string;
  mapRoad: string;
  mapRoadMinor: string;

  /* r7 «Fluxo»: chaves novas; nenhuma chave anterior foi removida */
  card: string;
  cardText: string;
  cardTextMuted: string;
  control: string;
  controlBorder: string;
  controlText: string;
  controlTextMuted: string;
  stage: string;
  stageBorder: string;
  stageText: string;
  stageTextMuted: string;
  stageAvailable: string;
  stageBusy: string;
  stageOffline: string;
  stageError: string;
  dock: string;
  dockBorder: string;
  energyText: string;
  energyLight: string;
  glow: string;
  lime: string;
  focus: string;
  mapRiver: string;
  mapPark: string;
}

/* Texto sobre cartões claros (lavanda ou branco), nos dois modos */
const TEXT_PRIMARY = '#1B1A20';
const TEXT_SECONDARY = '#4E4C58';
const TEXT_MUTED = '#5F5D69';

/* Escuro (padrão): fundo vivo sobre grafite 950; cartões lavanda com texto escuro */
export const coresEscuras: CoresTema = {
  background: '#121116',
  backgroundElevated: '#1C1B21',
  surface: '#EEEDF8',
  surfaceMuted: '#E2E0F0',
  border: '#858293',
  borderLight: '#D6D3E6',

  gradientStart: '#241033',
  gradientMid: '#242428',
  gradientEnd: '#1C1B21',

  primary: '#8B4DF0',
  primaryDark: '#5B2BBF',
  primaryLight: '#E6DCFF',

  accent: '#C9B6FF',
  accentLight: '#E6DCFF',

  success: '#177044',
  successLight: '#E5F9EC',

  warning: '#8A5300',
  warningLight: '#FEF3E2',

  danger: '#B42343',
  dangerLight: '#FDECEC',

  offline: '#5E5B6B',
  offlineLight: '#E2E0F0',

  textPrimary: TEXT_PRIMARY,
  textSecondary: TEXT_SECONDARY,
  textMuted: TEXT_MUTED,

  textOnDark: '#EEEDF8',
  textOnDarkMuted: '#A9A6B8',
  textOnGradient: '#EEEDF8',
  textOnGradientMuted: '#A9A6B8',

  onPrimary: '#FFFFFF',

  overlay: 'rgba(18, 17, 22, 0.62)',
  mapBase: '#1A1920',
  mapRoad: '#33323B',
  mapRoadMinor: '#26252D',

  card: '#EEEDF8',
  cardText: TEXT_PRIMARY,
  cardTextMuted: TEXT_SECONDARY,
  control: '#1C1B21',
  controlBorder: '#858293',
  controlText: '#EEEDF8',
  controlTextMuted: '#A9A6B8',
  stage: 'rgba(36, 36, 40, 0.80)',
  stageBorder: 'rgba(201, 182, 255, 0.16)',
  stageText: '#EEEDF8',
  stageTextMuted: '#A9A6B8',
  stageAvailable: '#C0F589',
  stageBusy: '#F5C46B',
  stageOffline: '#A9A6B8',
  stageError: '#FF8FA6',
  dock: 'rgba(28, 27, 33, 0.94)',
  dockBorder: 'rgba(201, 182, 255, 0.14)',
  energyText: '#C9B6FF',
  energyLight: '#C9B6FF',
  glow: '#B48CFF',
  lime: '#C0F589',
  focus: '#8B4DF0',
  mapRiver: '#262140',
  mapPark: '#1B2721',
};

/* Claro: fundo vivo lavanda; cartões brancos; palco e dock em grafite 800 */
export const coresClaras: CoresTema = {
  background: '#EEEDF8',
  backgroundElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F6F5FB',
  border: '#858293',
  borderLight: '#E2E0F0',

  gradientStart: '#241033',
  gradientMid: '#242428',
  gradientEnd: '#1C1B21',

  primary: '#8B4DF0',
  primaryDark: '#5B2BBF',
  primaryLight: '#E6DCFF',

  accent: '#5B2BBF',
  accentLight: '#E6DCFF',

  success: '#177044',
  successLight: '#E5F9EC',

  warning: '#8A5300',
  warningLight: '#FEF3E2',

  danger: '#B42343',
  dangerLight: '#FDECEC',

  offline: '#5E5B6B',
  offlineLight: '#E2E0F0',

  textPrimary: TEXT_PRIMARY,
  textSecondary: TEXT_SECONDARY,
  textMuted: TEXT_MUTED,

  textOnDark: '#1B1A20',
  textOnDarkMuted: '#4E4C58',
  textOnGradient: '#EEEDF8',
  textOnGradientMuted: '#A9A6B8',

  onPrimary: '#FFFFFF',

  overlay: 'rgba(27, 26, 32, 0.35)',
  mapBase: '#E4E2F0',
  mapRoad: '#FFFFFF',
  mapRoadMinor: '#D6D3E6',

  card: '#FFFFFF',
  cardText: TEXT_PRIMARY,
  cardTextMuted: TEXT_SECONDARY,
  control: '#FFFFFF',
  controlBorder: '#858293',
  controlText: '#1B1A20',
  controlTextMuted: '#4E4C58',
  stage: '#242428',
  stageBorder: 'rgba(238, 237, 248, 0.07)',
  stageText: '#EEEDF8',
  stageTextMuted: '#A9A6B8',
  stageAvailable: '#C0F589',
  stageBusy: '#F5C46B',
  stageOffline: '#A9A6B8',
  stageError: '#FF8FA6',
  dock: '#242428',
  dockBorder: 'rgba(238, 237, 248, 0.07)',
  energyText: '#5B2BBF',
  energyLight: '#C9B6FF',
  glow: '#B48CFF',
  lime: '#C0F589',
  focus: '#8B4DF0',
  mapRiver: '#D2D5EE',
  mapPark: '#DCE6DE',
};

export const colors = coresEscuras;

export const gradients = {
  hero: [coresEscuras.gradientStart, coresEscuras.gradientMid, coresEscuras.gradientEnd] as const,
  card: [coresEscuras.gradientMid, coresEscuras.gradientEnd] as const,
  fab: ['#2F2E35', '#1C1B21'] as const,
  climaEscuro: ['#241033', '#191424', '#121116'] as const,
  climaClaro: ['#E2D8FB', '#EBE8F8', '#EEEDF8'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '600' as const, color: TEXT_PRIMARY },
  h2: { fontSize: 21, fontWeight: '600' as const, color: TEXT_PRIMARY },
  h3: { fontSize: 17, fontWeight: '600' as const, color: TEXT_PRIMARY },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const, color: TEXT_PRIMARY },
  bodyMedium: { fontSize: 15, lineHeight: 22, fontWeight: '600' as const, color: TEXT_PRIMARY },
  caption: { fontSize: 13, fontWeight: '500' as const, color: TEXT_SECONDARY },
  small: { fontSize: 11, fontWeight: '600' as const, color: TEXT_SECONDARY },
  hero: { fontSize: 48, fontWeight: '300' as const, letterSpacing: -1, fontVariant: ['tabular-nums'] as Array<'tabular-nums'> },
  label: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.6, textTransform: 'uppercase' as const },
};

export const shadow = {
  card: {
    shadowColor: '#121116',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  floating: {
    shadowColor: '#121116',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 14,
  },
};

export const movimento = { pressao: 140, entrada: 240, linha: 600, fundoEntrada: 600, fundoMudanca: 240 };

export type ClimaFundo = 'inicio' | 'mapa' | 'ficha' | 'planejador' | 'padrao';
export type CorFundo = 'energia' | 'brilho' | 'lima';
export interface BrilhoFundo { x: number; y: number; r: number; cor: CorFundo; opacidade: Record<ModoTema, number> }
export interface ClimaDef { paradas: [number, number, number]; brilhos: BrilhoFundo[]; linhasDy: number | null; faisca: { x: number; y: number } | null }
export interface CoresFundo { topo: string; meio: string; base: string; energia: string; brilho: string; lima: string; linha: string }

/* Fundo vivo: coordenadas no quadro 393 x 852 da prancha; o FundoFlui converte para pixels, com raio pelo menor lado */
export const fundoVivo: {
  quadro: { largura: number; altura: number };
  cores: Record<ModoTema, CoresFundo>;
  climas: Record<ClimaFundo, ClimaDef>;
  linhas: { curva: string; deslocamentos: number[]; larguras: number[]; opacidade: Record<ModoTema, number[]> };
  limites: { brilhosMax: number; linhasMax: number; nevoaSobreBrilhoMax: number };
} = {
  quadro: { largura: 393, altura: 852 },
  cores: {
    dark: { topo: '#241033', meio: '#191424', base: '#121116', energia: '#8B4DF0', brilho: '#B48CFF', lima: '#C0F589', linha: '#C9B6FF' },
    light: { topo: '#E2D8FB', meio: '#EBE8F8', base: '#EEEDF8', energia: '#B48CFF', brilho: '#C9B6FF', lima: '#C0F589', linha: '#8B4DF0' },
  },
  climas: {
    inicio: { paradas: [0, 0.3, 0.62], brilhos: [{ x: 360, y: 24, r: 330, cor: 'energia', opacidade: { dark: 0.62, light: 0.55 } }, { x: -30, y: 300, r: 260, cor: 'brilho', opacidade: { dark: 0.24, light: 0.5 } }], linhasDy: 0, faisca: { x: 269.4, y: 82.7 } },
    planejador: { paradas: [0, 0.28, 0.6], brilhos: [{ x: 380, y: 10, r: 320, cor: 'energia', opacidade: { dark: 0.58, light: 0.5 } }, { x: -40, y: 360, r: 250, cor: 'brilho', opacidade: { dark: 0.2, light: 0.45 } }], linhasDy: -36, faisca: null },
    ficha: { paradas: [0.39, 0.52, 0.8], brilhos: [{ x: 410, y: 380, r: 280, cor: 'energia', opacidade: { dark: 0.46, light: 0.4 } }, { x: -20, y: 400, r: 220, cor: 'lima', opacidade: { dark: 0.14, light: 0.3 } }], linhasDy: null, faisca: null },
    mapa: { paradas: [0, 0.3, 0.62], brilhos: [{ x: 393, y: 0, r: 320, cor: 'energia', opacidade: { dark: 0.42, light: 0 } }], linhasDy: null, faisca: null },
    padrao: { paradas: [0, 0.3, 0.62], brilhos: [{ x: 360, y: 24, r: 300, cor: 'energia', opacidade: { dark: 0.46, light: 0.42 } }, { x: -30, y: 320, r: 240, cor: 'brilho', opacidade: { dark: 0.18, light: 0.4 } }], linhasDy: 0, faisca: null },
  },
  linhas: { curva: 'M-40 250C90 260 170 60 440 40', deslocamentos: [0, 28, 56], larguras: [1.6, 1, 1], opacidade: { dark: [0.34, 0.18, 0.1], light: [0.3, 0.16, 0.09] } },
  limites: { brilhosMax: 2, linhasMax: 1, nevoaSobreBrilhoMax: 0.4 },
};
