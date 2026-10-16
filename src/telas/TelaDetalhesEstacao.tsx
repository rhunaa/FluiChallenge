import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ROTULOS_COMODIDADE } from '../tipos';
import { buscarEstacaoPorId } from '../dados/estacoes';
import { creditoFoto, fotosLugares } from '../dados/fotosLugares';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { usarReservas } from '../contexto/ContextoReservas';
import { usarAvaliacoes } from '../contexto/ContextoAvaliacoes';
import { usarFavoritos } from '../contexto/ContextoFavoritos';
import { dataLocal, proximaData, parseDataLocal, formatarData, formatarHora, obterMelhoresJanelas, JanelaOcupacao } from '../utilitarios/horarios';
import { abrirNavegacao, urlNavegacao } from '../utilitarios/navegacaoExterna';
import { resumoAvaliacoes } from '../utilitarios/avaliacoes';
import { Pagina, Papel, Corpo, Campo, Opcao, Botao, Vazio, Mensagem, AvisoDemo, IconeBotao, linha } from '../componentes/Interface';
import { FaixaFlui } from '../componentes/PaineisFlui';
import { Texto } from '../componentes/Texto';
import { FotoPosto } from '../componentes/VisualFlui';
import { GraficoOcupacao } from '../componentes/GraficoOcupacao';
import { CartaoAvaliacao } from '../componentes/CartaoAvaliacao';
import { Capitulo, Conector, StatusConector, usarCoresTela } from '../componentes/AssinaturaFlui';

const rot = (s: string) => (s === 'available' ? 'disponível' : s === 'busy' ? 'ocupado' : 'fora de serviço');
const dentro = (h: number, w: JanelaOcupacao) => (w.end > w.start ? h >= w.start && h < w.end : h >= w.start || h < w.end);

function Passo({ children }: { children: string }) {
  const { escuro } = usarCoresTela();
  return <Texto style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.3, textTransform: 'uppercase', color: escuro ? '#A9A6B8' : '#4E4C58', marginTop: 4 }}>{children}</Texto>;
}

/* Fita da prancha: ocupacao de 06h a 23h, janelas sugeridas em lavanda e a escolhida em energia. Decorativa: as opcoes carregam a informacao. */
function Fita({ ocupacao, janelas, escolhida }: { ocupacao: number[]; janelas: JanelaOcupacao[]; escolhida: JanelaOcupacao | null }) {
  const { escuro } = usarCoresTela();
  const fundo = escuro ? '#1C1B21' : '#FFFFFF';
  const borda = escuro ? '#2F2E35' : '#E2E0F0';
  return (
    <View aria-hidden importantForAccessibility="no-hide-descendants">
      <View style={{ height: 54, paddingTop: 6, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'flex-end', gap: 3, backgroundColor: fundo, borderTopLeftRadius: 14, borderTopRightRadius: 14, borderWidth: 1, borderBottomWidth: 0, borderColor: borda }}>
        {Array.from({ length: 18 }, (_, i) => i + 6).map((h) => {
          const v = Math.min(1, Math.max(0, ocupacao[h] ?? 0));
          const sel = escolhida ? dentro(h, escolhida) : false;
          const jan = janelas.some((w) => dentro(h, w));
          return <View key={h} style={{ flex: 1, height: Math.max(6, v * 46), borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: sel ? '#8B4DF0' : jan ? '#C9B6FF' : escuro ? '#46434F' : '#D6D3E6', borderWidth: sel && escuro ? 1 : 0, borderColor: '#C9B6FF' }} />;
        })}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 6, backgroundColor: fundo, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, borderWidth: 1, borderTopWidth: 0, borderColor: borda }}>
        {['06h', '12h', '18h', '23h'].map((l) => <Texto key={l} style={{ fontSize: 10.5, color: escuro ? '#A9A6B8' : '#5F5D69' }}>{l}</Texto>)}
      </View>
    </View>
  );
}

