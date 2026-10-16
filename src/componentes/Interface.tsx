import React, { useState, useId, useEffect, useContext } from 'react';
import { Platform, Pressable, ScrollView, StyleProp, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Texto } from './Texto';
import { usarTema } from '../contexto/ContextoTema';
import { FundoFlui } from './FundoFlui';
import { usarCoresTela } from './AssinaturaFlui';
import { ClimaFundo } from '../tema/tema';

type Icone = keyof typeof Ionicons.glyphMap;
export const linha = { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' } as const;

/* Cartao da prancha: lavanda no escuro, branco com borda no claro. */
export function Papel({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { cartao, bordaCartao } = usarCoresTela();
  return <View style={[{ backgroundColor: cartao, borderRadius: 24, padding: 16, gap: 12, borderWidth: 1, borderColor: bordaCartao }, style]}>{children}</View>;
}

export function Titulo({ children, onCard = false }: { children: React.ReactNode; onCard?: boolean }) {
  const { colors } = usarTema();
  const { txt } = usarCoresTela();
  return (
    <Texto accessibilityRole="header" aria-level={2} style={{ fontSize: onCard ? 17 : 21, fontWeight: '600', letterSpacing: onCard ? -0.2 : -0.3, color: onCard ? colors.cardText : txt }}>
      {children}
    </Texto>
  );
}

export function Corpo({ children, muted = false, onBackground = false }: { children: React.ReactNode; muted?: boolean; onBackground?: boolean }) {
  const { colors } = usarTema();
  const { txt, txt2 } = usarCoresTela();
  const cor = onBackground ? (muted ? txt2 : txt) : muted ? colors.cardTextMuted : colors.cardText;
  return <Texto style={{ fontSize: 14, lineHeight: 20, color: cor }}>{children}</Texto>;
}

export function Botao({ label, onPress, variant = 'primary', disabled = false, icon, hint, compacto = false, iconeDepois = false }: { label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean; icon?: Icone; hint?: string; compacto?: boolean; iconeDepois?: boolean }) {
  const { escuro } = usarCoresTela();
  const fundo = disabled ? (escuro ? '#2F2E35' : '#D6D3E6') : variant === 'primary' ? '#8B4DF0' : variant === 'danger' ? '#FDECEC' : '#E6DCFF';
  const texto = disabled ? (escuro ? '#A9A6B8' : '#4E4C58') : variant === 'primary' ? '#FFFFFF' : variant === 'danger' ? '#B42343' : '#5B2BBF';
  const ic = icon ? <Ionicons name={icon} size={compacto ? 16 : 18} color={texto} /> : null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({ minHeight: compacto ? 44 : 50, borderRadius: compacto ? 14 : 16, paddingHorizontal: compacto ? 14 : 18, paddingVertical: 10, backgroundColor: fundo, opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.98 : 1 }], flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 })}
    >
      {iconeDepois ? null : ic}
      <Texto style={{ fontSize: compacto ? 13 : 15, fontWeight: '600', color: texto, textAlign: 'center', flexShrink: 1 }}>{label}</Texto>
      {iconeDepois ? ic : null}
    </Pressable>
  );
}

/* Botao so de icone: tela (redondo, como o avatar), cartao, palco, foto e contorno. Nome acessivel sempre explicito. */
export function IconeBotao({ icon, label, onPress, variante = 'tela' }: { icon: Icone; label: string; onPress: () => void; variante?: 'tela' | 'cartao' | 'palco' | 'foto' | 'contorno' }) {
  const { escuro, txt } = usarCoresTela();
  const v = {
    tela: { bg: escuro ? '#1C1B21' : '#FFFFFF', borda: escuro ? 'rgba(201,182,255,0.22)' : '#E2E0F0', cor: txt, raio: 22, lado: 44 },
    cartao: { bg: '#F6F5FB', borda: 'transparent', cor: '#5B2BBF', raio: 14, lado: 44 },
    palco: { bg: 'rgba(238,237,248,0.08)', borda: 'transparent', cor: '#EEEDF8', raio: 14, lado: 44 },
    foto: { bg: 'rgba(18,17,22,0.55)', borda: 'transparent', cor: '#EEEDF8', raio: 22, lado: 44 },
    contorno: { bg: escuro ? '#1C1B21' : '#FFFFFF', borda: '#858293', cor: txt, raio: 16, lado: 50 },
  }[variante];
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => ({ width: v.lado, height: v.lado, borderRadius: v.raio, alignItems: 'center', justifyContent: 'center', backgroundColor: v.bg, borderWidth: 1, borderColor: v.borda, opacity: pressed ? 0.85 : 1 })}>
      <Ionicons name={icon} color={v.cor} size={variante === 'tela' ? 21 : 20} />
    </Pressable>
  );
}

