import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Texto } from '../componentes/Texto';
import { usarTema } from '../contexto/ContextoTema';
import { radius, shadow, spacing, typography } from '../tema/tema';

export default function TelaAcessibilidade() {
  const navigation = useNavigation<any>();
  const { colors, modo, alternarModo, fontScale, fontScaleLabel, aumentarFonte } = usarTema();
  const styles = criarEstilos(colors);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={18} color={colors.textOnDark} />
          </Pressable>
        </View>

        <View style={styles.avatar}>
          <Ionicons name="person" size={30} color={colors.onPrimary} />
        </View>
        <Texto style={styles.title} accessibilityRole="header">
          Perfil & Acessibilidade
        </Texto>
        <Texto style={styles.subtitle}>Ajuste o app do seu jeito.</Texto>

        <Animated.View entering={FadeInUp.springify().damping(16)} style={[styles.card, shadow.card]}>
          <View style={styles.cardRow}>
            <View style={styles.iconRing}>
              <Ionicons name="text" size={20} color={colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Texto style={styles.cardTitle}>Tamanho do texto</Texto>
              <Texto style={styles.cardDescription}>Atual: {fontScaleLabel}</Texto>
            </View>
          </View>
          <Pressable
            onPress={aumentarFonte}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel="Aumentar tamanho do texto"
            accessibilityHint={`Tamanho atual: ${fontScaleLabel}. Toque para aumentar.`}
          >
            <Ionicons name="add-circle-outline" size={18} color={colors.onPrimary} />
            <Texto style={styles.actionButtonText}>Aumentar texto (A{fontScale > 1 ? '+' : ''})</Texto>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(70).springify().damping(16)} style={[styles.card, shadow.card]}>
          <View style={styles.cardRow}>
            <View style={styles.iconRing}>
              <Ionicons name={modo === 'dark' ? 'moon' : 'sunny'} size={20} color={colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Texto style={styles.cardTitle}>Aparência</Texto>
              <Texto style={styles.cardDescription}>
                {modo === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado'}
              </Texto>
            </View>
          </View>
          <Pressable
            onPress={alternarModo}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={modo === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            accessibilityState={{ checked: modo === 'light' }}
          >
            <Ionicons name={modo === 'dark' ? 'sunny-outline' : 'moon-outline'} size={18} color={colors.onPrimary} />
            <Texto style={styles.actionButtonText}>
              Mudar para modo {modo === 'dark' ? 'claro' : 'escuro'}
            </Texto>
          </Pressable>
        </Animated.View>
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
      paddingBottom: 60,
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
    },
    topRow: {
      marginBottom: spacing.sm,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.backgroundElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: spacing.md,
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.h1,
      color: colors.textOnDark,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.body,
      color: colors.textOnDarkMuted,
      textAlign: 'center',
      marginTop: spacing.xs,
      marginBottom: spacing.xl,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
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
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      paddingVertical: spacing.md,
    },
    actionButtonText: {
      ...typography.bodyMedium,
      color: colors.onPrimary,
    },
  });
