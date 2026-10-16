import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Texto } from './Texto';
import { Corpo, Titulo } from './Interface';
import { Numero, Overline } from './AssinaturaFlui';
import { usarTema } from '../contexto/ContextoTema';

type Icone = keyof typeof Ionicons.glyphMap;

/* Secao dentro de cartao: fio no topo, icone em energia e titulo de 17 px. */
export function SecaoFlui({ title, icon, subtitle, children }: { title: string; icon?: Icone; subtitle?: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 12, paddingTop: 16, borderTopWidth: 1, borderColor: '#E2E0F0' }}>
      <View style={{ flexDirection: 'row', gap: 9, alignItems: 'center' }}>
        {icon ? <Ionicons name={icon} size={18} color="#5B2BBF" /> : null}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Titulo onCard>{title}</Titulo>
        </View>
      </View>
      {subtitle ? <Corpo muted>{subtitle}</Corpo> : null}
      {children}
    </View>
  );
}

/* Atalho em cartao, como os cartoes da prancha. */
export function AtalhoFlui({ label, description, icon, onPress }: { label: string; description?: string; icon: Icone; onPress: () => void }) {
  const { colors, modo } = usarTema();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => ({ flex: 1, minWidth: 140, minHeight: 92, padding: 16, borderRadius: 24, gap: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: modo === 'dark' ? 'transparent' : '#E2E0F0', opacity: pressed ? 0.86 : 1 })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#E6DCFF', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={19} color="#5B2BBF" />
        </View>
        <Ionicons name="arrow-forward" size={16} color="#4E4C58" />
      </View>
      <Texto style={{ fontSize: 15, fontWeight: '600', color: '#1B1A20' }}>{label}</Texto>
      {description ? <Texto style={{ fontSize: 12, lineHeight: 16, color: '#4E4C58' }}>{description}</Texto> : null}
    </Pressable>
  );
}

/* Faixa de leitura em grafite: rotulo pequeno e um numero leve. */
export function FaixaFlui({ label, value, detail, icon }: { label: string; value: string; detail?: string; icon: Icone }) {
  const { modo } = usarTema();
  const escuro = modo === 'dark';
  return (
    <View style={{ borderRadius: 24, padding: 18, gap: 6, backgroundColor: escuro ? 'rgba(36,36,40,0.80)' : '#242428', borderWidth: 1, borderColor: escuro ? 'rgba(201,182,255,0.16)' : 'rgba(238,237,248,0.07)' }}>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Ionicons name={icon} size={16} color="#C9B6FF" />
        <Overline>{label}</Overline>
      </View>
      <Numero valor={value} tamanho={32} />
      {detail ? <Texto style={{ fontSize: 12, lineHeight: 17, color: '#A9A6B8' }}>{detail}</Texto> : null}
    </View>
  );
}
