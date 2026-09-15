import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './tipos';
import { TabNavigator } from './TabNavigator';
import TelaDetalhesEstacao from '../telas/TelaDetalhesEstacao';
import TelaContarExperiencia from '../telas/TelaContarExperiencia';
import TelaAcessibilidade from '../telas/TelaAcessibilidade';
import TelaPlanejadorViagem from '../telas/TelaPlanejadorViagem';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
    </Stack.Navigator>
  );
}
