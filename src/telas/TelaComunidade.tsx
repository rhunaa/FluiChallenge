import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usarAvaliacoes } from '../contexto/ContextoAvaliacoes';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { buscarEstacaoPorId } from '../dados/estacoes';
import { CartaoAvaliacao } from '../componentes/CartaoAvaliacao';
import { Texto } from '../componentes/Texto';
import { Numero, Overline, Palco, Secao } from '../componentes/AssinaturaFlui';
import { Pagina, Botao, Opcao, Vazio, AvisoDemo, linha } from '../componentes/Interface';

/* Comunidade r7: palco com o número de relatos e a chamada; Feed | Meus feedbacks sobre o fundo vivo. */
export function TelaComunidade() {
  const nav = useNavigation<any>(),
    { reviews } = usarAvaliacoes(),
    { usuario } = usarAutenticacao(),
    [mine, setMine] = useState(false),
    list = mine ? reviews.filter((r) => r.authorId === usuario?.id) : reviews;
  return (
    <Pagina title="Comunidade Flui" subtitle="Sua experiência ajuda quem vem depois.">
      <Palco>
        <Overline>VOZES DA COMUNIDADE</Overline>
        <View style={{ marginTop: 10 }}>
          <Numero
            valor={String(reviews.length)}
            unidade={reviews.length === 1 ? 'avaliação' : 'avaliações'}
          />
        </View>
        <Texto style={{ fontSize: 14, lineHeight: 20, color: '#A9A6B8', marginTop: 6, marginBottom: 14 }}>
          Uma boa dica muda a próxima parada. Como foi sua recarga?
        </Texto>
        <Botao
          label="Contar minha experiência"
          icon="create-outline"
          onPress={() => nav.navigate('ReportExperience')}
        />
      </Palco>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Feed ou meus feedbacks"
        style={linha}
      >
        <Opcao kind="radio" label="Feed" selected={!mine} onPress={() => setMine(false)} />
        <Opcao
          kind="radio"
          label="Meus feedbacks"
          selected={mine}
          onPress={() => setMine(true)}
        />
      </View>
      <Secao
        titulo={mine ? 'Seus relatos' : 'Relatos do cenário'}
        sub={`${list.length} ${list.length === 1 ? 'relato' : 'relatos'}`}
      />
      {list.length ? (
        list.map((r) => (
          <CartaoAvaliacao
            key={r.id}
            review={r}
            station={buscarEstacaoPorId(r.stationId)}
            onPressStation={() => nav.navigate('StationDetail', { stationId: r.stationId })}
          />
        ))
      ) : (
        <Vazio
          titulo="Você ainda não avaliou um posto"
          descricao="Seu feedback aparece nesta sessão com seu apelido, sem confundir autores pelo nome."
          acao={{
            label: 'Contar minha experiência',
            onPress: () => nav.navigate('ReportExperience'),
          }}
        />
      )}
      <AvisoDemo />
    </Pagina>
  );
}
export default TelaComunidade;
