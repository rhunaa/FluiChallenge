import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Texto as Text } from './Texto';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { StatusEstacao } from '../tipos';

const criarConfiguracaoStatus = (
  colors: ReturnType<typeof usarTema>['colors'],
): Record<StatusEstacao, { label: string; color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> => ({
  available: { label: 'Disponível', color: colors.primaryDark, bg: colors.primaryLight, icon: 'checkmark-circle' },
  busy: { label: 'Ocupado', color: '#8A5A05', bg: colors.warningLight, icon: 'time' },
  offline: { label: 'Indisponível', color: colors.textSecondary, bg: colors.offlineLight, icon: 'close-circle' },
});

export function SeloStatus({ status }: { status: StatusEstacao }) {
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const config = criarConfiguracaoStatus(colors)[status];
  return (
    <View
      style={[styles.badge, { backgroundColor: config.bg }]}
      accessibilityLabel={`Status: ${config.label}`}
    >
      <Ionicons name={config.icon} size={14} color={config.color} />
      <Text style={[styles.text, { color: config.color }]} allowFontScaling>
        {config.label}
      </Text>
    </View>
  );
}

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) => StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.small,
  },
});
