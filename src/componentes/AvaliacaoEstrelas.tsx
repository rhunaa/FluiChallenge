import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usarCoresTela } from './AssinaturaFlui';

/* Estrelas r7: cor de energia sobre o fundo vivo, alvo de 44 px; a nota escolhida ganha contorno. */
export function AvaliacaoEstrelas({
  value,
  onChange,
  size = 22,
  label = 'avaliação',
}: {
  value: number;
  onChange?: (n: number) => void;
  size?: number;
  label?: string;
}) {
  const { energia, controle, controleBorda } = usarCoresTela();
  if (!onChange)
    return (
      <View
        accessible
        accessibilityLabel={`${value} de 5 estrelas em ${label}`}
        style={{ flexDirection: 'row', gap: 3 }}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <Ionicons
            key={n}
            name={n <= value ? 'star' : 'star-outline'}
            size={size}
            color="#5B2BBF"
            accessible={false}
          />
        ))}
      </View>
    );
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable
          key={n}
          accessibilityRole="radio"
          accessibilityLabel={`${n} de 5 estrelas em ${label}`}
          accessibilityState={{ checked: n === value }}
          aria-checked={n === value}
          onPress={() => onChange(n)}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: n === value ? energia : 'transparent',
            backgroundColor: n === value ? controle : 'transparent',
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Ionicons
            name={n <= value ? 'star' : 'star-outline'}
            size={size}
            color={n <= value ? energia : controleBorda}
            accessible={false}
          />
        </Pressable>
      ))}
    </View>
  );
}
