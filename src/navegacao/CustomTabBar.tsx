import React, { useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Texto } from '../componentes/Texto';
import { usarTema } from '../contexto/ContextoTema';

type Icone = keyof typeof Ionicons.glyphMap;
const itens: Record<string, { label: string; icon: Icone; ativo: Icone }> = {
  Home: { label: 'Início', icon: 'home-outline', ativo: 'home' },
  Map: { label: 'Mapa', icon: 'map-outline', ativo: 'map' },
  Filters: { label: 'Recarga', icon: 'flash', ativo: 'flash' },
  Favorites: { label: 'Salvos', icon: 'bookmark-outline', ativo: 'bookmark' },
  Community: { label: 'Comunidade', icon: 'people-outline', ativo: 'people' },
};

/* Dock da prancha r7: flutua sobre a tela, com Recarga em destaque no centro. O nome acessivel e sempre o completo. */
export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const { modo, fontScale } = usarTema();
  const insets = useSafeAreaInsets();
  const escuro = modo === 'dark';
  const curto = width < 380 || fontScale > 1.2;
  /* 'Comunidade' vira 'Feed' tambem quando o nome nao cabe na aba (por exemplo, com o espacamento de texto aumentado no navegador). */
  const [medida, setMedida] = useState({ aba: 0, nome: 0 });
  const naoCabe = medida.aba > 0 && medida.nome + 0.5 > medida.aba;
  const noMapa = state.routes[state.index]?.name === 'Map';
  const fade = noMapa ? (escuro ? '#EEEDF8' : '#FFFFFF') : escuro ? '#121116' : '#EEEDF8';
  const fade0 = noMapa ? (escuro ? 'rgba(238,237,248,0)' : 'rgba(255,255,255,0)') : escuro ? 'rgba(18,17,22,0)' : 'rgba(238,237,248,0)';
  const anel = escuro ? '#121116' : '#EEEDF8';
  return (
    <View role="navigation" aria-label="Navegação principal" pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      {/* Medidor invisivel do nome 'Comunidade', com a mesma fonte do rotulo: decide quando trocar por 'Feed'. */}
      <View aria-hidden={true} pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, opacity: 0 }}>
        <Texto numberOfLines={1} onLayout={(e) => { const nome = e.nativeEvent.layout.width; setMedida((m) => (m.nome === nome ? m : { ...m, nome })); }} style={{ fontSize: 10.5, fontWeight: '600' }}>Comunidade</Texto>
      </View>
      <LinearGradient pointerEvents="none" colors={[fade0, fade]} locations={[0, 0.62]} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 + insets.bottom }} />
      <View pointerEvents="box-none" style={{ paddingHorizontal: 14, paddingBottom: 16 + insets.bottom, alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: 520, borderRadius: 26, shadowColor: escuro ? '#000000' : '#121116', shadowOffset: { width: 0, height: 12 }, shadowOpacity: escuro ? 0.45 : 0.25, shadowRadius: 30, elevation: 12 }}>
          <View accessibilityRole="tablist" style={{ height: 68, borderRadius: 26, flexDirection: 'row', alignItems: 'center', backgroundColor: escuro ? 'rgba(28,27,33,0.94)' : '#242428', borderWidth: 1, borderColor: escuro ? 'rgba(201,182,255,0.14)' : 'rgba(238,237,248,0.07)', shadowColor: '#8B4DF0', shadowOffset: { width: 0, height: 0 }, shadowOpacity: escuro ? 0.22 : 0, shadowRadius: 40 }}>
            {state.routes.filter((r) => itens[r.name]).map((r) => {
              const item = itens[r.name];
              const focused = state.routes[state.index]?.key === r.key;
              const centro = r.name === 'Filters';
              const rotulo = (curto || naoCabe) && r.name === 'Community' ? 'Feed' : item.label;
              const onPress = () => {
                const event = navigation.emit({ type: 'tabPress', target: r.key, canPreventDefault: true });
                if (!event.defaultPrevented) navigation.navigate(r.name);
              };
              return (
                <Pressable key={r.key} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: focused }} aria-selected={focused} onPress={onPress} onLayout={r.name === 'Community' ? (e) => { const aba = e.nativeEvent.layout.width; setMedida((m) => (m.aba === aba ? m : { ...m, aba })); } : undefined} style={({ pressed }) => ({ flex: 1, minWidth: 0, height: 68, alignItems: 'center', justifyContent: 'center', gap: 4, opacity: pressed ? 0.8 : 1 })}>
                  {centro ? (
                    <View style={{ marginTop: -34, alignItems: 'center' }}>
                      <View style={{ width: 66, height: 66, borderRadius: 33, backgroundColor: anel, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#8B4DF0', alignItems: 'center', justifyContent: 'center', shadowColor: '#8B4DF0', shadowOffset: { width: 0, height: escuro ? 0 : 8 }, shadowOpacity: escuro ? 0.65 : 0.4, shadowRadius: escuro ? 26 : 22, elevation: 10 }}>
                          <Ionicons name="flash" size={26} color="#FFFFFF" />
                        </View>
                      </View>
                      <Texto numberOfLines={1} style={{ fontSize: 10.5, fontWeight: '600', color: '#EEEDF8' }}>{rotulo}</Texto>
                    </View>
                  ) : (
                    <>
                      {focused ? <View style={{ position: 'absolute', top: 4, width: 20, height: 3, borderRadius: 2, backgroundColor: '#B48CFF' }} /> : null}
                      <Ionicons name={focused ? item.ativo : item.icon} size={22} color={focused ? '#EEEDF8' : '#A9A6B8'} />
                      <Texto numberOfLines={1} style={{ maxWidth: '100%', fontSize: 10.5, fontWeight: '600', textAlign: 'center', color: focused ? '#EEEDF8' : '#A9A6B8' }}>{rotulo}</Texto>
                    </>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
export default CustomTabBar;
