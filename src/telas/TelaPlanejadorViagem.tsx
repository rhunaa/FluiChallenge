import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Texto } from '../componentes/Texto';
import { estacoes, buscarEstacaoPorId } from '../dados/estacoes';
import { planejarRota } from '../dados/planejadorRota';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { usarViagem } from '../contexto/ContextoViagem';
import { buscarEstacoes } from '../utilitarios/filtrarEstacoes';
import { Pagina, Campo, Botao, Mensagem, Opcao, Vazio, linha } from '../componentes/Interface';
import { Faixa, Numero, Overline, Palco, SeparadorFaixa, usarCoresTela } from '../componentes/AssinaturaFlui';

type TipoNo = 'origem' | 'parada' | 'destino';

/* No do itinerario da prancha: ponto grafite com anel lavanda; parada em lima com raio; destino em energia. */
function No({ tipo, marca, titulo, linhas, children }: { tipo: TipoNo; marca: string; titulo: string; linhas: string[]; children?: React.ReactNode }) {
  const ponto = tipo === 'parada' ? { backgroundColor: '#C0F589', borderColor: '#242428' } : tipo === 'destino' ? { backgroundColor: '#8B4DF0', borderColor: '#E6DCFF' } : { backgroundColor: '#242428', borderColor: '#C9B6FF' };
  return (
    <View style={{ flexDirection: 'row', gap: 14, paddingVertical: 6 }}>
      <View style={{ width: 25, height: 25, borderRadius: 13, borderWidth: 3, alignItems: 'center', justifyContent: 'center', ...ponto }}>
        {tipo === 'parada' ? <Ionicons name="flash" size={12} color="#121116" /> : null}
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
        <Overline cor={tipo === 'parada' ? '#C0F589' : '#C9B6FF'} espaco={1}>{marca}</Overline>
        <Texto accessibilityRole="header" aria-level={3} style={{ fontSize: 15, fontWeight: '600', color: '#EEEDF8' }}>{titulo}</Texto>
        {linhas.map((l) => (
          <Texto key={l} style={{ fontSize: 12, lineHeight: 17, color: '#A9A6B8' }}>{l}</Texto>
        ))}
        {children}
      </View>
    </View>
  );
}