/* Opcao em chip: contorno no estado normal, energia quando marcada. */
export function Opcao({ label, selected, onPress, kind = 'checkbox' }: { label: string; selected?: boolean; onPress: () => void; kind?: 'checkbox' | 'radio' }) {
  const { controle, controleBorda, controleTexto } = usarCoresTela();
  const marcado = !!selected;
  return (
    <Pressable
      accessibilityRole={selected === undefined ? 'button' : kind}
      accessibilityLabel={label}
      accessibilityState={selected === undefined ? {} : { checked: marcado }}
      aria-checked={selected === undefined ? undefined : marcado}
      onPress={onPress}
      style={({ pressed }) => ({ minHeight: 44, borderWidth: 1, borderColor: marcado ? '#8B4DF0' : controleBorda, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: marcado ? '#8B4DF0' : controle, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: pressed ? 0.88 : 1 })}
    >
      {marcado ? <View aria-hidden={true}><Ionicons name="checkmark" size={14} color="#FFFFFF" /></View> : null}
      <Texto style={{ fontSize: 13, fontWeight: marcado ? '600' : '500', color: marcado ? '#FFFFFF' : controleTexto, textAlign: 'center', fontVariant: ['tabular-nums'] }}>{label}</Texto>
    </Pressable>
  );
}

