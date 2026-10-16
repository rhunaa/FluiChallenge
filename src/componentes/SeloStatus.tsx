import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Texto } from './Texto';
import { StatusEstacao } from '../tipos';
import { corStatus, iconeStatus } from './AssinaturaFlui';

const rotulos: Record<StatusEstacao, string> = { available: 'Disponível', busy: 'Ocupado', offline: 'Indisponível' };
const fundos: Record<StatusEstacao, string> = { available: '#E5F9EC', busy: '#FEF3E2', offline: '#E2E0F0' };

/* Status com forma, palavra e cor (paleta de status da r7). */
export function SeloStatus({ status }: { status: StatusEstacao }) {
  const cor = corStatus[status];
  return (
    <View accessibilityLabel={`Status: ${rotulos[status]}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, alignSelf: 'flex-start', backgroundColor: fundos[status] }}>
      <Ionicons name={iconeStatus[status]} size={14} color={cor} />
      <Texto style={{ fontSize: 11, fontWeight: '600', color: cor }}>{rotulos[status]}</Texto>
    </View>
  );
}
