import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../tema/tema';

interface AvaliacaoEstrelasProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  label?: string;
}

export function AvaliacaoEstrelas({ value, onChange, size = 22, label = 'avaliação' }: AvaliacaoEstrelasProps) {
  const interactive = !!onChange;
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.row} accessibilityRole={interactive ? 'adjustable' : undefined}>
      {stars.map((star) => {
        const filled = star <= value;
        const Star = (
          <Ionicons
            name={filled ? 'star' : 'star-outline'}
            size={size}
            color={filled ? colors.warning : colors.textMuted}
          />
        );
        if (!interactive) {
          return <View key={star} style={styles.starWrap}>{Star}</View>;
        }
        return (
          <Pressable
            key={star}
            onPress={() => onChange?.(star)}
            hitSlop={6}
            style={styles.starWrap}
            accessibilityRole="button"
            accessibilityLabel={`${star} de 5 estrelas em ${label}`}
            accessibilityState={{ selected: filled }}
          >
            {Star}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
  },
  starWrap: {
    padding: 2,
  },
});
