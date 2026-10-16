import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usarFavoritos } from '../contexto/ContextoFavoritos';
import { estacoes } from '../dados/estacoes';
import { Pagina, Opcao, AvisoDemo, Vazio, linha } from '../componentes/Interface';
import { FaixaFlui } from '../componentes/PaineisFlui';
import { CartaoEstacao } from '../componentes/CartaoEstacao';
export function TelaFavoritos() {
  const nav = useNavigation<any>(),
    { ehFavorito } = usarFavoritos(),
    [tab, setTab] = useState('salvos'),
    list = estacoes.filter((s) => ehFavorito(s.id));
  return (
    <Pagina
      title="Meus favoritos"
      subtitle="Sua coleção de paradas, sempre à mão nesta sessão."
      hero
    >
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Favoritos ou histórico"
        style={linha}
      >
        <Opcao
          kind="radio"
          label="Favoritos"
          selected={tab === 'salvos'}
          onPress={() => setTab('salvos')}
        />
        <Opcao
          kind="radio"
          label="Histórico"
          selected={tab === 'historico'}
          onPress={() => setTab('historico')}
        />
      </View>
      <FaixaFlui icon="bookmark-outline" label="SUA COLEÇÃO" value={`${list.length} ${list.length===1?'posto salvo':'postos salvos'}`} detail="Salvos nesta sessão · sem reservas ou recargas registradas"/>
      {tab === 'historico' ? (
        <Vazio
          titulo="Nenhuma recarga registrada"
          descricao="A demonstração não recebe sessões dos operadores. Planejar um horário não cria uma recarga."
        />
      ) : list.length ? (
        list.map((s) => (
          <CartaoEstacao
            key={s.id}
            station={s}
            nivelTitulo={2}
            onPress={() => nav.navigate('StationDetail', { stationId: s.id })}
          />
        ))
      ) : (
        <Vazio
          titulo="Nenhum favorito ainda"
          descricao="Salve um posto pelo ícone de marcador. Os salvos duram somente nesta sessão."
          acao={{ label: 'Explorar postos', onPress: () => nav.navigate('Map') }}
        />
      )}
      <AvisoDemo/>
    </Pagina>
  );
}
export default TelaFavoritos;
