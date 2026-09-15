import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Texto as Text } from '../componentes/Texto';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { gradients, radius, shadow, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { estacoes } from '../dados/estacoes';
import { planejarRota, estimarDuracaoViagemMin, formatarDuracaoMin } from '../dados/planejadorRota';
import { Chip } from '../componentes/Chip';
import { SecaoFiltro } from '../componentes/SecaoFiltro';
import { Estacao } from '../tipos';

const AUTONOMIAS_KM = [3, 5, 8, 12, 20];

function potenciaMaxima(estacao: { connectors: { powerKw: number }[] }): number {
  return Math.max(...estacao.connectors.map((c) => c.powerKw));
}

export default function TelaPlanejadorViagem() {
  const navigation = useNavigation<any>();
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const [destinoId, setDestinoId] = useState<string | null>(null);
  const [autonomia, setAutonomia] = useState<number | null>(null);
  const [busca, setBusca] = useState('');

  const destinosDisponiveis = useMemo(
    () => estacoes.filter((e) => e.status !== 'offline').sort((a, b) => a.distanceKm - b.distanceKm),
    [],
  );

  const destinosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return destinosDisponiveis;
    return destinosDisponiveis.filter(
      (e) => e.name.toLowerCase().includes(termo) || e.address.toLowerCase().includes(termo),
    );
  }, [destinosDisponiveis, busca]);

  const destino = estacoes.find((e) => e.id === destinoId) ?? null;
  const resultado = useMemo(() => {
    if (!destino || !autonomia) return null;
    return planejarRota(destino, autonomia, estacoes);
  }, [destino, autonomia]);

  function recomecar() {
    setDestinoId(null);
    setAutonomia(null);
    setBusca('');
  }

  function iniciarViagem() {
    if (!resultado || !resultado.viavel || !destino) return;
    const primeiraParada: Estacao = resultado.paradas[0]?.estacao ?? destino;
    navigation.navigate('Tabs', { screen: 'Map', params: { focusStationId: primeiraParada.id } });
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.hero} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTopRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="arrow-back" size={20} color={colors.onPrimary} />
            </Pressable>
          </View>
          <Text style={styles.headerTitle} accessibilityRole="header" allowFontScaling>
            Planejador de viagem
          </Text>
          <Text style={styles.headerSubtitle} allowFontScaling>
            Descubra onde parar para recarregar no caminho
          </Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header" allowFontScaling>
            Para onde você vai?
          </Text>
          <View style={[styles.searchBar, shadow.card]}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar posto por nome ou endereço..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              allowFontScaling
              accessibilityLabel="Buscar posto de destino por nome ou endereço"
              returnKeyType="search"
              autoCorrect={false}
            />
            {busca.length > 0 && (
              <Pressable
                onPress={() => setBusca('')}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Limpar busca"
              >
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>

          {destinosFiltrados.length === 0 ? (
            <Text style={styles.semResultadoText} allowFontScaling>
              Nenhum posto encontrado para "{busca}".
            </Text>
          ) : (
            <View style={styles.chipsRow}>
              {destinosFiltrados.map((e) => (
                <Chip key={e.id} label={e.name} selected={destinoId === e.id} onPress={() => setDestinoId(e.id)} />
              ))}
            </View>
          )}
        </Animated.View>

        <SecaoFiltro title="Autonomia restante do seu carro" index={1}>
          {AUTONOMIAS_KM.map((km) => (
            <Chip key={km} label={`${km} km`} selected={autonomia === km} onPress={() => setAutonomia(km)} />
          ))}
        </SecaoFiltro>

        {!resultado && (
          <View style={styles.dicaCard}>
            <Ionicons name="information-circle-outline" size={18} color={colors.textOnDarkMuted} />
            <Text style={styles.dicaText} allowFontScaling>
              Escolha um destino e sua autonomia restante para calcular as paradas de recarga necessárias.
            </Text>
          </View>
        )}

        {resultado && destino && (
          <Animated.View entering={FadeIn} style={styles.resultado}>
            {resultado.viavel ? (
              <>
                <View style={[styles.summaryCard, shadow.card]}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue} allowFontScaling>
                      {resultado.distanciaTotalKm.toFixed(1)}
                    </Text>
                    <Text style={styles.summaryLabel} allowFontScaling>
                      km totais
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue} allowFontScaling>
                      {resultado.paradas.length}
                    </Text>
                    <Text style={styles.summaryLabel} allowFontScaling>
                      {resultado.paradas.length === 1 ? 'parada' : 'paradas'}
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue} allowFontScaling>
                      {formatarDuracaoMin(estimarDuracaoViagemMin(resultado.distanciaTotalKm, resultado.paradas.length))}
                    </Text>
                    <Text style={styles.summaryLabel} allowFontScaling>
                      estimados
                    </Text>
                  </View>
                </View>

                {resultado.paradas.length === 0 ? (
                  <View style={styles.avisoCard}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    <Text style={styles.avisoText} allowFontScaling>
                      Sua autonomia é suficiente para chegar direto em {destino.name}, sem paradas.
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.resultTitle} accessibilityRole="header" allowFontScaling>
                      Paradas no caminho
                    </Text>

                    {resultado.paradas.map((etapa, i) => (
                      <Pressable
                        key={etapa.estacao.id}
                        onPress={() => navigation.navigate('StationDetail', { stationId: etapa.estacao.id })}
                        style={styles.etapaCard}
                        accessibilityRole="button"
                        accessibilityLabel={`Parada ${i + 1}, ${etapa.estacao.name}, ${etapa.distanciaTrechoKm.toFixed(1)} quilômetros desde a última parada, recarga até ${potenciaMaxima(etapa.estacao)} kW`}
                        accessibilityHint="Toque para ver a ficha do posto"
                      >
                        <View style={styles.etapaBadge}>
                          <Text style={styles.etapaBadgeText} allowFontScaling>
                            {i + 1}
                          </Text>
                        </View>
                        <View style={styles.etapaInfo}>
                          <Text style={styles.etapaName} allowFontScaling numberOfLines={1}>
                            {etapa.estacao.name}
                          </Text>
                          <Text style={styles.etapaMeta} allowFontScaling>
                            +{etapa.distanciaTrechoKm.toFixed(1)} km · recarga completa até {potenciaMaxima(etapa.estacao)} kW
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                      </Pressable>
                    ))}

                    <View style={[styles.etapaCard, styles.etapaFinal]}>
                      <View style={[styles.etapaBadge, styles.etapaBadgeFinal]}>
                        <Ionicons name="flag" size={14} color={colors.onPrimary} />
                      </View>
                      <View style={styles.etapaInfo}>
                        <Text style={styles.etapaName} allowFontScaling numberOfLines={1}>
                          {destino.name}
                        </Text>
                        <Text style={styles.etapaMeta} allowFontScaling>
                          +{resultado.trechoFinalKm.toFixed(1)} km desde a última parada · destino final
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.disclaimer} allowFontScaling>
                      Rota estimada com base na distância em linha reta até cada posto e velocidade média urbana —
                      use como referência, não como trajeto exato.
                    </Text>
                  </>
                )}
              </>
            ) : (
              <View style={[styles.avisoCard, styles.avisoCardAlerta]}>
                <Ionicons name="warning" size={20} color={colors.danger} />
                <Text style={styles.avisoText} allowFontScaling>
                  Nenhum posto está ao alcance para continuar a viagem com {autonomia} km de autonomia. Tente
                  aumentar a autonomia ou escolher um destino mais próximo.
                </Text>
              </View>
            )}

            <Pressable
              onPress={recomecar}
              style={styles.recomecarButton}
              accessibilityRole="button"
              accessibilityLabel="Recomeçar planejamento"
            >
              <Ionicons name="refresh" size={16} color={colors.primary} />
              <Text style={styles.recomecarText} allowFontScaling>
                Recomeçar
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>

      {resultado?.viavel && destino && (
        <Animated.View entering={FadeIn} style={[styles.ctaBar, shadow.floating]}>
          <Pressable
            onPress={iniciarViagem}
            style={styles.ctaButton}
            accessibilityRole="button"
            accessibilityLabel={`Iniciar viagem até ${destino.name}`}
          >
            <Ionicons name="navigate" size={18} color={colors.onPrimary} />
            <Text style={styles.ctaText} allowFontScaling>
              Iniciar viagem
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      borderBottomLeftRadius: radius.xl,
      borderBottomRightRadius: radius.xl,
    },
    headerTopRow: {
      flexDirection: 'row',
      marginTop: spacing.sm,
      marginBottom: spacing.md,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      ...typography.h1,
      color: colors.textOnDark,
    },
    headerSubtitle: {
      ...typography.body,
      color: colors.textOnDarkMuted,
      marginTop: 2,
      marginBottom: spacing.lg,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: 160,
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.textOnDark,
      marginBottom: spacing.sm,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.lg,
      height: 48,
      marginBottom: spacing.md,
    },
    searchInput: {
      ...typography.body,
      color: colors.textPrimary,
      flex: 1,
      height: '100%',
    },
    semResultadoText: {
      ...typography.caption,
      color: colors.textOnDarkMuted,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    ctaBar: {
      position: 'absolute',
      left: spacing.lg,
      right: spacing.lg,
      bottom: spacing.xl,
    },
    ctaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      paddingVertical: spacing.md,
    },
    ctaText: {
      ...typography.bodyMedium,
      color: colors.onPrimary,
    },
    dicaCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      backgroundColor: 'rgba(255,255,255,0.06)',
      borderRadius: radius.lg,
      padding: spacing.md,
      marginTop: spacing.sm,
    },
    dicaText: {
      ...typography.caption,
      color: colors.textOnDarkMuted,
      flex: 1,
    },
    resultado: {
      marginTop: spacing.sm,
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
      ...typography.h3,
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
    recomecarButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: spacing.md,
      marginTop: spacing.sm,
    },
    recomecarText: {
      ...typography.bodyMedium,
      color: colors.primary,
    },
    resultTitle: {
      ...typography.h3,
      color: colors.textOnDark,
      marginBottom: spacing.md,
    },
    etapaCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    etapaFinal: {
      backgroundColor: colors.primaryLight,
    },
    etapaBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    etapaBadgeFinal: {
      backgroundColor: colors.primary,
    },
    etapaBadgeText: {
      ...typography.small,
      color: colors.primaryDark,
    },
    etapaInfo: {
      flex: 1,
      marginRight: spacing.sm,
    },
    etapaName: {
      ...typography.bodyMedium,
    },
    etapaMeta: {
      ...typography.caption,
      marginTop: 2,
    },
    disclaimer: {
      ...typography.small,
      color: colors.textOnDarkMuted,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
    avisoCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      backgroundColor: colors.successLight,
      borderRadius: radius.lg,
      padding: spacing.md,
    },
    avisoCardAlerta: {
      backgroundColor: colors.dangerLight,
    },
    avisoText: {
      ...typography.caption,
      color: colors.textPrimary,
      flex: 1,
    },
  });
