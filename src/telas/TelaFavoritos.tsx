import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, radius, spacing, typography } from '../tema/tema';
import { estacoes } from '../dados/estacoes';
import { usarFavoritos } from '../contexto/ContextoFavoritos';
import { CartaoEstacao } from '../componentes/CartaoEstacao';

export default function TelaFavoritos() {
  const navigation = useNavigation<any>();
  const { idsFavoritos } = usarFavoritos();
  const favoriteStations = estacoes.filter((s) => idsFavoritos.has(s.id));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title} accessibilityRole="header" allowFontScaling>
          Meus postos favoritos
        </Text>
        <Text style={styles.subtitle} allowFontScaling>
          Veja todos os seus postos favoritos de forma rápida.
        </Text>

        {favoriteStations.length === 0 ? (
          <Animated.View entering={FadeInUp.springify().damping(16)} style={styles.emptyCard}>
            <View style={styles.iconRing}>
              <Ionicons name="bookmark-outline" size={26} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle} allowFontScaling>
              Nenhum favorito ainda
            </Text>
            <Text style={styles.emptyText} allowFontScaling>
              Toque no coração de qualquer posto no mapa ou nos filtros de busca para salvá-lo aqui.
            </Text>
          </Animated.View>
        ) : (
          favoriteStations.map((station, i) => (
            <CartaoEstacao
              key={station.id}
              station={station}
              index={i}
              onPress={() => navigation.getParent()?.navigate('StationDetail', { stationId: station.id })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 140,
  },
  title: {
    ...typography.h1,
    color: colors.textOnDark,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textOnDarkMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.caption,
    textAlign: 'center',
  },
});
