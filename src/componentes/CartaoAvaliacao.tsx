import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avaliacao, Estacao } from '../tipos';
import { Papel, Corpo, Botao } from './Interface';
import { Texto } from './Texto';
import { mediaAvaliacao } from '../utilitarios/avaliacoes';

const labels = {
  availability: 'Disponibilidade',
  queue: 'Fila / espera',
  speed: 'Velocidade',
  comfort: 'Conforto',
  value: 'Custo-benefício',
};
const TINTA = '#1B1A20',
  TINTA2 = '#4E4C58',
  LAVANDA = '#E6DCFF',
  ROXO = '#5B2BBF',
  ENERGIA = '#8B4DF0',
  TRILHO = '#D6D3E6';

/* Avaliação r7: cartão claro, iniciais em lavanda e notas por categoria em segmentos. */
export function CartaoAvaliacao({
  review: r,
  station,
  onPressStation,
}: {
  review: Avaliacao;
  station?: Estacao;
  index?: number;
  onPressStation?: () => void;
}) {
  const [expanded, setExpanded] = useState(false),
    [details, setDetails] = useState(false),
    long = r.comment.length > 190;
  return (
    <Papel>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: LAVANDA,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Texto style={{ fontSize: 15, fontWeight: '600', color: ROXO }}>
            {r.authorName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </Texto>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Texto style={{ fontSize: 15, fontWeight: '600', color: TINTA }}>{r.authorName}</Texto>
          <Corpo muted>
            {r.authorId
              ? new Date(r.createdAt).toLocaleString('pt-BR')
              : 'Exemplo da comunidade · data não verificada'}
          </Corpo>
        </View>
      </View>
      {station && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ver posto ${station.name}`}
          onPress={onPressStation}
          style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          <Ionicons name="location-outline" size={16} color={ROXO} />
          <Texto style={{ fontSize: 15, fontWeight: '600', color: ROXO }}>{station.name} →</Texto>
        </Pressable>
      )}
      <Texto style={{ fontSize: 18, fontWeight: '600', letterSpacing: -0.3, color: TINTA }}>
        {mediaAvaliacao(r).toFixed(1)} / 5 · média das categorias
      </Texto>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={details ? 'Recolher notas por categoria' : 'Ver notas por categoria'}
        aria-expanded={details}
        accessibilityState={{ expanded: details }}
        onPress={() => setDetails((v) => !v)}
        style={{ minHeight: 44, flexDirection: 'row', gap: 7, alignItems: 'center' }}
      >
        <Ionicons name="stats-chart-outline" size={17} color={ROXO} />
        <Texto style={{ fontSize: 12, fontWeight: '600', color: ROXO }}>
          Cinco notas · {details ? 'recolher' : 'ver detalhes'}
        </Texto>
        <Ionicons name={details ? 'chevron-up' : 'chevron-down'} size={14} color={ROXO} />
      </Pressable>
      {details && (
        <View style={{ gap: 9 }}>
          {(Object.keys(labels) as (keyof typeof labels)[]).map((k) => (
            <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Texto style={{ fontSize: 13, color: TINTA2, flex: 1 }}>{labels[k]}</Texto>
              <View aria-hidden style={{ flexDirection: 'row', gap: 3 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <View
                    key={i}
                    style={{
                      width: 12,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: i <= Math.round(r.ratings[k]) ? ENERGIA : TRILHO,
                    }}
                  />
                ))}
              </View>
              <Texto
                style={{ fontSize: 13, fontWeight: '600', color: TINTA, minWidth: 34, textAlign: 'right' }}
              >
                {r.ratings[k]} / 5
              </Texto>
            </View>
          ))}
        </View>
      )}
      <Corpo>
        {r.comment
          ? long && !expanded
            ? r.comment.slice(0, 190) + '…'
            : r.comment
          : 'Sem comentário escrito.'}
      </Corpo>
      {long && (
        <Botao
          variant="secondary"
          label={expanded ? 'Recolher comentário' : 'Ler comentário completo'}
          onPress={() => setExpanded((v) => !v)}
        />
      )}
    </Papel>
  );
}