/* Planejador da prancha r7: campos sobre o fundo e o resultado num palco com faixa de tres numeros e itinerario em linha. */
export function TelaPlanejadorViagem() {
  const [allSuggestions, setAllSuggestions] = useState(false);
  const nav = useNavigation<any>();
  const { usuario } = usarAutenticacao();
  const { plano, salvarPlano } = usarViagem();
  const { txt, txt2 } = usarCoresTela();
  const [id, setId] = useState<string | undefined>(plano?.destinoId);
  const [query, setQuery] = useState(plano ? buscarEstacaoPorId(plano.destinoId)?.name || '' : '');
  const [range, setRange] = useState(String(plano?.autonomiaKm || usuario?.autonomiaKm || 80));
  const n = Number(range.replace(',', '.'));
  const valid = /^\d{1,4}([.,]\d{1,2})?$/.test(range) && n >= 1 && n <= 1500;
  const destination = buscarEstacaoPorId(id || '');
  const result = plano !== null && plano.destinoId === id && plano.tipoConector === usuario?.tipoConector ? plano.resultado : null;
  const suggestions = !id ? buscarEstacoes(estacoes, query).slice(0, 8) : [];
  const lista = allSuggestions || query.trim() ? suggestions : suggestions.slice(0, 3);
  const mapa = (stationId: string) => nav.navigate('Tabs', { screen: 'Map', params: { focusStationId: stationId, focusRequestId: Date.now() } });
  const change = (t: string) => {
    setRange(t);
    salvarPlano(null);
  };
  return (
    <Pagina title="Planejar viagem" subtitle="Paradas calculadas com os dados do cenário." back profile={false} clima="planejador">
      <Campo label="Destino do cenário" value={query} onChangeText={(t) => { setQuery(t); setId(undefined); salvarPlano(null); }} placeholder="Procure um posto pelo nome ou endereço" icone="location-outline" help="Saída do marco zero (km 0) do corredor demonstrativo." />
      {lista.map((s) => (
        <Botao key={s.id} variant="secondary" label={`${s.name} · marco ${s.demoRouteKm} km`} onPress={() => { setId(s.id); setQuery(s.name); salvarPlano(null); }} />
      ))}
      {!id && !query.trim() && suggestions.length > 3 ? <Botao variant="secondary" label={allSuggestions ? 'Mostrar menos destinos' : 'Ver todos os destinos do cenário'} onPress={() => setAllSuggestions((v) => !v)} /> : null}
      {!id && query.trim().length > 0 && !suggestions.length ? <Mensagem>Nenhum destino encontrado. Tente outro nome ou endereço.</Mensagem> : null}
      <Campo label="Autonomia informada para o cenário (km)" value={range} onChangeText={change} keyboardType="decimal-pad" maxLength={8} icone="battery-half-outline" help="Valor manual entre 1 e 1500 km, não medido pelo veículo." />
      <View style={linha}>
        {[40, 80, 120].map((v) => (
          <Opcao key={v} label={`${v} km`} onPress={() => change(String(v))} />
        ))}
      </View>
      <Texto style={{ fontSize: 13, lineHeight: 19, color: txt2 }}>{`Conector: ${usuario?.tipoConector ?? '—'} · margem de segurança: 10%.`}</Texto>
      <Botao label="Planejar neste cenário" icon="navigate" disabled={!destination || !valid} onPress={() => { if (destination && usuario) salvarPlano({ destinoId: destination.id, autonomiaKm: n, tipoConector: usuario.tipoConector, resultado: planejarRota(destination, n, estacoes, { tipoConector: usuario.tipoConector, margemSeguranca: 0.1 }) }); }} />
      {result ? (
        result.viavel ? (
          <Palco>
            <Overline>ITINERÁRIO DO CENÁRIO</Overline>
            <Texto accessibilityRole="header" aria-level={2} style={{ fontSize: 21, fontWeight: '600', letterSpacing: -0.3, color: '#EEEDF8' }}>Planejamento viável neste cenário</Texto>
            <Faixa>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Numero valor={String(result.distanciaTotalKm)} unidade=" km" tamanho={32} />
                <Overline espaco={1}>distância</Overline>
              </View>
              <SeparadorFaixa />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Numero valor={String(result.paradas.length)} tamanho={32} />
                <Overline espaco={1}>{result.paradas.length === 1 ? 'parada' : 'paradas'}</Overline>
              </View>
              <SeparadorFaixa />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Numero valor={(n * 0.9).toFixed(0)} unidade=" km" tamanho={32} />
                <Overline espaco={1}>por trecho</Overline>
              </View>
            </Faixa>
            <Texto style={{ fontSize: 12, lineHeight: 17, color: '#A9A6B8' }}>{`${result.distanciaTotalKm} km modelados · ${result.paradas.length} ${result.paradas.length === 1 ? 'parada' : 'paradas'} · alcance útil de ${(n * 0.9).toFixed(1).replace('.', ',')} km por trecho.`}</Texto>
            <View>
              <LinearGradient pointerEvents="none" colors={['#8B4DF0', '#C9B6FF']} style={{ position: 'absolute', left: 11, top: 16, bottom: 16, width: 3, borderRadius: 2 }} />
              <No tipo="origem" marca="ORIGEM" titulo="Você" linhas={['Marco zero · km 0', `${range} km informados`]} />
              {result.paradas.map((step, i) => (
                <No key={step.estacao.id} tipo="parada" marca={`PARADA ${i + 1} · MARCO ${step.estacao.demoRouteKm} KM`} titulo={step.estacao.name} linhas={[`Trecho de ${step.distanciaTrechoKm} km no corredor`, `${step.conector.type} · ${step.conector.powerKw} kW · disponível no exemplo.`]}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    <Botao compacto variant="secondary" label="Ver ficha desta parada" onPress={() => nav.navigate('StationDetail', { stationId: step.estacao.id })} />
                    <Botao compacto variant="secondary" label="Ver esta parada no mapa" onPress={() => mapa(step.estacao.id)} />
                  </View>
                </No>
              ))}
              <No tipo="destino" marca="DESTINO" titulo={destination?.name ?? 'Destino'} linhas={[`Trecho final: ${result.trechoFinalKm} km modelados.`]}>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <Botao compacto variant="secondary" label="Ver destino no mapa" onPress={() => id && mapa(id)} />
                </View>
              </No>
            </View>
          </Palco>
        ) : (
          <Vazio titulo="Não é viável neste cenário" descricao={result.motivo || 'Revise a autonomia e o conector.'} acao={{ label: 'Editar meu veículo', onPress: () => nav.navigate('Tabs', { screen: 'Profile' }) }} />
        )
      ) : null}
      {result && result.viavel ? <Mensagem>Este resultado não inicia uma viagem real. Seu itinerário fica preservado nesta sessão ao consultar a ficha ou o mapa.</Mensagem> : null}
      <Texto style={{ fontSize: 12, lineHeight: 17, color: txt2 }}>Corredor demonstrativo, não uma rota viária. Distâncias modeladas; sem duração ou custo estimados. A autonomia informada é reutilizada após cada parada, sem modelar energia recebida.</Texto>
    </Pagina>
  );
}
export default TelaPlanejadorViagem;
