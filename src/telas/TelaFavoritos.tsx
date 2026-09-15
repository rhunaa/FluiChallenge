import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Texto as Text } from '../componentes/Texto';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { radius, shadow, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { estacoes, buscarEstacaoPorId } from '../dados/estacoes';
import { historico, calcularResumoHistorico } from '../dados/historico';
import { usarFavoritos } from '../contexto/ContextoFavoritos';
import { CartaoEstacao } from '../componentes/CartaoEstacao';
import { CartaoHistorico } from '../componentes/CartaoHistorico';

const ABAS = [
  { key: 'favoritos', label: 'Favoritos' },
  { key: 'historico', label: 'Histórico' },
] as const;

export default function TelaFavoritos() {
  const navigation = useNavigation<any>();
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const { idsFavoritos } = usarFavoritos();
  const [aba, setAba] = useState<(typeof ABAS)[number]['key']>('favoritos');

  const favoriteStations = estacoes.filter((s) => idsFavoritos.has(s.id));
  const resumo = calcularResumoHistorico(historico);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title} accessibilityRole="header" allowFontScaling>
          Favoritos & Histórico
        </Text>
        <Text style={styles.subtitle} allowFontScaling>
          Seus postos salvos e suas recargas anteriores, em um só lugar.
        </Text>

        <View style={styles.tabsRow} accessibilityRole="tablist">
          {ABAS.map((a) => {
            const active = aba === a.key;
            return (
              <Pressable
                key={a.key}
                onPress={() => setAba(a.key)}
                style={[styles.tab, active && styles.tabActive]}
                accessibilityRole="tab"
                accessibilityLabel={a.label}
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]} allowFontScaling>
                  {a.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {aba === 'favoritos' ? (
          favoriteStations.length === 0 ? (
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
          )
        ) : historico.length === 0 ? (
          <Animated.View entering={FadeInUp.springify().damping(16)} style={styles.emptyCard}>
            <View style={styles.iconRing}>
              <Ionicons name="time-outline" size={26} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle} allowFontScaling>
              Nenhuma recarga registrada
            </Text>
            <Text style={styles.emptyText} allowFontScaling>
              Suas próximas recargas aparecem aqui automaticamente.
            </Text>
          </Animated.View>
        ) : (
          <>
            <Animated.View entering={FadeInUp.springify().damping(16)} style={[styles.summaryCard, shadow.card]}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue} allowFontScaling>
                  {resumo.totalSessoes}
                </Text>
                <Text style={styles.summaryLabel} allowFontScaling>
                  recargas
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue} allowFontScaling>
                  {resumo.totalEnergiaKwh.toFixed(1)}
                </Text>
                <Text style={styles.summaryLabel} allowFontScaling>
                  kWh totais
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue} allowFontScaling>
                  R$ {resumo.totalGasto.toFixed(0)}
                </Text>
                <Text style={styles.summaryLabel} allowFontScaling>
                  gastos
                </Text>
              </View>
            </Animated.View>

            {historico.map((sessao, i) => (
              <CartaoHistorico
                key={sessao.id}
                sessao={sessao}
                station={buscarEstacaoPorId(sessao.stationId)}
                index={i}
                onPress={() => navigation.getParent()?.navigate('StationDetail', { stationId: sessao.stationId })}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 140,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
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
    marginBottom: spacing.lg,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.surface,
  },
  tabText: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
    fontWeight: '700',
  },
  tabTextActive: {
    color: colors.primaryDark,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  summaryLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.borderLight,
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
