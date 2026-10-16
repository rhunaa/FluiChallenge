import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TipoConector } from '../tipos';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { usarReservas } from '../contexto/ContextoReservas';
import { usarViagem } from '../contexto/ContextoViagem';
import { buscarEstacaoPorId } from '../dados/estacoes';
import { formatarData, formatarHora } from '../utilitarios/horarios';
import { Texto } from '../componentes/Texto';
import { FotoPosto } from '../componentes/VisualFlui';
import {
  Capitulo,
  CarroPalco,
  Faixa,
  Numero,
  Overline,
  Palco,
  SeparadorFaixa,
  usarCoresTela,
} from '../componentes/AssinaturaFlui';
import {
  Pagina,
  Papel,
  Titulo,
  Corpo,
  Campo,
  Opcao,
  Botao,
  Mensagem,
  Vazio,
  linha,
} from '../componentes/Interface';

const tipos: TipoConector[] = ['CCS Combo2', 'CHAdeMO', 'Tipo 2', 'Tesla NACS'];

/* Perfil r7 «Garagem»: palco com o carro e os dados salvos; capítulos sobre o fundo vivo. */
export function TelaPerfil() {
  const nav = useNavigation<any>(),
    { usuario, atualizarVeiculo, reiniciarDemo, sair } = usarAutenticacao(),
    { reservas, cancelarReserva } = usarReservas(),
    { salvarPlano } = usarViagem(),
    { txt, txt2 } = usarCoresTela();
  const [modelo, setModelo] = useState(usuario?.carModel || ''),
    [tipo, setTipo] = useState<TipoConector>(usuario?.tipoConector || 'CCS Combo2'),
    [autonomia, setAutonomia] = useState(String(usuario?.autonomiaKm || 80)),
    [msg, setMsg] = useState(''),
    [reset, setReset] = useState(false);
  const n = Number(autonomia.replace(',', '.')),
    valido =
      /^\d{1,4}([.,]\d{1,2})?$/.test(autonomia) && n >= 1 && n <= 1500 && !!modelo.trim();
  const apoio = { fontSize: 14, lineHeight: 20, color: txt2 };
  return (
    <Pagina
      title="Perfil e configurações"
      subtitle="Seu veículo, suas paradas e suas preferências."
      profile={false}
    >
      <Palco>
        <Overline>GARAGEM</Overline>
        <Texto
          style={{ fontSize: 21, fontWeight: '600', letterSpacing: -0.4, color: '#EEEDF8', marginTop: 8 }}
        >
          {usuario?.name || 'Visitante'}
        </Texto>
        <Texto style={{ fontSize: 12, lineHeight: 17, color: '#A9A6B8' }}>
          {`${usuario?.carModel} · ${usuario?.tipoConector} · perfil fictício`}
        </Texto>
        <CarroPalco altura={104} />
        <Faixa>
          <View style={{ flex: 1, gap: 4 }}>
            <Overline>AUTONOMIA INFORMADA</Overline>
            <Numero
              valor={String(usuario?.autonomiaKm ?? 80).replace('.', ',')}
              unidade="km"
              tamanho={30}
            />
          </View>
          <SeparadorFaixa />
          <View style={{ flex: 1, gap: 4 }}>
            <Overline>CONECTOR</Overline>
            <Texto style={{ fontSize: 17, fontWeight: '600', letterSpacing: -0.3, color: '#EEEDF8' }}>
              {usuario?.tipoConector || 'CCS Combo2'}
            </Texto>
          </View>
        </Faixa>
      </Palco>

      <Capitulo num="01" titulo="Meu veículo" />
      <Texto style={apoio}>
        Seu veículo define a compatibilidade na descoberta, nos horários e no planejamento.
      </Texto>
      <Campo
        label="Modelo do veículo"
        value={modelo}
        onChangeText={setModelo}
        maxLength={60}
        icone="car-sport-outline"
      />
      <View style={{ gap: 10 }}>
        <Texto style={{ fontSize: 13, fontWeight: '600', color: txt }}>Conector do veículo</Texto>
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Conector do veículo"
          style={linha}
        >
          {tipos.map((t) => (
            <Opcao
              key={t}
              kind="radio"
              label={t}
              selected={tipo === t}
              onPress={() => {
                setTipo(t);
                setMsg('');
              }}
            />
          ))}
        </View>
      </View>
      <Campo
        label="Autonomia disponível (km)"
        value={autonomia}
        keyboardType="decimal-pad"
        onChangeText={setAutonomia}
        maxLength={8}
        icone="battery-half-outline"
        help="Informação manual para o cenário. Use de 1 a 1500 km; não é uma medição do veículo."
      />
      {!valido && (
        <Mensagem erro>Informe um modelo e uma autonomia válida antes de salvar.</Mensagem>
      )}
      <Botao
        label="Salvar veículo"
        icon="checkmark-circle-outline"
        disabled={!valido}
        onPress={() => {
          atualizarVeiculo({ carModel: modelo.trim(), tipoConector: tipo, autonomiaKm: n });
          salvarPlano(null);
          setMsg(
            'Veículo atualizado. Seus favoritos continuam salvos. Confira a compatibilidade dos horários anteriores.',
          );
        }}
      />
      {!!msg && <Mensagem>{msg}</Mensagem>}

      <Capitulo num="02" titulo="Meus horários planejados" />
      {!Object.keys(reservas).length ? (
        <Vazio
          titulo="Nenhum horário planejado"
          descricao="Escolha um posto e salve um horário futuro com conector compatível. Nenhuma vaga será garantida."
          acao={{ label: 'Explorar postos', onPress: () => nav.navigate('Map') }}
        />
      ) : (
        Object.values(reservas).map((r) => {
          const s = buscarEstacaoPorId(r.stationId),
            c = s?.connectors.find((c) => c.id === r.connectorId);
          return (
            <Papel key={r.stationId}>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <FotoPosto
                  id={r.stationId}
                  legenda={false}
                  style={{ width: 52, height: 52, borderRadius: 16 }}
                />
                <View style={{ flex: 1, gap: 2 }}>
                  <Titulo onCard>{s?.name || 'Posto'}</Titulo>
                  <Corpo>
                    {formatarData(r.date)} · {formatarHora(r.startHour)}–{formatarHora(r.endHour)}
                    {r.endHour <= r.startHour ? ' (+1 dia)' : ''}
                  </Corpo>
                </View>
              </View>
              <Corpo muted>
                {c?.type} · {c?.powerKw} kW · demonstração
              </Corpo>
              {c?.type !== usuario?.tipoConector && (
                <Mensagem erro>
                  Este conector não corresponde ao veículo atual. Cancele e planeje novamente.
                </Mensagem>
              )}
              <View style={linha}>
                <Botao
                  variant="secondary"
                  compacto
                  label="Ver posto"
                  onPress={() => nav.navigate('StationDetail', { stationId: r.stationId })}
                />
                <Botao
                  variant="danger"
                  compacto
                  label="Cancelar horário planejado"
                  onPress={() => cancelarReserva(r.stationId)}
                />
              </View>
            </Papel>
          );
        })
      )}

      <Capitulo num="03" titulo="Preferências" />
      <Botao
        variant="secondary"
        label="Acessibilidade"
        icon="accessibility-outline"
        onPress={() => nav.navigate('Accessibility')}
      />
      <Texto style={apoio}>
        Tudo fica na memória. Recarregar, sair ou reiniciar apaga as ações do visitante. As
        estações e avaliações de exemplo voltam ao estado inicial.
      </Texto>
      <Botao
        variant="secondary"
        label="Reiniciar demonstração"
        icon="refresh-outline"
        onPress={() => setReset(true)}
      />
      {reset && (
        <Papel>
          <Mensagem>
            Apagar os dados desta sessão e abrir a demonstração para um novo visitante?
          </Mensagem>
          <Botao label="Confirmar reset" onPress={reiniciarDemo} />
          <Botao
            variant="secondary"
            label="Manter esta sessão"
            onPress={() => setReset(false)}
          />
        </Papel>
      )}
      <Botao
        variant="danger"
        label="Sair da demonstração"
        icon="log-out-outline"
        onPress={sair}
      />
    </Pagina>
  );
}
export default TelaPerfil;
