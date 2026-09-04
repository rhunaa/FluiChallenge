import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../tema/tema';
import { StatusEstacao } from '../tipos';

const CONFIGURACAO_STATUS: Record<StatusEstacao, { label: string; color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  available: { label: 'Disponível', color: colors.primaryDark, bg: colors.primaryLight, icon: 'checkmark-circle' },
  busy: { label: 'Ocupado', color: '#8A5A05', bg: colors.warningLight, icon: 'time' },
  offline: { label: 'Indisponível', color: colors.textSecondary, bg: colors.offlineLight, icon: 'close-circle' },
};

export function SeloStatus({ status }: { status: StatusEstacao }) {
  const config = CONFIGURACAO_STATUS[status];
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

const styles = StyleSheet.create({
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

export { CONFIGURACAO_STATUS };
