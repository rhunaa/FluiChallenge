import React from 'react';
import { Pressable } from 'react-native';
import { Texto } from './Texto';
import { usarCoresTela } from './AssinaturaFlui';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  accessibilityHint?: string;
}

/* Chip da r7: pilula com borda de controle; selecionado em energia. */
export function Chip({ label, selected, onPress, accessibilityHint }: ChipProps) {
  const { controle, controleBorda, controleTexto } = usarCoresTela();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!selected }} accessibilityLabel={label} accessibilityHint={accessibilityHint} style={({ pressed }) => ({ minHeight: 40, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: selected ? '#8B4DF0' : controleBorda, backgroundColor: selected ? '#8B4DF0' : controle, justifyContent: 'center', marginRight: 8, marginBottom: 8, opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
      <Texto style={{ fontSize: 13, fontWeight: selected ? '600' : '500', color: selected ? '#FFFFFF' : controleTexto }}>{label}</Texto>
    </Pressable>
  );
}
