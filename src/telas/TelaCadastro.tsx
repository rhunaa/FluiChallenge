import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Texto as Text } from '../componentes/Texto';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { gradients, radius, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';

function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function TelaCadastro() {
  const navigation = useNavigation<any>();
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const { cadastrar } = usarAutenticacao();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [carModel, setCarModel] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  function handleCadastrar() {
    if (name.trim().length < 2) {
      setErro('Digite seu nome completo.');
      return;
    }
    if (!emailValido(email)) {
      setErro('Digite um e-mail válido.');
      return;
    }
    if (senha.length < 4) {
      setErro('A senha precisa ter pelo menos 4 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não são iguais.');
      return;
    }
    setErro(null);
    cadastrar({
      name: name.trim(),
      email: email.trim(),
      senha,
      carModel: carModel.trim() || undefined,
    });
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.hero} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={18} color={colors.onPrimary} />
          </Pressable>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title} accessibilityRole="header" allowFontScaling>
          Criar conta
        </Text>
        <Text style={styles.subtitle} allowFontScaling>
          Leva menos de um minuto
        </Text>

        <Animated.View entering={FadeInUp.springify().damping(16)} style={styles.form}>
          <Text style={styles.label} allowFontScaling>
            Nome completo
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            allowFontScaling
            accessibilityLabel="Nome completo"
          />

          <Text style={[styles.label, styles.labelSpacing]} allowFontScaling>
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
            Modelo do carro (opcional)
          </Text>
          <TextInput
            value={carModel}
            onChangeText={setCarModel}
            placeholder="Ex: Chevrolet Bolt EV 2023"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            allowFontScaling
            accessibilityLabel="Modelo do carro, opcional"
          />

          <Text style={[styles.label, styles.labelSpacing]} allowFontScaling>
            Senha
          </Text>
          <TextInput
            value={senha}
            onChangeText={setSenha}
            placeholder="Crie uma senha"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            secureTextEntry
            allowFontScaling
            accessibilityLabel="Senha"
          />

          <Text style={[styles.label, styles.labelSpacing]} allowFontScaling>
            Confirmar senha
          </Text>
          <TextInput
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Repita a senha"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            secureTextEntry
            allowFontScaling
            accessibilityLabel="Confirmar senha"
          />

          {erro && (
            <Text style={styles.erro} allowFontScaling accessibilityLiveRegion="polite">
              {erro}
            </Text>
          )}

          <Pressable
            onPress={handleCadastrar}
            style={styles.primaryButton}
            accessibilityRole="button"
            accessibilityLabel="Criar conta"
          >
            <Text style={styles.primaryButtonText} allowFontScaling>
              Criar conta
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.secondaryLink}
            accessibilityRole="button"
            accessibilityLabel="Já tem conta? Entrar"
          >
            <Text style={styles.secondaryLinkText} allowFontScaling>
              Já tem conta? <Text style={styles.secondaryLinkBold}>Entrar</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
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
      paddingBottom: spacing.lg,
      borderBottomLeftRadius: radius.xl,
      borderBottomRightRadius: radius.xl,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.sm,
    },
    content: {
      flexGrow: 1,
      padding: spacing.lg,
      paddingBottom: spacing.xxl,
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
    },
    title: {
      ...typography.h1,
      color: colors.textOnDark,
    },
    subtitle: {
      ...typography.body,
      color: colors.textOnDarkMuted,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
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
