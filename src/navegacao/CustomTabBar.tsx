import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { gradients, shadow } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap; label: string }> = {
  Home: { active: 'home', inactive: 'home-outline', label: 'Início' },
  Map: { active: 'map', inactive: 'map-outline', label: 'Mapa' },
  Filters: { active: 'flash', inactive: 'flash-outline', label: 'Filtros' },
  Favorites: { active: 'bookmark', inactive: 'bookmark-outline', label: 'Favoritos' },
  Community: { active: 'people', inactive: 'people-outline', label: 'Comunidade' },
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const insets = useSafeAreaInsets();
  const sideRoutes = state.routes.filter((r) => r.name !== 'Filters');
  const filtersIndex = state.routes.findIndex((r) => r.name === 'Filters');
  const filtersFocused = state.index === filtersIndex;

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 14) }]} pointerEvents="box-none">
      <View style={[styles.bar, shadow.floating]}>
        {sideRoutes.map((route) => {
          const routeIndex = state.routes.findIndex((r) => r.key === route.key);
          const focused = state.index === routeIndex;
          const meta = ICONS[route.name] ?? ICONS.Home;
          return (
            <TabButton
              key={route.key}
              focused={focused}
              icon={focused ? meta.active : meta.inactive}
              label={meta.label}
              onPress={() => navigation.navigate(route.name)}
            />
          );
        })}
      </View>

      <Pressable
        onPress={() => navigation.navigate('Filters')}
        style={styles.fabWrapper}
        accessibilityRole="button"
        accessibilityLabel="Abrir filtros de busca"
        accessibilityHint="Abre os filtros de busca de pontos de recarga"
        hitSlop={8}
      >
        <LinearGradient colors={gradients.fab} style={[styles.fab, filtersFocused && styles.fabActive]}>
          <Ionicons name="flash" size={26} color={colors.onPrimary} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

function TabButton({
  focused,
  icon,
  label,
  onPress,
}: {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(focused ? 1.08 : 1, { damping: 12 }) }],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={styles.tabButton}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      hitSlop={8}
    >
      <Animated.View style={style}>
        <Ionicons name={icon} size={22} color={focused ? colors.primary : colors.textMuted} />
      </Animated.View>
    </Pressable>
  );
}

const BAR_HEIGHT = 62;
const FAB_SIZE = 58;

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) => StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    width: '100%',
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  tabButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabWrapper: {
    position: 'absolute',
    top: -FAB_SIZE / 2 - 4,
    alignSelf: 'center',
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.background,
    ...shadow.floating,
  },
  fabActive: {
    borderColor: colors.primary,
  },
});
