import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
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
import { CartaoEstacao } from '../componentes/CartaoEstacao';
import { Pagina, Mensagem, Vazio, AvisoDemo } from '../componentes/Interface';
import { Conector, StatusConector, corStatus, iconeStatus } from '../componentes/AssinaturaFlui';

const rot = (s: string) => (s === 'available' ? 'disponível' : s === 'busy' ? 'ocupado' : 'fora de serviço');

/* Mapa da prancha r7: mapa em tela cheia, busca em capsula, contador, folha com a previa e a lista. */
export function TelaMapa() {
  const { colors, modo, fontScale } = usarTema();
  const escuro = modo === 'dark';
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { filters, setFilters, resetarFiltros } = usarFiltros();
  const { usuario } = usarAutenticacao();
  const [query, setQuery] = useState('');
  const [selectedId, setSelected] = useState<string | undefined>();
  const [msg, setMsg] = useState('');
  const filtradas = useMemo(() => aplicarFiltros(estacoes, filters, usuario?.tipoConector), [filters, usuario?.tipoConector]);
  const visible = useMemo(() => buscarEstacoes(filtradas, query), [filtradas, query]);
  const selected = visible.find((s) => s.id === selectedId);
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
          setMsg('Filtros limpos para destacar o posto solicitado. Confira a compatibilidade na ficha.');
        } else setMsg('Posto selecionado a partir da ficha ou do planejamento.');
        setSelected(id);
      }
      nav.setParams({ focusStationId: undefined, focusRequestId: undefined });
    }, [route.params?.focusStationId, route.params?.focusRequestId, filtradas, nav, setFilters]),
  );
  useEffect(() => {
    if (selectedId && !visible.some((s) => s.id === selectedId)) {
      setSelected(undefined);
      setMsg('A seleção foi limpa porque o posto não atende à busca e aos filtros atuais.');
    }
  }, [visible, selectedId]);
  const select = (id: string) => {
    setSelected(id);
    setMsg('');
    nav.setParams({ focusStationId: undefined, focusRequestId: undefined });
  };
  const limpar = () => {
    resetarFiltros();
    setQuery('');
    setMsg('');
  };
  const ativos = Object.keys(FILTROS_PADRAO).filter((k) => JSON.stringify((filters as any)[k]) !== JSON.stringify((FILTROS_PADRAO as any)[k])).length;
  const topo = Math.max(insets.top, 48) + 8;
  const suave = escuro ? '#A9A6B8' : '#4E4C58';
  const folha = escuro ? '#EEEDF8' : '#FFFFFF';
  const descricao = Platform.OS === 'web' ? (temChaveGoogleMapsWeb() ? 'Google Maps · selecione um posto.' : 'Mapa ilustrativo · selecione um posto.') : 'Posições do cenário · selecione um posto.';
  const csSel = selected ? conectoresCorrespondentes(selected, filters, usuario?.tipoConector) : [];
  const stSel = (selected && csSel.length ? statusDosConectores(csSel) : 'offline') as StatusConector;
  const rotuloSel = !csSel.length ? 'Fora dos filtros' : stSel === 'available' ? 'Conector disponível' : stSel === 'busy' ? 'Conector ocupado' : 'Fora de serviço';
  return (
    <Pagina title="Explore os postos" clima="mapa" semCabecalho>
      <View style={{ height: 520 }}>
        {visible.length ? <MapaGoogle estacoes={visible} selectedId={selectedId} fadedIds={[]} onSelectStation={select} /> : <View style={{ flex: 1, backgroundColor: colors.mapBase }} />}
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
        <View style={{ position: 'absolute', top: topo + 64, left: 16, right: 16, flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
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
      </View>
      <View style={{ marginTop: -58, flexGrow: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: folha, paddingTop: 10, paddingHorizontal: 18, paddingBottom: 130 + insets.bottom, gap: 12, shadowColor: '#121116', shadowOffset: { width: 0, height: -12 }, shadowOpacity: escuro ? 0.5 : 0.12, shadowRadius: 30 }}>
        <View style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: '#D6D3E6' }} />
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
        ) : (
          <Texto style={{ fontSize: 13, lineHeight: 18, color: '#4E4C58' }}>{descricao}</Texto>
        )}
        {!visible.length ? <Vazio titulo="Nenhum posto no mapa ou na lista" descricao="Revise o conector, a potência ou a busca." acao={{ label: 'Limpar filtros e busca', onPress: limpar }} /> : null}
        <Texto accessibilityRole="header" aria-level={2} style={{ fontSize: 17, fontWeight: '600', letterSpacing: -0.2, color: '#1B1A20', marginTop: 6 }}>Os mesmos postos, em lista</Texto>
        {visible.map((s) => (
          <View key={s.id} style={escuro ? { borderRadius: 25, borderWidth: 1, borderColor: '#D6D3E6' } : undefined}>
            <CartaoEstacao station={s} onPress={() => nav.navigate('StationDetail', { stationId: s.id })} />
          </View>
        ))}
        <Texto style={{ fontSize: 11, lineHeight: 16, color: '#4E4C58' }}>Pontos e estados do cenário, não dados em tempo real.</Texto>
        <AvisoDemo sobreClaro />
      </View>
    </Pagina>
  );
}
export default TelaMapa;
