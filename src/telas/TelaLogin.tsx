import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Texto } from '../componentes/Texto';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { Pagina, Papel, Titulo, Corpo, Botao, Mensagem } from '../componentes/Interface';
import { CarroPalco, Overline, Palco, Segmentos } from '../componentes/AssinaturaFlui';

/* Entrada da r7: palco com o carro e o convite para explorar sem cadastro. */
export function TelaLogin() {
  const nav = useNavigation<any>();
  const { entrarDemo } = usarAutenticacao();
  return (
    <Pagina title="Recarregue com facilidade" subtitle="Seu caminho até a próxima recarga." profile={false} clima="inicio">
      <Palco testID="flui-hero">
        <Overline>ENERGIA EM MOVIMENTO</Overline>
        <CarroPalco altura={124} />
        <Texto style={{ fontSize: 15, lineHeight: 21, color: '#EEEDF8' }}>Conectores. Lugares. Caminhos.</Texto>
        <Segmentos cheios={15} />
      </Palco>
      <Papel>
        <Titulo onCard>Bem-vindo ao Flui</Titulo>
        <Corpo>Encontre conectores compatíveis, explore os postos e experimente um planejamento de viagem.</Corpo>
        <Mensagem>Explore sem cadastro. Este é um cenário demonstrativo; não informe dados reais. Tudo fica na memória desta sessão.</Mensagem>
        <Botao label="Experimentar demonstração" icon="arrow-forward" onPress={() => entrarDemo()} />
        <Botao label="Montar perfil demonstrativo" variant="secondary" onPress={() => nav.navigate('Cadastro')} />
      </Papel>
      <Corpo onBackground muted>Recarregar a página, sair ou reiniciar limpa favoritos, avaliações, filtros e horários deste visitante. As estações e avaliações iniciais são exemplos.</Corpo>
    </Pagina>
  );
}
export default TelaLogin;
