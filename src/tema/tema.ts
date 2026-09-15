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

  onPrimary: string;

  overlay: string;
  mapBase: string;
  mapRoad: string;
  mapRoadMinor: string;
}

const TEXT_PRIMARY = '#150E28';
const TEXT_SECONDARY = '#6C6485';
const TEXT_MUTED = '#A79FC0';

export const coresEscuras: CoresTema = {
  background: '#160F26',
  backgroundElevated: '#1E1533',
  surface: '#FFFFFF',
  surfaceMuted: '#F3F0FA',
  border: '#2A2043',
  borderLight: '#EDE9F7',

  gradientStart: '#4C2E8C',
  gradientMid: '#6E33C9',
  gradientEnd: '#9B4DF0',

  primary: '#8B4DF0',
  primaryDark: '#5B2FA8',
  primaryLight: '#EFE4FF',

  accent: '#C084FC',
  accentLight: '#F3E8FF',

  success: '#22C55E',
  successLight: '#E5F9EC',

  warning: '#F5A524',
  warningLight: '#FEF3E2',

  danger: '#F0455A',
  dangerLight: '#FDECEC',

  offline: '#9B93AE',
  offlineLight: '#EEEBF5',

  textPrimary: TEXT_PRIMARY,
  textSecondary: TEXT_SECONDARY,
  textMuted: TEXT_MUTED,

  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#C6BCE0',

  onPrimary: '#FFFFFF',

  overlay: 'rgba(11, 6, 26, 0.55)',
  mapBase: '#211736',
  mapRoad: '#3A2A5C',
  mapRoadMinor: '#2A1F45',
};

export const coresClaras: CoresTema = {
  background: '#F3F0FA',
  backgroundElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F7F5FC',
  border: '#E2DCEF',
  borderLight: '#EDE9F7',

  gradientStart: '#4C2E8C',
  gradientMid: '#6E33C9',
  gradientEnd: '#9B4DF0',

  primary: '#8B4DF0',
  primaryDark: '#5B2FA8',
  primaryLight: '#EFE4FF',

  accent: '#7C3AED',
  accentLight: '#F3E8FF',

  success: '#22C55E',
  successLight: '#E5F9EC',

  warning: '#F5A524',
  warningLight: '#FEF3E2',

  danger: '#F0455A',
  dangerLight: '#FDECEC',

  offline: '#9B93AE',
  offlineLight: '#EEEBF5',

  textPrimary: TEXT_PRIMARY,
  textSecondary: TEXT_SECONDARY,
  textMuted: TEXT_MUTED,

  textOnDark: '#150E28',
  textOnDarkMuted: '#5B5570',

  onPrimary: '#FFFFFF',

  overlay: 'rgba(20, 14, 40, 0.35)',
  mapBase: '#EDE9F7',
  mapRoad: '#FFFFFF',
  mapRoadMinor: '#DED5F0',
};

export const colors = coresEscuras;

export const gradients = {
  hero: [coresEscuras.gradientStart, coresEscuras.gradientMid, coresEscuras.gradientEnd] as const,
  card: [coresEscuras.gradientMid, coresEscuras.gradientEnd] as const,
  fab: ['#2B1B4A', '#0F0A1C'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '800' as const, color: TEXT_PRIMARY },
  h2: { fontSize: 20, fontWeight: '700' as const, color: TEXT_PRIMARY },
  h3: { fontSize: 16, fontWeight: '700' as const, color: TEXT_PRIMARY },
  body: { fontSize: 15, fontWeight: '400' as const, color: TEXT_PRIMARY },
  bodyMedium: { fontSize: 15, fontWeight: '600' as const, color: TEXT_PRIMARY },
  caption: { fontSize: 13, fontWeight: '500' as const, color: TEXT_SECONDARY },
  small: { fontSize: 11, fontWeight: '700' as const, color: TEXT_SECONDARY },
};

export const shadow = {
  card: {
    shadowColor: '#0B0618',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  floating: {
    shadowColor: '#0B0618',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 14,
  },
};