/* Ficha da prancha r7: capa com a foto do local, acoes, capitulos 01 a 07 e planejamento com fita. */
export function TelaDetalhesEstacao() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const station = buscarEstacaoPorId(route.params.stationId);
  const { usuario } = usarAutenticacao();
  const { reservaDaEstacao, criarReserva, cancelarReserva } = usarReservas();
  const { reviews } = usarAvaliacoes();
  const { ehFavorito, alternarFavorito } = usarFavoritos();
  const { txt2, energia } = usarCoresTela();
  const [date, setDate] = useState(proximaData());
  const [connectorId, setConnectorId] = useState('');
  const [slot, setSlot] = useState<JanelaOcupacao | null>(null);
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState(false);
  const [aviso, setAviso] = useState({ texto: '', erro: false });
  /* Altura do bloco de textos sobre a foto: a capa cresce so quando nome, endereco e credito nao cabem nos 330 px (tela estreita ou fonte grande). */
  const [altInfo, setAltInfo] = useState(0);
  const cs = station?.connectors.filter((c) => c.type === usuario?.tipoConector && c.status === 'available') || [];
  useEffect(() => {
    setConnectorId(cs[0]?.id || '');
    setSlot(null);
    setMsg('');
  }, [station?.id, usuario?.tipoConector]);
  const windows = useMemo(() => (station && cs.length ? obterMelhoresJanelas(station.hourlyOccupancy, 3, 2, station, date) : []), [station, date, usuario?.tipoConector]);
  const saved = station ? reservaDaEstacao(station.id) : undefined;
  if (!station)
    return (
      <Pagina title="Posto não encontrado" back profile={false}>
        <Vazio titulo="Este ponto não está no cenário" descricao="Volte à lista e escolha um posto disponível." />
      </Pagina>
    );
  const rating = resumoAvaliacoes(reviews, station.id);
  const stationReviews = reviews.filter((r) => r.stationId === station.id);
  const url = urlNavegacao(station);
  const favorito = ehFavorito(station.id);
  const disponiveis = station.connectors.filter((c) => c.status === 'available').length;
  const credito = creditoFoto(station.id);
  const lugar = fotosLugares[station.id]?.lugar;
  const paginaFoto = fotosLugares[station.id]?.pagina;
  const horario = station.is24h ? 'Aberto 24 horas' : station.openHours;
  /* Topo dos botoes + botao de 44 px + 12 px de folga acima do bloco + 12 px abaixo dele. */
  const alturaTopo = Math.max(330, Math.ceil(altInfo) + Math.max(insets.top, 48) + 10 + 44 + 24);
  const dateChange = (t: string) => {
    setDate(t);
    setSlot(null);
    setMsg('');
  };
  const irMapa = () => nav.navigate('Tabs', { screen: 'Map', params: { focusStationId: station.id, focusRequestId: Date.now() } });
  const voltar = () => (nav.canGoBack() ? nav.goBack() : nav.navigate('Tabs', { screen: 'Home' }));
  const navegar = async () => {
    const ok = await abrirNavegacao(station);
    setAviso({ erro: !ok, texto: ok ? 'Navegação solicitada para as coordenadas de exemplo. Se a aba não abrir, use o link direto abaixo.' : 'Não foi possível abrir a navegação. Use o link direto ou volte ao mapa.' });
  };
  return (
    <Pagina title={station.name} back profile={false} clima="ficha" semCabecalho>
      <View style={{ height: alturaTopo }}>
        <FotoPosto id={station.id} legenda={false} style={{ height: alturaTopo, borderRadius: 0 }} />
        <LinearGradient pointerEvents="none" colors={['rgba(18,17,22,0.15)', 'rgba(18,17,22,0)', 'rgba(18,17,22,0.78)']} locations={[0, 0.3, 1]} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
        <View style={{ position: 'absolute', top: Math.max(insets.top, 48) + 10, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
          <IconeBotao variante="foto" icon="chevron-back" label="Voltar" onPress={voltar} />
          <Pressable accessibilityRole="checkbox" accessibilityLabel="Salvar nos meus lugares" accessibilityState={{ checked: favorito }} aria-checked={favorito} onPress={() => alternarFavorito(station.id)} style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(18,17,22,0.55)', alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1 })}>
            <Ionicons name={favorito ? 'bookmark' : 'bookmark-outline'} size={20} color="#EEEDF8" />
          </Pressable>
        </View>
        <View pointerEvents="box-none" onLayout={(e) => setAltInfo(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 20, right: 20, bottom: 12, gap: 6 }}>
          <View style={{ alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: 'rgba(18,17,22,0.6)' }}>
            <Texto style={{ fontSize: 10.5, fontWeight: '600', color: '#EEEDF8' }}>Foto do local</Texto>
          </View>
          <Texto aria-hidden style={{ fontSize: 28, fontWeight: '600', letterSpacing: -0.6, lineHeight: 32, color: '#EEEDF8' }}>{station.name}</Texto>
          <Texto style={{ fontSize: 13, lineHeight: 18, color: '#EEEDF8' }}>{`${station.address} · ${horario}`}</Texto>
          <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 999, backgroundColor: 'rgba(36,36,40,0.92)' }}>
            <Ionicons name={disponiveis ? 'checkmark-circle' : 'time-outline'} size={14} color={disponiveis ? '#C0F589' : '#F5C46B'} />
            <Texto style={{ fontSize: 12.5, fontWeight: '600', color: '#EEEDF8' }}>{`${disponiveis} de ${station.connectors.length} conectores disponíveis`}</Texto>
          </View>
          {credito ? <Texto numberOfLines={2} style={{ fontSize: 10, lineHeight: 13, color: 'rgba(238,237,248,0.8)' }}>{credito}</Texto> : null}
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 + insets.bottom, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Botao label="Iniciar navegação" icon="navigate-outline" hint="Abre a rota no aplicativo de mapas, fora do Flui." onPress={navegar} />
          </View>
          <IconeBotao variante="contorno" icon="map-outline" label="Ver este posto no mapa" onPress={irMapa} />
        </View>
        {aviso.texto ? <Mensagem erro={aviso.erro}>{aviso.texto}</Mensagem> : null}
        {aviso.texto ? (
          <Pressable accessibilityRole="link" accessibilityLabel="Link direto de navegação" onPress={() => Linking.openURL(url).catch(() => setAviso({ erro: true, texto: 'O aplicativo de navegação não abriu. Selecione e copie o link.' }))} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Texto selectable style={{ fontSize: 12, lineHeight: 17, color: energia, textDecorationLine: 'underline' }}>{`Link direto: ${url}`}</Texto>
          </Pressable>
        ) : null}

        <Capitulo num="01" titulo="Conectores deste posto" />
        <Texto style={{ fontSize: 13, lineHeight: 19, color: txt2 }}>{`Seu veículo utiliza ${usuario?.tipoConector ?? 'o conector do perfil'}. O estado é informado por conector, não pelo status global do posto.`}</Texto>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {station.connectors.map((c) => (
            <View key={c.id} style={{ flexGrow: 1, flexBasis: 140, minWidth: 0 }}>
              <Conector grande tipo={c.type} potencia={c.powerKw} status={c.status as StatusConector} rotulo={`${rot(c.status)} · ${c.type === usuario?.tipoConector ? 'compatível' : 'não compatível'}`} />
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
          <Ionicons name="flash" size={14} color={energia} style={{ marginTop: 2 }} />
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <Texto style={{ fontSize: 13, lineHeight: 18, fontWeight: '600', color: energia }}>{`${cs.length} ${cs.length === 1 ? 'unidade compatível disponível' : 'unidades compatíveis disponíveis'}`}</Texto>
            <Texto style={{ fontSize: 12, lineHeight: 17, color: txt2 }}>{`${station.connectors.length} unidades neste posto · sem disponibilidade ao vivo`}</Texto>
          </View>
        </View>
        <Texto style={{ fontSize: 12, lineHeight: 17, color: txt2 }}>Tarifa: não informada. Fonte: cenário local de demonstração. Consulte preço, energia, funcionamento e disponibilidade com o operador antes de viajar.</Texto>

        <Capitulo num="02" titulo="Planejar um horário" />
        <Texto style={{ fontSize: 13, lineHeight: 19, color: txt2 }}>Salve um dia, um conector e uma janela futura. Isto não reserva uma vaga, não paga uma recarga e não confirma disponibilidade futura.</Texto>
        {saved ? <Mensagem>{`Seu horário planejado: ${formatarData(saved.date)} · ${formatarHora(saved.startHour)}–${formatarHora(saved.endHour)}${saved.endHour <= saved.startHour ? ' (+1 dia)' : ''}. Substituir altera somente este posto.`}</Mensagem> : null}
        {cs.length ? (
          <>
            <Passo>Dia</Passo>
            <View accessibilityRole="radiogroup" accessibilityLabel="Dia do horário planejado" style={linha}>
              <Opcao kind="radio" label="Hoje" selected={date === dataLocal()} onPress={() => dateChange(dataLocal())} />
              <Opcao kind="radio" label="Amanhã" selected={date === proximaData()} onPress={() => dateChange(proximaData())} />
              <Opcao kind="radio" label="Depois de amanhã" selected={date === proximaData(2)} onPress={() => dateChange(proximaData(2))} />
            </View>
            <Campo label="Data do horário (AAAA-MM-DD)" value={date} onChangeText={dateChange} maxLength={10} icone="calendar-outline" help={parseDataLocal(date) ? 'Data local: ' + formatarData(date) : 'Informe uma data válida no formato AAAA-MM-DD.'} erro={!parseDataLocal(date) ? 'A data não é válida.' : undefined} />
            <Passo>Conector</Passo>
            <View accessibilityRole="radiogroup" accessibilityLabel="Conector para o horário" style={linha}>
              {cs.map((c) => (
                <Opcao key={c.id} kind="radio" label={`${c.type} · ${c.powerKw} kW`} selected={connectorId === c.id} onPress={() => { setConnectorId(c.id); setSlot(null); }} />
              ))}
            </View>
            <Passo>Janela de menor movimento</Passo>
            <Fita ocupacao={station.hourlyOccupancy} janelas={windows} escolhida={slot} />
            <View accessibilityRole="radiogroup" accessibilityLabel="Janela do horário planejado" style={linha}>
              {windows.map((w) => (
                <Opcao key={w.start} kind="radio" label={`${formatarHora(w.start)}–${formatarHora(w.end)}${w.endDayOffset ? ' (+1 dia)' : ''}`} selected={slot?.start === w.start} onPress={() => setSlot(w)} />
              ))}
            </View>
            {!windows.length ? <Mensagem>Não há janelas futuras válidas nesta data dentro do funcionamento do posto.</Mensagem> : null}
            <Botao
              label={saved ? 'Substituir horário planejado' : 'Salvar horário planejado'}
              disabled={!slot || !connectorId}
              onPress={() => {
                if (!slot) return;
                const ok = criarReserva(station.id, slot.start, slot.end, date, connectorId);
                setErro(!ok);
                setMsg(ok ? 'Horário salvo apenas nesta sessão. Nenhuma vaga foi reservada.' : 'Horário inválido ou em conflito com outro horário seu. Revise a data, o conector e o funcionamento.');
              }}
            />
          </>
        ) : (
          <Vazio titulo="Sem conector compatível disponível" descricao="Não é possível planejar este horário. Os conectores ocupados, incompatíveis ou fora de serviço não são oferecidos." acao={{ label: 'Editar veículo', onPress: () => nav.navigate('Tabs', { screen: 'Profile' }) }} />
        )}
        {saved ? (
          <Botao variant="danger" label="Cancelar este horário planejado" onPress={() => { cancelarReserva(station.id); setSlot(null); setErro(false); setMsg('Horário cancelado nesta sessão.'); }} />
        ) : null}
        {msg ? <Mensagem erro={erro}>{msg}</Mensagem> : null}
        <Texto style={{ fontSize: 12, lineHeight: 17, color: txt2 }}>Planejar um horário não garante vaga no posto.</Texto>

        <Capitulo num="03" titulo="Ocupação ilustrativa" />
        <Papel>
          <GraficoOcupacao occupancy={station.hourlyOccupancy} />
        </Papel>

        <Capitulo num="04" titulo="Funcionamento e localização" />
        <Papel>
          <Corpo>{`${station.openHours} · horário de exemplo`}</Corpo>
          <Corpo>{station.address}</Corpo>
          <Botao variant="secondary" label={favorito ? 'Remover dos meus salvos' : 'Salvar este posto'} onPress={() => alternarFavorito(station.id)} />
        </Papel>

        <Capitulo num="05" titulo="Comodidades" />
        <Papel>
          <Corpo>{station.amenities.map((k) => ROTULOS_COMODIDADE[k]).join(' · ') || 'Não informadas'}</Corpo>
        </Papel>

        <Capitulo num="06" titulo="Avaliações deste posto" />
        <Texto style={{ fontSize: 13, lineHeight: 19, color: txt2 }}>{`${rating.nota == null ? 'Ainda sem avaliação' : `${rating.nota.toFixed(1)} / 5 · ${rating.quantidade} ${rating.quantidade === 1 ? 'avaliação' : 'avaliações'}`} · incluem os exemplos iniciais e os feedbacks desta sessão.`}</Texto>
        <Botao label="Avaliar este posto" onPress={() => nav.navigate('ReportExperience', { stationId: station.id })} />
        {stationReviews.map((r) => (
          <CartaoAvaliacao key={r.id} review={r} />
        ))}

        <Capitulo num="07" titulo="Sobre os dados" />
        {credito ? <Texto style={{ fontSize: 12, lineHeight: 17, color: txt2 }}>{`A foto da capa mostra a região do endereço${lugar ? ` (${lugar})` : ''}, não o posto. ${credito}.`}</Texto> : null}
        {paginaFoto ? (
          <Pressable accessibilityRole="link" accessibilityLabel="Ver a foto da capa no Wikimedia Commons" onPress={() => Linking.openURL(paginaFoto).catch(() => undefined)} style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}>
            <Texto style={{ fontSize: 12, lineHeight: 17, color: energia, textDecorationLine: 'underline' }}>Ver a foto no Wikimedia Commons</Texto>
          </Pressable>
        ) : null}
        <AvisoDemo />
      </View>
    </Pagina>
  );
}
export default TelaDetalhesEstacao;
