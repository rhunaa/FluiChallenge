import React, { useState } from 'react';
import { View } from 'react-native';
import { FaixaFlui } from '../componentes/PaineisFlui';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { Pagina, Papel, Corpo, Campo, Botao } from '../componentes/Interface';
import { Texto } from '../componentes/Texto';
import { VeiculoFlui } from '../componentes/VisualFlui';
import { usarCoresTela } from '../componentes/AssinaturaFlui';

/* Cadastro da r7: cartao com o carro pequeno que acompanha o apelido e o modelo digitados. */
export function TelaCadastro() {
  const { entrarDemo } = usarAutenticacao();
  const { txt2 } = usarCoresTela();
  const [nome, setNome] = useState('Visitante Flui');
  const [modelo, setModelo] = useState('BYD Seal · exemplo');
  return (
    <Pagina title="Seu perfil demonstrativo" back profile={false}>
      <Papel>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 128, flexShrink: 0 }}>
            <VeiculoFlui compact altura={70} />
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <Texto style={{ fontSize: 17, fontWeight: '600', letterSpacing: -0.2, color: '#1B1A20' }}>{nome.trim() || 'Visitante Flui'}</Texto>
            <Texto style={{ fontSize: 12, color: '#4E4C58' }}>{modelo.trim() || 'BYD Seal · exemplo'}</Texto>
          </View>
        </View>
        <Corpo>Use um apelido fictício. Não estamos criando uma conta real nem conectando o veículo.</Corpo>
      </Papel>
      <FaixaFlui icon="car-outline" label="PONTO DE PARTIDA" value="Uma experiência com seu jeito" detail="Personalização demonstrativa · sem criar uma conta" />
      <Campo label="Apelido de demonstração" value={nome} onChangeText={setNome} maxLength={40} icone="person-outline" />
      <Campo label="Modelo do veículo (exemplo)" value={modelo} onChangeText={setModelo} maxLength={60} icone="car-sport-outline" />
      <Texto style={{ fontSize: 12, lineHeight: 17, color: txt2 }}>Você poderá editar o conector e a autonomia no perfil. O preset inicial usa CCS Combo2 e 80 km, sem telemetria.</Texto>
      <Botao label="Entrar na demonstração" disabled={!nome.trim() || !modelo.trim()} onPress={() => entrarDemo(nome, modelo)} />
    </Pagina>
  );
}
export default TelaCadastro;
