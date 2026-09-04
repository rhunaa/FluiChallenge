export const colors = {
  // Base roxa escura (baseada na referência do Figma)
  background: '#160F26',
  backgroundElevated: '#1E1533',
  surface: '#FFFFFF',
  surfaceMuted: '#F3F0FA',
  border: '#2A2043',
  borderLight: '#EDE9F7',

  // Família de gradientes roxo/violeta
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

  textPrimary: '#150E28',
  textSecondary: '#6C6485',
  textMuted: '#A79FC0',

  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#C6BCE0',

  onPrimary: '#FFFFFF',

  overlay: 'rgba(11, 6, 26, 0.55)',
  mapBase: '#211736',
  mapRoad: '#3A2A5C',
  mapRoadMinor: '#2A1F45',
};

export const gradients = {
  hero: [colors.gradientStart, colors.gradientMid, colors.gradientEnd] as const,
  card: [colors.gradientMid, colors.gradientEnd] as const,
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
  h1: { fontSize: 26, fontWeight: '800' as const, color: colors.textPrimary },
  h2: { fontSize: 20, fontWeight: '700' as const, color: colors.textPrimary },
  h3: { fontSize: 16, fontWeight: '700' as const, color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.textPrimary },
  bodyMedium: { fontSize: 15, fontWeight: '600' as const, color: colors.textPrimary },
  caption: { fontSize: 13, fontWeight: '500' as const, color: colors.textSecondary },
  small: { fontSize: 11, fontWeight: '700' as const, color: colors.textSecondary },
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
