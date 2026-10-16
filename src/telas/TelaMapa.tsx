import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Animated, Easing, PanResponder, Platform, Pressable, ScrollView, TextInput, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Texto } from '../componentes/Texto';
import { FotoPosto } from '../componentes/VisualFlui';
import { usarTema } from '../contexto/ContextoTema';
import { estacoes } from '../dados/estacoes';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { usarFiltros } from '../contexto/ContextoFiltro';
import { aplicarFiltros, buscarEstacoes, conectoresCorrespondentes, statusDosConectores, FILTROS_PADRAO } from '../utilitarios/filtrarEstacoes';
import { temChaveGoogleMapsWeb } from '../servicos/googleMaps';
import { MapaGoogle } from '../componentes/MapaGoogle';
import { EstadoMapa, FaseMapa } from '../componentes/estadoMapa';
import { CartaoEstacao } from '../componentes/CartaoEstacao';
import { Pagina, Mensagem, Vazio, AvisoDemo } from '../componentes/Interface';
import { Conector, StatusConector, corStatus, iconeStatus } from '../componentes/AssinaturaFlui';

const rot = (s: string) => (s === 'available' ? 'disponível' : s === 'busy' ? 'ocupado' : 'fora de serviço');

/* Uma linha curta na folha diz o que o mapa mostra. Nenhum texto fica por cima do mapa. */
const TEXTO_MAPA: Record<FaseMapa, string> = {
  ilustrativo: 'Mapa ilustrativo · toque em um posto.',
  carregando: 'Carregando o Google Maps…',
  pronto: 'Toque em um posto para ver a prévia.',
  lento: 'O Google Maps não abriu. Mostrando o mapa ilustrativo.',
  recusado: 'Google Maps indisponível. Mostrando o mapa ilustrativo.',
};
/* Dock de abas (68 px + 16 de margem) que fica por cima do fim da folha. */
const DOCK = 84;
/* Respiro entre o fim do conteúdo da folha e o dock: o degradê do dock começa 36 px acima dele. */
const FOLGA_DOCK = 30;
/* Com menos curso que isso a folha não tem para onde subir: fica parada e rola por dentro. */
const CURSO_MINIMO = 24;

/* Mapa da prancha r7: mapa na tela toda, busca em cápsula, contador e uma folha embaixo.
   A folha começa recolhida (cabeçalho e prévia do posto) e sobe com a lista quando a pessoa puxa ou toca na seta. */
