import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { usarFiltros } from '../contexto/ContextoFiltro';
import { usarReservas } from '../contexto/ContextoReservas';
import { usarFavoritos } from '../contexto/ContextoFavoritos';
import { estacoes } from '../dados/estacoes';
import { aplicarFiltros } from '../utilitarios/filtrarEstacoes';
import { Pagina, Papel, Titulo, Corpo, Botao, Vazio, AvisoDemo, IconeBotao } from '../componentes/Interface';
import { Texto } from '../componentes/Texto';
import { CartaoEstacao } from '../componentes/CartaoEstacao';
import { AtalhoFlui } from '../componentes/PaineisFlui';
import { CarroPalco, Faixa, Numero, Overline, Palco, Secao, Segmentos, SeparadorFaixa } from '../componentes/AssinaturaFlui';

const atalhos = [
  { label: 'Planejar minha viagem', description: 'Monte suas paradas', icon: 'navigate-outline', route: 'TripPlanner' },
  { label: 'Contar experiência', description: 'Ajude quem vem depois', icon: 'chatbubbles-outline', route: 'ReportExperience' },
  { label: 'Meus lugares salvos', description: 'Volte aos seus favoritos', icon: 'bookmark-outline', route: 'Favorites' },
  { label: 'Acessibilidade', description: 'Ajuste o Flui para você', icon: 'accessibility-outline', route: 'Accessibility' },
] as const;

/* Inicio da prancha r7: palco com o carro, faixa de leitura, segmentos e a proxima parada. */
export function TelaInicio() {
  const nav = useNavigation<any>();
  const { usuario } = usarAutenticacao();
  const { filters } = usarFiltros();
  const { reservas } = usarReservas();
  const { ehFavorito } = usarFavoritos();
  const visible = aplicarFiltros(estacoes, filters, usuario?.tipoConector);
  const fav = visible.filter((s) => ehFavorito(s.id));
  const first = (fav.length ? fav : visible).slice(0, 2);
  const bateria = usuario?.batteryPercent || 0;
  return (
    <Pagina title={`Olá, ${usuario?.name.split(' ')[0] || 'Visitante'}!`} subtitle="Seu caminho, sua energia." clima="inicio">
      <Palco testID="flui-hero">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Overline>Meu veículo</Overline>
            <Texto style={{ fontSize: 21, fontWeight: '600', letterSpacing: -0.3, color: '#EEEDF8', marginTop: 3 }}>{usuario?.carModel?.replace(' · exemplo', '')}</Texto>
            <Texto style={{ fontSize: 12, color: '#A9A6B8', marginTop: 1 }}>{usuario?.tipoConector} · perfil do cenário</Texto>
          </View>
          <IconeBotao variante="palco" icon="options-outline" label="Editar meu veículo" onPress={() => nav.navigate('Profile')} />
        </View>
        <CarroPalco />
        <Faixa>
          <View style={{ flexShrink: 1, minWidth: 0 }}>
            <Overline espaco={1}>Autonomia informada</Overline>
            <View style={{ marginTop: 4 }}>
              <Numero valor={String(usuario?.autonomiaKm ?? '—')} unidade=" km" />
            </View>
          </View>
          <SeparadorFaixa />
          <View style={{ flexShrink: 1, minWidth: 0, alignItems: 'flex-end' }}>
            <Overline espaco={1} style={{ textAlign: 'right' }}>Bateria · ilustrativa</Overline>
            <View style={{ marginTop: 4 }}>
              <Numero valor={String(bateria)} unidade=" %" />
            </View>
          </View>
        </Faixa>
        <Segmentos cheios={Math.round(bateria * 0.24)} />
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Botao label="Encontrar recarga" icon="flash" onPress={() => nav.navigate('Filters')} />
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Explorar mapa" onPress={() => nav.navigate('Map')} style={({ pressed }) => ({ width: 50, height: 50, borderRadius: 16, backgroundColor: '#EEEDF8', alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}>
            <Ionicons name="map-outline" size={22} color="#242428" />
          </Pressable>
        </View>
      </Palco>
      <Secao titulo="Sua próxima parada." sub={`${visible.length} postos combinam com seus filtros`} acao={{ label: 'Ver todos →', nome: 'Ver todos os postos', onPress: () => nav.navigate('Filters') }} />
      {first.map((s) => (
        <CartaoEstacao key={s.id} station={s} onPress={() => nav.navigate('StationDetail', { stationId: s.id })} />
      ))}
      {!first.length ? <Vazio titulo="Nenhum posto nestes filtros" descricao="Revise o conector, a potência ou a disponibilidade." acao={{ label: 'Ajustar filtros', onPress: () => nav.navigate('Filters') }} /> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {atalhos.map((a) => (
          <View key={a.route} style={{ width: '47%', flexGrow: 1, minWidth: 140 }}>
            <AtalhoFlui label={a.label} description={a.description} icon={a.icon} onPress={() => nav.navigate(a.route)} />
          </View>
        ))}
      </View>
      {Object.keys(reservas).length > 0 ? (
        <Papel>
          <Titulo onCard>Seu próximo horário está aqui</Titulo>
          <Corpo>Consulte ou altere seu planejamento. Ele não garante uma vaga no posto.</Corpo>
          <Botao variant="secondary" label="Ver meus horários" onPress={() => nav.navigate('Profile')} />
        </Papel>
      ) : null}
      <AvisoDemo />
    </Pagina>
  );
}
export default TelaInicio;
