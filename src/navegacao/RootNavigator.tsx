import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './tipos';
import { TabNavigator } from './TabNavigator';
import TelaDetalhesEstacao from '../telas/TelaDetalhesEstacao';
import TelaContarExperiencia from '../telas/TelaContarExperiencia';
import TelaAcessibilidade from '../telas/TelaAcessibilidade';
import TelaPlanejadorViagem from '../telas/TelaPlanejadorViagem';
import TelaLogin from '../telas/TelaLogin';
import TelaCadastro from '../telas/TelaCadastro';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { logado } = usarAutenticacao();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {logado ? (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen
            name="StationDetail"
            component={TelaDetalhesEstacao}
            options={{ presentation: 'card', animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ReportExperience"
            component={TelaContarExperiencia}
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="Accessibility"
            component={TelaAcessibilidade}
            options={{ presentation: 'card', animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="TripPlanner"
            component={TelaPlanejadorViagem}
            options={{ presentation: 'card', animation: 'slide_from_right' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={TelaLogin} />
          <Stack.Screen
            name="Cadastro"
            component={TelaCadastro}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
