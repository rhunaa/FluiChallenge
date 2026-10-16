import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { ProvedorTema, usarTema } from './src/contexto/ContextoTema';
import { ProvedorFiltro } from './src/contexto/ContextoFiltro';
import { ProvedorFavoritos } from './src/contexto/ContextoFavoritos';
import { ProvedorAvaliacoes } from './src/contexto/ContextoAvaliacoes';
import { ProvedorReservas } from './src/contexto/ContextoReservas';
import { ProvedorViagem } from './src/contexto/ContextoViagem';
import {
  ProvedorAutenticacao,
  usarAutenticacao,
} from './src/contexto/ContextoAutenticacao';
import { instalarAcessibilidadeWeb } from './src/utilitarios/acessibilidadeWeb';
import { RootNavigator } from './src/navegacao/RootNavigator';
function ConteudoApp() {
  const { colors, modo } = usarTema();
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const doc = (globalThis as any).document;
    if (!doc?.documentElement) return;
    doc.documentElement.style.backgroundColor = colors.background;
    if (doc.body) doc.body.style.backgroundColor = colors.background;
  }, [colors.background]);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const doc = (globalThis as any).document;
    if (!doc) return;
    doc.title = 'Flui · Energia em movimento';
    doc.documentElement.lang = 'pt-BR';
    const el = doc.createElement('style');
    el.textContent =
      '[role=button],[role=checkbox],[role=radio],[role=tab]{transition:transform 140ms ease,background-color 140ms ease,opacity 140ms ease}[role=button]:hover{filter:brightness(1.02)}@keyframes flui-fundo{from{opacity:0}to{opacity:1}}[data-testid=flui-fundo]{animation:flui-fundo 600ms ease-out both}[data-testid=flui-hero]{animation:flui-enter 320ms cubic-bezier(.2,.8,.2,1) both}@keyframes flui-enter{from{opacity:.3;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}*:focus-visible{outline:3px solid #8B4DF0!important;outline-offset:3px!important}[id^="campo-caixa-"]:focus-within{outline:3px solid #8B4DF0;outline-offset:3px}[id^="campo-caixa-"] input:focus-visible,[id^="campo-caixa-"] textarea:focus-visible{outline:none!important}h1:focus,h2:focus,h3:focus,[role=heading]:focus{outline:none!important}input::placeholder,textarea::placeholder{opacity:1}html,body,#root{height:100%;margin:0}*{scroll-behavior:auto}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}';
    doc.head.appendChild(el);
    const limparAcessibilidade = instalarAcessibilidadeWeb();
    return () => { limparAcessibilidade(); el.remove(); };
  }, []);
  const base = modo === 'dark' ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.background,
      primary: colors.primary,
      text: colors.textOnDark,
      border: colors.border,
    },
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={modo === 'dark' ? 'light' : 'dark'} />
      <ProvedorFiltro>
        <ProvedorFavoritos>
          <ProvedorAvaliacoes>
            <ProvedorReservas>
              <ProvedorViagem>
                <NavigationContainer theme={theme}>
                  <RootNavigator />
                </NavigationContainer>
              </ProvedorViagem>
            </ProvedorReservas>
          </ProvedorAvaliacoes>
        </ProvedorFavoritos>
      </ProvedorFiltro>
    </View>
  );
}
function Sessao() {
  const { sessaoId } = usarAutenticacao();
  return (
    <ProvedorTema key={sessaoId}>
      <ConteudoApp />
    </ProvedorTema>
  );
}
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProvedorAutenticacao>
          <Sessao />
        </ProvedorAutenticacao>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
