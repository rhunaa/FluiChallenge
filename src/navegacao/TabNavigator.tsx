import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from './tipos';
import { CustomTabBar } from './CustomTabBar';
import TelaInicio from '../telas/TelaInicio';
import TelaMapa from '../telas/TelaMapa';
import TelaFiltros from '../telas/TelaFiltros';
import TelaFavoritos from '../telas/TelaFavoritos';
import TelaComunidade from '../telas/TelaComunidade';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={TelaInicio} />
      <Tab.Screen name="Map" component={TelaMapa} />
      <Tab.Screen name="Filters" component={TelaFiltros} />
      <Tab.Screen name="Favorites" component={TelaFavoritos} />
      <Tab.Screen name="Community" component={TelaComunidade} />
    </Tab.Navigator>
  );
}
