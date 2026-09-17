import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Texto } from './src/componentes/Texto';
import { ProvedorTema, usarTema } from './src/contexto/ContextoTema';
import { ProvedorFiltro } from './src/contexto/ContextoFiltro';
import { ProvedorFavoritos } from './src/contexto/ContextoFavoritos';
import { ProvedorAvaliacoes } from './src/contexto/ContextoAvaliacoes';
import { ProvedorReservas } from './src/contexto/ContextoReservas';
import { ProvedorAutenticacao } from './src/contexto/ContextoAutenticacao';
import { RootNavigator } from './src/navegacao/RootNavigator';

function SplashScreen() {
  const { colors } = usarTema();
  const scale = useSharedValue(0.9);

  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.06, { duration: 700 }), withTiming(0.94, { duration: 700 })), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      entering={FadeIn}
      style={[styles.splash, { backgroundColor: colors.background }]}
      accessibilityLabel="Carregando Flui"
    >
      <Animated.View style={[styles.splashBadge, { backgroundColor: colors.primary }, style]}>
        <Ionicons name="flash" size={36} color={colors.onPrimary} />
      </Animated.View>
      <Texto style={[styles.splashTitle, { color: colors.textOnDark }]}>Flui</Texto>
      <Texto style={[styles.splashSubtitle, { color: colors.textOnDarkMuted }]}>Recarregue com facilidade</Texto>
    </Animated.View>
  );
}

function ConteudoApp() {
  const { colors, modo } = usarTema();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1100);
    return () => clearTimeout(t);
  }, []);

  const navigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
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
      {ready ? (
        <ProvedorFiltro>
          <ProvedorFavoritos>
            <ProvedorAvaliacoes>
              <ProvedorReservas>
                <NavigationContainer theme={navigationTheme}>
                  <RootNavigator />
                </NavigationContainer>
              </ProvedorReservas>
            </ProvedorAvaliacoes>
          </ProvedorFavoritos>
        </ProvedorFiltro>
      ) : (
        <SplashScreen />
      )}
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProvedorTema>
          <ProvedorAutenticacao>
            <ConteudoApp />
          </ProvedorAutenticacao>
        </ProvedorTema>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashBadge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  splashTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  splashSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
});
