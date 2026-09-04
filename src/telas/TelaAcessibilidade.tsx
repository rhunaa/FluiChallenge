import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, radius, spacing, typography } from '../tema/tema';

const ACCESSIBILITY_FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string; description: string }[] = [
  {
    icon: 'text-outline',
    title: 'Texto com escala dinâmica',
    description: 'Todos os textos respeitam o tamanho de fonte definido nas configurações do seu aparelho.',
  },
  {
    icon: 'volume-high-outline',
    title: 'Suporte a leitores de tela',
    description: 'Marcadores do mapa, botões e status têm rótulos e dicas para VoiceOver e TalkBack.',
  },
  {
    icon: 'color-palette-outline',
    title: 'Contraste e redundância de cor',
    description: 'Status de disponibilidade combinam cor, ícone e texto — nunca dependem só da cor.',
  },
  {
    icon: 'finger-print-outline',
    title: 'Áreas de toque ampliadas',
    description: 'Botões e marcadores mantêm no mínimo 44x44pt para facilitar o toque.',
  },
  {
    icon: 'notifications-outline',
    title: 'Feedback de estado claro',
    description: 'Carregamentos e transições anunciam mudanças de estado (região de leitura "polite").',
  },
];

export default function TelaAcessibilidade() {
  const navigation = useNavigation<any>();

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
        <Text style={styles.title} accessibilityRole="header" allowFontScaling>
          Perfil & Acessibilidade
        </Text>
        <Text style={styles.subtitle} allowFontScaling>
          Recursos pensados para que qualquer motorista use o Flui com autonomia.
        </Text>

        {ACCESSIBILITY_FEATURES.map((feature, i) => (
          <Animated.View
            key={feature.title}
            entering={FadeInUp.delay(i * 70).springify().damping(16)}
            style={styles.card}
          >
            <View style={styles.iconRing}>
              <Ionicons name={feature.icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle} allowFontScaling>
                {feature.title}
              </Text>
              <Text style={styles.cardDescription} allowFontScaling>
                {feature.description}
              </Text>
            </View>
          </Animated.View>
        ))}
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
    paddingBottom: 60,
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
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
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
    marginBottom: 2,
  },
  cardDescription: {
    ...typography.caption,
  },
});
