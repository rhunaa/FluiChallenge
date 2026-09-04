import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { colors, gradients, radius, spacing, typography } from '../tema/tema';
import { estacoes } from '../dados/estacoes';
import { CartaoEstacao } from '../componentes/CartaoEstacao';

export default function TelaInicio() {
  const navigation = useNavigation<any>();
  const featured = estacoes.filter((s) => s.status === 'available').slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View>
            <Text style={styles.greeting} allowFontScaling>
              Olá, motorista 👋
            </Text>
            <Text style={styles.title} allowFontScaling>
              Para onde vamos hoje?
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.getParent()?.navigate('Accessibility')}
            style={styles.avatar}
            accessibilityRole="button"
            accessibilityLabel="Abrir perfil e acessibilidade"
          >
            <Ionicons name="person" size={20} color={colors.onPrimary} />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <LinearGradient colors={gradients.hero} style={styles.hero}>
            <View style={styles.heroIconRing}>
              <Ionicons name="flash" size={26} color={colors.onPrimary} />
            </View>
            <Text style={styles.heroTitle} allowFontScaling>
              Encontre pontos de recarga por perto
            </Text>
            <Text style={styles.heroSubtitle} allowFontScaling>
              {estacoes.length} estações mapeadas na sua região agora
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Map')}
              style={styles.heroButton}
              accessibilityRole="button"
              accessibilityLabel="Ver mapa de pontos de recarga"
            >
              <Text style={styles.heroButtonText} allowFontScaling>
                Ver mapa
              </Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primaryDark} />
            </Pressable>
          </LinearGradient>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} accessibilityRole="header" allowFontScaling>
            Postos em destaque
          </Text>
          <Pressable onPress={() => navigation.navigate('Map')} accessibilityRole="button" accessibilityLabel="Ver todos os postos no mapa">
            <Text style={styles.link} allowFontScaling>
              Ver todos
            </Text>
          </Pressable>
        </View>

        {featured.map((station, i) => (
          <CartaoEstacao
            key={station.id}
            station={station}
            index={i}
            onPress={() => navigation.getParent()?.navigate('StationDetail', { stationId: station.id })}
          />
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
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
  },
  title: {
    ...typography.h1,
    color: colors.textOnDark,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  heroIconRing: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textOnDark,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textOnDarkMuted,
    marginBottom: spacing.lg,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    gap: 6,
  },
  heroButtonText: {
    ...typography.bodyMedium,
    color: colors.primaryDark,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textOnDark,
  },
  link: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '700',
  },
});
