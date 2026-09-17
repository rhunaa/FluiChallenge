import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Texto as Text } from '../componentes/Texto';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { radius, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';

function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function TelaLogin() {
  const navigation = useNavigation<any>();
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const { entrar } = usarAutenticacao();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  function handleEntrar() {
    if (!emailValido(email)) {
      setErro('Digite um e-mail válido.');
      return;
    }
    if (senha.length < 4) {
      setErro('A senha precisa ter pelo menos 4 caracteres.');
      return;
    }
    setErro(null);
    entrar(email.trim(), senha);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.badgeWrap}>
          <View style={styles.badge}>
            <Ionicons name="flash" size={30} color={colors.onPrimary} />
          </View>
          <Text style={styles.title} accessibilityRole="header" allowFontScaling>
            Bem-vindo de volta
          </Text>
          <Text style={styles.subtitle} allowFontScaling>
            Entre para continuar recarregando com o Flui
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(80).springify().damping(16)} style={styles.form}>
          <Text style={styles.label} allowFontScaling>
            E-mail
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            allowFontScaling
            accessibilityLabel="E-mail"
          />

          <Text style={[styles.label, styles.labelSpacing]} allowFontScaling>
            Senha
          </Text>
          <TextInput
            value={senha}
            onChangeText={setSenha}
            placeholder="Sua senha"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            secureTextEntry
            allowFontScaling
            accessibilityLabel="Senha"
          />

          {erro && (
            <Text style={styles.erro} allowFontScaling accessibilityLiveRegion="polite">
              {erro}
            </Text>
          )}

          <Pressable
            onPress={handleEntrar}
            style={styles.primaryButton}
            accessibilityRole="button"
            accessibilityLabel="Entrar"
          >
            <Text style={styles.primaryButtonText} allowFontScaling>
              Entrar
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Cadastro')}
            style={styles.secondaryLink}
            accessibilityRole="button"
            accessibilityLabel="Não tem conta? Cadastre-se"
          >
            <Text style={styles.secondaryLinkText} allowFontScaling>
              Não tem conta? <Text style={styles.secondaryLinkBold}>Cadastre-se</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flexGrow: 1,
      padding: spacing.lg,
      paddingBottom: spacing.xxl,
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
    },
    badgeWrap: {
      alignItems: 'center',
      marginTop: spacing.xxl,
      marginBottom: spacing.xl,
    },
    badge: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
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
    },
    form: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
    label: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    labelSpacing: {
      marginTop: spacing.md,
    },
    input: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      color: colors.textPrimary,
      fontSize: 15,
    },
    erro: {
      ...typography.caption,
      color: colors.danger,
      marginTop: spacing.md,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      paddingVertical: spacing.md,
      alignItems: 'center',
      marginTop: spacing.xl,
    },
    primaryButtonText: {
      ...typography.bodyMedium,
      color: colors.onPrimary,
    },
    secondaryLink: {
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    secondaryLinkText: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    secondaryLinkBold: {
      color: colors.primary,
      fontWeight: '700',
    },
  });
