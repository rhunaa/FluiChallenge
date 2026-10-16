import React from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ChaveComodidade, TipoConector } from '../tipos';
import { usarFiltros } from '../contexto/ContextoFiltro';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { estacoes } from '../dados/estacoes';
import { aplicarFiltros, FILTROS_PADRAO } from '../utilitarios/filtrarEstacoes';
import { Pagina, Opcao, Botao, AvisoDemo, Vazio, linha } from '../componentes/Interface';
import { Texto } from '../componentes/Texto';
import { FaixaFlui } from '../componentes/PaineisFlui';
import { CartaoEstacao } from '../componentes/CartaoEstacao';
import { Capitulo, Secao, usarCoresTela } from '../componentes/AssinaturaFlui';

type Icone = keyof typeof Ionicons.glyphMap;
const tipos: TipoConector[] = ['CCS Combo2', 'CHAdeMO', 'Tipo 2', 'Tesla NACS'];
const comodidades: [ChaveComodidade, string][] = [
  ['wifi', 'Wi-Fi'],
  ['cafe', 'Café'],
  ['restroom', 'Banheiro'],
  ['shopping', 'Shopping'],
  ['food', 'Alimentação'],
  ['parking', 'Estacionamento'],
];

/* Recarga da r7: modos em cartoes, faixa do perfil e capitulos de filtros sobre o fundo. */
export function TelaFiltros() {
  const nav = useNavigation<any>();
  const { filters: f, setFilters, resetarFiltros } = usarFiltros();
  const { usuario } = usarAutenticacao();
  const { cartao, bordaCartao, txt2 } = usarCoresTela();
  const result = aplicarFiltros(estacoes, f, usuario?.tipoConector);
  const modos: { label: string; descricao: string; icon: Icone; apply: () => void }[] = [
    { label: 'Disponíveis', descricao: 'Só conectores livres no cenário', icon: 'checkmark-circle-outline', apply: () => setFilters({ ...FILTROS_PADRAO, onlyAvailable: true }) },
    { label: '100 kW ou mais', descricao: 'Recarga rápida e livre', icon: 'flash-outline', apply: () => setFilters({ ...FILTROS_PADRAO, minPower: 100, onlyAvailable: true }) },
    { label: 'Café e Wi-Fi', descricao: 'Para esperar com conforto', icon: 'cafe-outline', apply: () => setFilters({ ...FILTROS_PADRAO, amenities: ['cafe', 'wifi'] }) },
  ];
  const nota = (t: string) => <Texto style={{ fontSize: 12, lineHeight: 17, color: txt2 }}>{t}</Texto>;
  return (
    <Pagina title="Encontrar minha recarga" subtitle="Conectores e comodidades para a sua próxima parada.">
      <Secao titulo="Modos de recarga" sub="Um toque aplica um conjunto de filtros." />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {modos.map((m) => (
          <Pressable key={m.label} accessibilityRole="button" accessibilityLabel={m.label} onPress={m.apply} style={({ pressed }) => ({ flexGrow: 1, flexBasis: 150, minHeight: 104, padding: 16, gap: 10, borderRadius: 24, backgroundColor: cartao, borderWidth: 1, borderColor: bordaCartao, opacity: pressed ? 0.86 : 1 })}>
            <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#E6DCFF', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={m.icon} size={19} color="#5B2BBF" />
            </View>
            <Texto style={{ fontSize: 15, fontWeight: '600', color: '#1B1A20' }}>{m.label}</Texto>
            <Texto style={{ fontSize: 12, lineHeight: 16, color: '#4E4C58' }}>{m.descricao}</Texto>
          </Pressable>
        ))}
      </View>
      <FaixaFlui label="SEU PERFIL DE RECARGA" value={usuario?.tipoConector || 'Escolha seu veículo'} detail={`${result.length} postos nos filtros · unidades do cenário`} icon="car-outline" />
      <Secao titulo="Refine sua próxima parada" />
      <Capitulo num="01" titulo="Compatibilidade e status" />
      {nota(`Seu veículo: ${usuario?.tipoConector ?? '—'}`)}
      <View style={linha}>
        <Opcao label={`Somente compatíveis: ${f.compatibleOnly ? 'sim' : 'não'}`} selected={f.compatibleOnly} onPress={() => setFilters({ ...f, compatibleOnly: !f.compatibleOnly })} />
        <Opcao label={`Somente disponíveis: ${f.onlyAvailable ? 'sim' : 'não'}`} selected={f.onlyAvailable} onPress={() => setFilters({ ...f, onlyAvailable: !f.onlyAvailable })} />
      </View>
      {nota('Tipo, potência e disponibilidade precisam pertencer ao mesmo conector.')}
      <Capitulo num="02" titulo="Tipo de conector" />
      {nota('Selecione um ou mais tipos; nenhuma seleção permite qualquer tipo.')}
      <View style={linha}>
        {tipos.map((t) => (
          <Opcao key={t} label={t} selected={f.connectorTypes.includes(t)} onPress={() => setFilters({ ...f, connectorTypes: f.connectorTypes.includes(t) ? f.connectorTypes.filter((x) => x !== t) : [...f.connectorTypes, t] })} />
        ))}
      </View>
      <Capitulo num="03" titulo="Potência mínima" />
      <View accessibilityRole="radiogroup" accessibilityLabel="Potência mínima" style={linha}>
        {[null, 50, 100, 150, 300].map((p) => (
          <Opcao key={String(p)} kind="radio" label={p == null ? 'Qualquer potência' : `${p} kW+`} selected={f.minPower === p} onPress={() => setFilters({ ...f, minPower: p })} />
        ))}
      </View>
      <Capitulo num="04" titulo="Comodidades" />
      <View style={linha}>
        {comodidades.map(([k, l]) => (
          <Opcao key={k} label={l} selected={f.amenities.includes(k)} onPress={() => setFilters({ ...f, amenities: f.amenities.includes(k) ? f.amenities.filter((x) => x !== k) : [...f.amenities, k] })} />
        ))}
      </View>
      <Capitulo num="05" titulo="Funcionamento" />
      <View accessibilityRole="radiogroup" accessibilityLabel="Funcionamento" style={linha}>
        {([['any', 'Qualquer horário'], ['24h', '24 horas'], ['commercial', 'Horário limitado']] as const).map(([v, l]) => (
          <Opcao key={v} kind="radio" label={l} selected={f.hoursMode === v} onPress={() => setFilters({ ...f, hoursMode: v })} />
        ))}
      </View>
      <Botao variant="secondary" label="Limpar filtros" onPress={resetarFiltros} />
      <Secao titulo={`${result.length} postos nos filtros`} />
      <Botao label="Ver estes postos no mapa" icon="map-outline" onPress={() => nav.navigate('Map')} />
      {result.length ? result.map((s) => <CartaoEstacao key={s.id} station={s} onPress={() => nav.navigate('StationDetail', { stationId: s.id })} />) : <Vazio titulo="Nenhum conector atende a tudo" descricao="Reduza a potência, revise os tipos ou altere a compatibilidade. Um conector Tipo 2 de 22 kW não atende a uma busca de 100 kW." acao={{ label: 'Limpar filtros', onPress: resetarFiltros }} />}
      <AvisoDemo />
    </Pagina>
  );
}
export default TelaFiltros;
