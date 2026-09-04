import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { colors } from './src/tema/tema';
import { ProvedorFiltro } from './src/contexto/ContextoFiltro';
import { ProvedorFavoritos } from './src/contexto/ContextoFavoritos';
import { ProvedorAvaliacoes } from './src/contexto/ContextoAvaliacoes';
import { RootNavigator } from './src/navegacao/RootNavigator';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    primary: colors.primary,
  },
};

function SplashScreen() {
  const scale = useSharedValue(0.9);

  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.06, { duration: 700 }), withTiming(0.94, { duration: 700 })), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeIn} style={styles.splash} accessibilityLabel="Carregando Flui">
      <Animated.View style={[styles.splashBadge, style]}>
        <Ionicons name="flash" size={36} color={colors.onPrimary} />
      </Animated.View>
      <Text style={styles.splashTitle}>Flui</Text>
      <Text style={styles.splashSubtitle}>Recarregue com facilidade</Text>
    </Animated.View>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {ready ? (
          <ProvedorFiltro>
            <ProvedorFavoritos>
              <ProvedorAvaliacoes>
                <NavigationContainer theme={navigationTheme}>
                  <RootNavigator />
                </NavigationContainer>
              </ProvedorAvaliacoes>
            </ProvedorFavoritos>
          </ProvedorFiltro>
        ) : (
          <SplashScreen />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashBadge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  splashTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textOnDark,
  },
  splashSubtitle: {
    fontSize: 14,
    color: colors.textOnDarkMuted,
    marginTop: 4,
  },
});
