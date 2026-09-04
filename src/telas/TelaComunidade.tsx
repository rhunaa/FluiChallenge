import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, gradients, radius, spacing, typography } from '../tema/tema';
import { buscarEstacaoPorId } from '../dados/estacoes';
import { usarAvaliacoes } from '../contexto/ContextoAvaliacoes';
import { CartaoAvaliacao } from '../componentes/CartaoAvaliacao';

const TABS = [
  { key: 'feed', label: 'Feed' },
  { key: 'mine', label: 'Meus feedbacks' },
] as const;

export default function TelaComunidade() {
  const navigation = useNavigation<any>();
  const { reviews } = usarAvaliacoes();
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('feed');

  const visibleReviews = tab === 'feed' ? reviews : reviews.filter((r) => r.authorName === 'Você');

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.hero} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <Text style={styles.title} accessibilityRole="header" allowFontScaling>
            Comunidade
          </Text>
          <Text style={styles.subtitle} allowFontScaling>
            Avalie, veja e compartilhe experiências sobre os postos de recarga
          </Text>

          <View style={styles.tabsRow} accessibilityRole="tablist">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setTab(t.key)}
                  style={[styles.tab, active && styles.tabActive]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.tabText, active && styles.tabTextActive]} allowFontScaling>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={() => navigation.getParent()?.navigate('ReportExperience')}
            style={styles.composer}
            accessibilityRole="button"
            accessibilityLabel="Contar como foi sua experiência em um posto"
          >
            <Text style={styles.composerText} allowFontScaling>
              Como foi sua experiência?
            </Text>
            <View style={styles.composerButton}>
              <Ionicons name="flash" size={16} color={colors.onPrimary} />
            </View>
          </Pressable>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={visibleReviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CartaoAvaliacao
            review={item}
            station={buscarEstacaoPorId(item.stationId)}
            index={index}
            onPressStation={() => navigation.getParent()?.navigate('StationDetail', { stationId: item.stationId })}
          />
        )}
        ListEmptyComponent={
          <Animated.View entering={FadeIn} style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={26} color={colors.textMuted} />
            <Text style={styles.emptyText} allowFontScaling>
              Você ainda não publicou nenhuma experiência.
            </Text>
          </Animated.View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  title: {
    ...typography.h1,
    color: colors.textOnDark,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textOnDarkMuted,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: spacing.md,
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
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.lg,
  },
  composerText: {
    ...typography.body,
    color: colors.textMuted,
  },
  composerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: spacing.lg,
    paddingBottom: 140,
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
  },
});