/* Campo da prancha: rotulo em caixa alta dentro da caixa; o nome acessivel continua sendo o rotulo. */
/* Campo de texto: nos de uma linha, a area de digitacao tem 44 px de altura (alvo de toque); o anel de foco fica na caixa inteira (App.tsx). */
export function Campo({ label, help, erro, style, icone, ...props }: TextInputProps & { label: string; help?: string; erro?: string; icone?: Icone }) {
  const { fontScale } = usarTema();
  const { controle, controleBorda, controleTexto, controleTextoSuave, txt2, erro: corErro } = usarCoresTela();
  const helpId = 'campo-ajuda-' + useId().replace(/[^a-z0-9]/gi, '');
  return (
    <View style={{ gap: 6 }}>
      <View nativeID={helpId.replace('campo-ajuda-', 'campo-caixa-')} style={{ backgroundColor: controle, borderWidth: 1, borderColor: erro ? corErro : controleBorda, borderRadius: 16, paddingHorizontal: 14, paddingTop: 10, paddingBottom: props.multiline ? 10 : 0, gap: props.multiline ? 4 : 0 }}>
        <Texto style={{ fontSize: 10.5, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', color: controleTextoSuave }}>{label}</Texto>
        <View style={{ flexDirection: 'row', alignItems: props.multiline ? 'flex-start' : 'center', gap: 8 }}>
          {icone ? <View aria-hidden={true}><Ionicons name={icone} size={18} color={controleTextoSuave} /></View> : null}
          <TextInput
            {...props}
            accessibilityLabel={label}
            aria-invalid={!!erro}
            aria-describedby={erro || help ? helpId : undefined}
            placeholderTextColor={controleTextoSuave}
            style={[{ flex: 1, minHeight: 44, padding: 0, color: controleTexto, fontSize: 16 * fontScale }, props.multiline ? { minHeight: 96, textAlignVertical: 'top' } : null, style]}
          />
        </View>
      </View>
      {erro || help ? (
        <Texto nativeID={helpId} accessibilityLiveRegion={erro ? 'polite' : 'none'} style={{ fontSize: 13, lineHeight: 18, color: erro ? corErro : txt2 }}>
          {erro || help}
        </Texto>
      ) : null}
    </View>
  );
}

export function Mensagem({ children, erro = false }: { children: React.ReactNode; erro?: boolean }) {
  return (
    <View accessibilityLiveRegion="polite" style={{ padding: 14, borderRadius: 16, backgroundColor: erro ? '#FDECEC' : '#E6DCFF' }}>
      <Texto style={{ fontSize: 13, lineHeight: 19, color: erro ? '#B42343' : '#5B2BBF' }}>{children}</Texto>
    </View>
  );
}

export function AvisoDemo({ sobreClaro = false }: { sobreClaro?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const { txt2 } = usarCoresTela();
  const cor = sobreClaro ? '#4E4C58' : txt2;
  return (
    <View style={{ gap: 8 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Sobre os dados desta experiência" accessibilityState={{ expanded: open }} aria-expanded={open} onPress={() => setOpen(!open)} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start' }}>
        <Ionicons name="information-circle-outline" size={17} color={cor} />
        <Texto style={{ fontSize: 12, color: cor }}>Sobre os dados desta experiência</Texto>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={13} color={cor} />
      </Pressable>
      {open ? (
        <Mensagem>
          Explore livremente, sem cadastro. Os postos, avaliações e percursos são dados de exemplo. Horários salvos não garantem vagas; preços e disponibilidade devem ser conferidos com o operador. As fotos mostram a região de cada endereço, não o posto em si.
        </Mensagem>
      ) : null}
    </View>
  );
}

export function Vazio({ titulo, descricao, acao }: { titulo: string; descricao: string; acao?: { label: string; onPress: () => void } }) {
  return (
    <Papel>
      <Titulo onCard>{titulo}</Titulo>
      <Corpo muted>{descricao}</Corpo>
      {acao ? <Botao variant="secondary" {...acao} /> : null}
    </Papel>
  );
}

/* Pagina r7: fundo vivo do clima da tela, titulo de 28 px, avatar ou voltar redondos e folga para o dock. */
export function Pagina({ title, subtitle, back = false, profile = true, children, hero = false, clima = 'padrao', semCabecalho = false, rolar = true }: { title: string; subtitle?: string; back?: boolean; profile?: boolean; children: React.ReactNode; hero?: boolean; clima?: ClimaFundo; semCabecalho?: boolean; rolar?: boolean }) {
  const { colors } = usarTema();
  const { txt, txt2 } = usarCoresTela();
  const focused = useIsFocused();
  const pageId = 'flui-pagina-' + useId().replace(/[^a-z0-9]/gi, '');
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const comDock = useContext(BottomTabBarHeightContext) !== undefined;
  void hero;
  useEffect(() => {
    if (!focused || Platform.OS !== 'web') return;
    const frame = requestAnimationFrame(() => {
      const root = document.getElementById(pageId);
      if (!root || root.closest('[aria-hidden="true"],[inert]')) return;
      const heading = root.querySelector<HTMLElement>('[role="heading"],h1,h2,h3');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [focused, pageId]);
  // Teclado no web: o dock flutua sobre a base da tela, e o navegador só rola o item focado até a borda de baixo, atrás dele.
  // Quando o foco visível cai nessa faixa, rola o mínimo para o item aparecer acima do dock. Mouse e toque não mudam nada.
  useEffect(() => {
    if (!comDock || Platform.OS !== 'web' || typeof document === 'undefined') return;
    const root = document.getElementById(pageId);
    if (!root) return;
    const reserva = 132 + insets.bottom; // degradê do dock (120) + folga
    const rolavel = (de: HTMLElement) => {
      for (let a = de.parentElement; a && root.contains(a); a = a.parentElement) {
        const oy = getComputedStyle(a).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && a.scrollHeight > a.clientHeight) return a;
      }
      return null;
    };
    const ajustar = (alvo: HTMLElement) => {
      const area = rolavel(alvo);
      if (!area) return;
      const r = alvo.getBoundingClientRect();
      const c = area.getBoundingClientRect();
      const limite = c.bottom - reserva;
      if (r.bottom > limite) area.scrollTop += Math.min(r.bottom - limite, Math.max(0, r.top - c.top - 16));
    };
    const aoFocar = (e: FocusEvent) => {
      const alvo = e.target as HTMLElement | null;
      if (!alvo || typeof alvo.getBoundingClientRect !== 'function') return;
      try {
        if (!alvo.matches(':focus-visible')) return;
      } catch {
        // Navegador sem :focus-visible: segue com o ajuste.
      }
      ajustar(alvo);
      requestAnimationFrame(() => {
        if (alvo.isConnected && document.activeElement === alvo) ajustar(alvo);
      });
    };
    root.addEventListener('focusin', aoFocar);
    return () => root.removeEventListener('focusin', aoFocar);
  }, [comDock, pageId, insets.bottom]);
  return (
    <View nativeID={pageId} role="main" style={{ flex: 1, backgroundColor: colors.background }}>
      <FundoFlui clima={clima} />
      <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={rolar || Platform.OS === 'web'} bounces={rolar} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: semCabecalho ? 0 : (comDock ? 120 : 32) + insets.bottom }}>
        <View style={semCabecalho ? { width: '100%', maxWidth: 640, flexGrow: 1 } : { width: '100%', maxWidth: 640, paddingHorizontal: 20, paddingTop: Math.max(insets.top, 48) + 6, gap: 16 }}>
          {semCabecalho ? <Texto accessibilityRole="header" aria-level={1} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0 }}>{title}</Texto> : null}
          {semCabecalho ? null : <View style={{ flexDirection: 'row', alignItems: back ? 'center' : 'flex-start', gap: 14 }}>
            {back ? <IconeBotao icon="chevron-back" label="Voltar" onPress={() => nav.goBack()} /> : null}
            <View style={{ flex: 1, minWidth: 0 }}>
              <Texto accessibilityRole="header" aria-level={1} style={{ fontSize: 28, fontWeight: '600', letterSpacing: -0.6, lineHeight: 32, color: txt }}>{title}</Texto>
              {subtitle ? <Texto style={{ fontSize: 14, lineHeight: 19, color: txt2, marginTop: 3 }}>{subtitle}</Texto> : null}
            </View>
            {profile && !back ? <IconeBotao icon="person-outline" label="Meu perfil" onPress={() => nav.navigate('Profile')} /> : null}
          </View>}
          {children}
        </View>
      </ScrollView>
    </View>
  );
}
