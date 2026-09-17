import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Texto as Text } from '../componentes/Texto';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { radius, shadow, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { historico, calcularResumoHistorico } from '../dados/historico';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';

const VEICULO_PADRAO = {
  plate: 'BRA2E19',
  connector: 'CCS Combo2',
};

export default function TelaPerfil() {
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const resumo = calcularResumoHistorico(historico);
  const { usuario, sair } = usarAutenticacao();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={colors.onPrimary} />
          </View>
          <Text style={styles.name} accessibilityRole="header" allowFontScaling>
            {usuario?.name}
          </Text>
          <Text style={styles.email} allowFontScaling>
            {usuario?.email}
          </Text>
          <Text style={styles.memberSince} allowFontScaling>
            Membro desde 2024
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(60).springify().damping(16)} style={[styles.summaryCard, shadow.card]}>
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

        <Text style={styles.sectionTitle} accessibilityRole="header" allowFontScaling>
          Veículo cadastrado
        </Text>
        <Animated.View entering={FadeInUp.delay(120).springify().damping(16)} style={[styles.card, shadow.card]}>
          <View style={styles.cardRow}>
            <View style={styles.iconRing}>
              <Ionicons name="car-sport" size={20} color={colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle} allowFontScaling>
                {usuario?.carModel ?? 'Nenhum veículo informado'}
              </Text>
              <Text style={styles.cardDescription} allowFontScaling>
                Placa {VEICULO_PADRAO.plate}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <View style={styles.iconRing}>
              <Ionicons name="flash" size={20} color={colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle} allowFontScaling>
                Conector padrão
              </Text>
              <Text style={styles.cardDescription} allowFontScaling>
                {VEICULO_PADRAO.connector}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Pressable
          onPress={sair}
          style={styles.logoutButton}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.logoutText} allowFontScaling>
            Sair
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) =>
  StyleSheet.create({
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
    header: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    name: {
      ...typography.h2,
      color: colors.textOnDark,
    },
    email: {
      ...typography.caption,
      color: colors.textOnDarkMuted,
      marginTop: 2,
    },
    memberSince: {
      ...typography.small,
      color: colors.textOnDarkMuted,
      marginTop: 4,
    },
    summaryCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      paddingVertical: spacing.lg,
      marginBottom: spacing.xl,
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
    sectionTitle: {
      ...typography.h3,
      color: colors.textOnDark,
      marginBottom: spacing.md,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginVertical: spacing.md,
    },
    iconRing: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    cardText: {
      flex: 1,
    },
    cardTitle: {
      ...typography.bodyMedium,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    cardDescription: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      marginTop: spacing.xl,
      paddingVertical: spacing.md,
    },
    logoutText: {
      ...typography.bodyMedium,
      color: colors.danger,
    },
  });