export function TelaMapa() {
  const { colors, modo, fontScale } = usarTema();
  const escuro = modo === 'dark';
  const insets = useSafeAreaInsets();
  const janela = useWindowDimensions();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { filters, setFilters, resetarFiltros } = usarFiltros();
  const { usuario } = usarAutenticacao();
  const [query, setQuery] = useState('');
  const [selectedId, setSelected] = useState<string | undefined>();
  const [msg, setMsg] = useState('');
  const [estadoMapa, setEstadoMapa] = useState<EstadoMapa>(() => ({ fase: Platform.OS === 'web' && temChaveGoogleMapsWeb() ? 'carregando' : 'ilustrativo' }));
  const [fimContador, setFimContador] = useState(0);
  /* Medidas reais: área da tela, cabeçalho da folha, bloco da prévia e conteúdo que rola. */
  const [alturaArea, setAlturaArea] = useState(0);
  const [alturaCabeca, setAlturaCabeca] = useState(80);
  const [alturaBloco, setAlturaBloco] = useState(0);
  const [alturaConteudo, setAlturaConteudo] = useState(0);
  const [aberta, setAberta] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  /* 0 = folha recolhida, 1 = aberta. A posição em px sai disso, então uma medida nova não faz a folha pular. */
  const progresso = useRef(new Animated.Value(0)).current;
  const vivo = useRef({ aberta: false, curso: 0, semCurso: false, inicio: 0, atual: 0 });
  const reduzir = useRef(false);
  const rolagem = useRef<any>(null);
  const listaRef = useRef<any>(null);
  const botaoRef = useRef<any>(null);
  const filtradas = useMemo(() => aplicarFiltros(estacoes, filters, usuario?.tipoConector), [filters, usuario?.tipoConector]);
  const visible = useMemo(() => buscarEstacoes(filtradas, query), [filtradas, query]);
  const selected = visible.find((s) => s.id === selectedId);
  useEffect(() => {
    let ativo = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (ativo) reduzir.current = v; }).catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v: boolean) => { reduzir.current = v; });
    return () => { ativo = false; sub?.remove?.(); };
  }, []);
  const irPara = useCallback((abrir: boolean) => {
    vivo.current.aberta = abrir;
    setAberta(abrir);
    if (!abrir) {
      rolagem.current?.scrollTo?.({ y: 0, animated: false });
      /* Se o foco estava num card, ele volta para o botão da folha antes de a lista ficar inerte. */
      const doc: any = Platform.OS === 'web' ? (globalThis as any).document : null;
      if (doc && listaRef.current?.contains?.(doc.activeElement)) botaoRef.current?.focus?.();
    }
    progresso.stopAnimation();
    if (reduzir.current) progresso.setValue(abrir ? 1 : 0);
    else Animated.timing(progresso, { toValue: abrir ? 1 : 0, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [progresso]);
  /* Arrasto vertical da folha. No cabeçalho um toque também abre ou recolhe; no bloco da prévia só o arrasto conta. */
  const criarArrasto = useCallback((toqueAlterna: boolean) => {
    const vertical = (g: { dx: number; dy: number }) => !vivo.current.semCurso && Math.abs(g.dy) > 6 && Math.abs(g.dy) > Math.abs(g.dx);
    return PanResponder.create({
      onStartShouldSetPanResponder: () => toqueAlterna && !vivo.current.semCurso,
      onMoveShouldSetPanResponder: (_e, g) => vertical(g),
      onMoveShouldSetPanResponderCapture: (_e, g) => vertical(g),
      onPanResponderGrant: () => {
        progresso.stopAnimation((v) => { vivo.current.inicio = v; vivo.current.atual = v; });
        setArrastando(true);
      },
      onPanResponderMove: (_e, g) => {
        const v = Math.max(0, Math.min(1, vivo.current.inicio - g.dy / Math.max(vivo.current.curso, 1)));
        vivo.current.atual = v;
        progresso.setValue(v);
      },
      onPanResponderRelease: (_e, g) => {
        setArrastando(false);
        if (Math.abs(g.dy) < 6 && Math.abs(g.dx) < 6) { irPara(toqueAlterna ? !vivo.current.aberta : vivo.current.aberta); return; }
        irPara(g.vy < -0.3 ? true : g.vy > 0.3 ? false : vivo.current.atual > 0.5);
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => { setArrastando(false); irPara(vivo.current.aberta); },
    });
  }, [progresso, irPara]);
  const arrastoCabeca = useMemo(() => criarArrasto(true), [criarArrasto]);
  const arrastoBloco = useMemo(() => criarArrasto(false), [criarArrasto]);
  useFocusEffect(
    useCallback(() => {
      const id = route.params?.focusStationId;
      if (!id) return;
      setQuery('');
      if (!estacoes.some((s) => s.id === id)) {
        setSelected(undefined);
        setMsg('O posto solicitado não existe neste cenário.');
      } else {
        if (!filtradas.some((s) => s.id === id)) {
          setFilters({ ...FILTROS_PADRAO, compatibleOnly: false });
          setMsg('Filtros limpos para mostrar este posto. Veja a compatibilidade na ficha.');
        } else setMsg('');
        setSelected(id);
      }
      /* Chegou com um posto pedido: a folha desce para o pino e a prévia aparecerem. */
      if (vivo.current.aberta) irPara(false);
      nav.setParams({ focusStationId: undefined, focusRequestId: undefined });
    }, [route.params?.focusStationId, route.params?.focusRequestId, filtradas, nav, setFilters, irPara]),
  );
  useEffect(() => {
    if (selectedId && !visible.some((s) => s.id === selectedId)) {
      setSelected(undefined);
      setMsg('A seleção foi limpa: o posto saiu da busca ou dos filtros.');
    }
  }, [visible, selectedId]);
  const select = (id: string) => {
    setSelected(id);
    setMsg('');
    nav.setParams({ focusStationId: undefined, focusRequestId: undefined });
    if (vivo.current.aberta) irPara(false);
  };
  const limpar = () => {
    resetarFiltros();
    setQuery('');
    setMsg('');
  };
  const ativos = Object.keys(FILTROS_PADRAO).filter((k) => JSON.stringify((filters as any)[k]) !== JSON.stringify((FILTROS_PADRAO as any)[k])).length;
  const topo = Math.max(insets.top, 48) + 8;
  /* Fim da busca e do contador sobre o mapa: pinos e enquadramento do Google ficam abaixo disso. */
  const reservaSuperior = fimContador || topo + 96;
  const dock = DOCK + insets.bottom;
  const H = alturaArea || janela.height;
  /* Aberta, a folha para logo abaixo do contador: busca e filtros seguem à mão. */
  const alturaMaxima = Math.max(0, H - dock - (reservaSuperior + 12));
  /* Recolhida: cabeçalho (puxador, título e estado do mapa) e, se houver, prévia do posto, aviso ou estado vazio. */
  const alturaBaixa = Math.min(alturaMaxima, alturaCabeca + (alturaBloco > 0 ? alturaBloco + 12 : 0) + FOLGA_DOCK);
  /* Aberta: cabe o conteúdo todo ou vai até o contador e rola por dentro. */
  const conteudoUtil = Math.max(0, alturaConteudo - (dock + 46));
  const alturaAberta = Math.max(alturaBaixa, Math.min(alturaMaxima, alturaCabeca + conteudoUtil + FOLGA_DOCK));
  const curso = alturaAberta - alturaBaixa;
  const semCurso = alturaConteudo > 0 && curso < CURSO_MINIMO;
  vivo.current.curso = curso;
  vivo.current.semCurso = semCurso;
  /* Recolhida, a lista some para leitor de tela, teclado e toque; volta durante o arrasto e com a folha aberta. */
  const listaAtiva = semCurso || aberta || arrastando;
  const rolaDentro = aberta || semCurso;
  const translateY = progresso.interpolate({ inputRange: [0, 1], outputRange: [curso, 0] });
  const opacidadeLista = semCurso ? 1 : progresso.interpolate({ inputRange: [0, Math.min(1, 60 / Math.max(curso, 1))], outputRange: [0, 1], extrapolate: 'clamp' });
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const no = listaRef.current;
    if (no && typeof no === 'object' && 'inert' in no) no.inert = !listaAtiva;
  }, [listaAtiva]);
  const suave = escuro ? '#A9A6B8' : '#4E4C58';
  const folha = escuro ? '#EEEDF8' : '#FFFFFF';
  const falhou = estadoMapa.fase === 'lento' || estadoMapa.fase === 'recusado';
  /* Sem posto escolhido, ou enquanto o Google carrega ou falha, uma linha curta diz o que o mapa mostra. */
  const mostrarEstado = visible.length > 0 && (!selected || falhou || estadoMapa.fase === 'carregando');
  const csSel = selected ? conectoresCorrespondentes(selected, filters, usuario?.tipoConector) : [];
  const stSel = (selected && csSel.length ? statusDosConectores(csSel) : 'offline') as StatusConector;
  const rotuloSel = !csSel.length ? 'Fora dos filtros' : stSel === 'available' ? 'Conector disponível' : stSel === 'busy' ? 'Conector ocupado' : 'Fora de serviço';
  return (
    <Pagina title="Explore os postos" clima="mapa" semCabecalho rolar={false}>
      <View onLayout={(e) => { const h = Math.round(e.nativeEvent.layout.height); setAlturaArea((v) => (Math.abs(v - h) > 1 ? h : v)); }} style={{ flex: 1, overflow: 'hidden' }}>
        {/* O mapa fica fora do fluxo, por baixo de tudo: a altura da área vem da tela, não do próprio mapa.
            No fluxo, ao diminuir a janela ou girar o celular a área ficava presa na altura antiga e a folha descia para trás do dock. */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {visible.length ? <MapaGoogle estacoes={visible} selectedId={selectedId} fadedIds={[]} onSelectStation={select} altura={H} reservaSuperior={reservaSuperior} reservaInferior={dock + alturaBaixa} onStatus={setEstadoMapa} /> : <View style={{ flex: 1, backgroundColor: colors.mapBase }} />}
        </View>
        <View style={{ position: 'absolute', top: topo, left: 16, right: 16, flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1, minWidth: 0, height: 52, borderRadius: 18, borderWidth: 1, borderColor: '#858293', backgroundColor: escuro ? '#1C1B21' : '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, shadowColor: '#121116', shadowOffset: { width: 0, height: 8 }, shadowOpacity: escuro ? 0.4 : 0.1, shadowRadius: 20 }}>
            <Ionicons name="search" size={18} color={suave} />
            <TextInput accessibilityLabel="Buscar posto ou endereço" value={query} onChangeText={setQuery} placeholder="Buscar posto ou endereço" placeholderTextColor={suave} style={{ flex: 1, minWidth: 0, minHeight: 40, padding: 0, fontSize: 15 * fontScale, color: escuro ? '#EEEDF8' : '#1B1A20' }} />
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Ajustar filtros" onPress={() => nav.navigate('Filters')} style={({ pressed }) => ({ width: 52, height: 52, borderRadius: 18, backgroundColor: escuro ? '#EEEDF8' : '#242428', alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}>
            <Ionicons name="options-outline" size={20} color={escuro ? '#1B1A20' : '#EEEDF8'} />
            {ativos > 0 ? (
              <View style={{ position: 'absolute', top: -6, right: -6, minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 4, backgroundColor: '#8B4DF0', borderWidth: 2, borderColor: escuro ? '#1A1920' : '#EEEDF8', alignItems: 'center', justifyContent: 'center' }}>
                <Texto style={{ fontSize: 12, fontWeight: '600', color: '#FFFFFF' }}>{String(ativos)}</Texto>
              </View>
            ) : null}
          </Pressable>
        </View>
        <View onLayout={(e) => { const { y, height } = e.nativeEvent.layout; const fim = Math.round(y + height); setFimContador((v) => (Math.abs(v - fim) > 1 ? fim : v)); }} style={{ position: 'absolute', top: topo + 64, left: 16, right: 16, flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <View style={{ minHeight: 32, paddingHorizontal: 13, paddingVertical: 6, borderRadius: 999, backgroundColor: escuro ? 'rgba(18,17,22,0.90)' : 'rgba(36,36,40,0.92)', borderWidth: escuro ? 1 : 0, borderColor: 'rgba(238,237,248,0.12)', flexDirection: 'row', alignItems: 'center', gap: 7, flexShrink: 1 }}>
            <Texto accessibilityRole="header" aria-level={2} style={{ fontSize: 12, fontWeight: '600', color: '#EEEDF8' }}>{visible.length} de {estacoes.length} postos nos filtros</Texto>
            {ativos > 0 ? <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#A9A6B8' }} /> : null}
            {ativos > 0 ? <Texto style={{ fontSize: 12, fontWeight: '600', color: '#EEEDF8' }}>{ativos === 1 ? '1 filtro ativo' : `${ativos} filtros ativos`}</Texto> : null}
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Limpar filtros e busca" onPress={limpar} style={({ pressed }) => ({ minHeight: 32, paddingHorizontal: 12, borderRadius: 999, backgroundColor: escuro ? 'rgba(18,17,22,0.90)' : 'rgba(36,36,40,0.92)', borderWidth: escuro ? 1 : 0, borderColor: 'rgba(238,237,248,0.12)', flexDirection: 'row', alignItems: 'center', gap: 6, opacity: pressed ? 0.85 : 1 })}>
            <Ionicons name="refresh-outline" size={14} color="#EEEDF8" />
            <Texto style={{ fontSize: 12, fontWeight: '600', color: '#EEEDF8' }}>Limpar</Texto>
          </Pressable>
        </View>
        <Animated.View testID="flui-folha-mapa" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: alturaAberta + dock, transform: [{ translateY }], borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: folha, shadowColor: '#121116', shadowOffset: { width: 0, height: -12 }, shadowOpacity: escuro ? 0.5 : 0.12, shadowRadius: 30 }}>
          <View {...arrastoCabeca.panHandlers} onLayout={(e) => { const h = Math.round(e.nativeEvent.layout.height); setAlturaCabeca((v) => (Math.abs(v - h) > 1 ? h : v)); }} style={[{ paddingTop: 10, paddingHorizontal: 18, paddingBottom: 10 }, Platform.OS === 'web' ? ({ touchAction: 'none', userSelect: 'none', cursor: semCurso ? 'auto' : 'grab' } as any) : null]}>
            <View style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: '#D6D3E6', marginBottom: 10 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <Texto accessibilityRole="header" aria-level={2} style={{ fontSize: 17, fontWeight: '600', letterSpacing: -0.2, color: '#1B1A20' }}>Os mesmos postos, em lista</Texto>
                {mostrarEstado ? (
                  <View accessibilityLiveRegion="polite" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 20 }}>
                    {estadoMapa.fase === 'carregando' ? <ActivityIndicator size="small" color="#8B4DF0" /> : <Ionicons name={falhou ? 'cloud-offline-outline' : 'map-outline'} size={16} color="#4E4C58" />}
                    <Texto style={{ flex: 1, minWidth: 0, fontSize: 13, lineHeight: 18, color: '#4E4C58' }}>{TEXTO_MAPA[estadoMapa.fase]}</Texto>
                  </View>
                ) : null}
              </View>
              {semCurso ? null : (
                <Pressable ref={botaoRef} accessibilityRole="button" accessibilityLabel={aberta ? 'Recolher a lista de postos' : 'Mostrar a lista de postos'} aria-expanded={aberta} onPress={() => irPara(!aberta)} style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 14, backgroundColor: escuro ? '#FFFFFF' : '#F6F5FB', alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1 })}>
                  <Ionicons name={aberta ? 'chevron-down' : 'chevron-up'} size={20} color="#1B1A20" />
                </Pressable>
              )}
            </View>
          </View>
          <ScrollView ref={rolagem} scrollEnabled={rolaDentro} showsVerticalScrollIndicator={rolaDentro} keyboardShouldPersistTaps="handled" onContentSizeChange={(_w, h) => { const a = Math.round(h); setAlturaConteudo((v) => (Math.abs(v - a) > 1 ? a : v)); }} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: dock + 46, gap: 12 }}>
            <View {...(aberta ? {} : arrastoBloco.panHandlers)} onLayout={(e) => { const h = Math.round(e.nativeEvent.layout.height); setAlturaBloco((v) => (Math.abs(v - h) > 1 ? h : v)); }} style={[{ gap: 12 }, Platform.OS === 'web' && !aberta ? ({ userSelect: 'none' } as any) : null]}>
              {estadoMapa.tentarDeNovo ? (
                <Pressable accessibilityRole="button" accessibilityLabel="Tentar abrir o Google Maps de novo" onPress={estadoMapa.tentarDeNovo} style={({ pressed }) => ({ alignSelf: 'flex-start', minHeight: 44, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#E6DCFF', alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}>
                  <Texto style={{ fontSize: 13, fontWeight: '600', color: '#5B2BBF' }}>Tentar de novo</Texto>
                </Pressable>
              ) : null}
              {msg ? <Mensagem>{msg}</Mensagem> : null}
              {selected ? (
                <View style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                    <View style={{ width: 64, flexShrink: 0 }}>
                      <FotoPosto id={selected.id} style={{ height: 64, borderRadius: 14 }} />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Texto accessibilityRole="header" aria-level={2} style={{ fontSize: 17, fontWeight: '600', letterSpacing: -0.2, color: '#1B1A20' }}>{selected.name}</Texto>
                      <Texto style={{ fontSize: 12, color: '#4E4C58', marginTop: 2 }}>{selected.address} · {selected.is24h ? 'Aberto 24 horas' : selected.openHours}</Texto>
                      <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 6 }}>
                        <Ionicons name={iconeStatus[stSel]} size={14} color={corStatus[stSel]} />
                        <Texto style={{ fontSize: 12, fontWeight: '600', color: corStatus[stSel] }}>{rotuloSel}</Texto>
                      </View>
                    </View>
                    <Pressable accessibilityRole="button" accessibilityLabel="Limpar seleção" onPress={() => setSelected(undefined)} style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 14, backgroundColor: escuro ? '#FFFFFF' : '#F6F5FB', alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1 })}>
                      <Ionicons name="close" size={20} color="#1B1A20" />
                    </Pressable>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {selected.connectors.map((c) => <Conector key={c.id} tipo={c.type} status={c.status as StatusConector} rotulo={rot(c.status)} fundo={escuro ? '#FFFFFF' : undefined} />)}
                  </View>
                  <Pressable accessibilityRole="button" accessibilityLabel="Abrir ficha do posto selecionado" onPress={() => nav.navigate('StationDetail', { stationId: selected.id })} style={({ pressed }) => ({ minHeight: 50, borderRadius: 16, backgroundColor: '#8B4DF0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 18, opacity: pressed ? 0.9 : 1 })}>
                    <Texto style={{ fontSize: 15, fontWeight: '600', color: '#FFFFFF' }}>Abrir ficha do posto</Texto>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </Pressable>
                </View>
              ) : null}
              {!visible.length ? <Vazio titulo="Nenhum posto no mapa ou na lista" descricao="Revise o conector, a potência ou a busca." acao={{ label: 'Limpar filtros e busca', onPress: limpar }} /> : null}
            </View>
            <Animated.View style={{ opacity: opacidadeLista }}>
              <View ref={listaRef} aria-hidden={!listaAtiva} style={{ gap: 12, pointerEvents: listaAtiva ? 'auto' : 'none' }}>
                {visible.map((s) => (
                  <View key={s.id} style={escuro ? { borderRadius: 25, borderWidth: 1, borderColor: '#D6D3E6' } : undefined}>
                    <CartaoEstacao station={s} onPress={() => nav.navigate('StationDetail', { stationId: s.id })} />
                  </View>
                ))}
                <AvisoDemo sobreClaro />
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </View>
    </Pagina>
  );
}
export default TelaMapa;
