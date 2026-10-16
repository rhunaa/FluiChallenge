import React from 'react';
import { View } from 'react-native';
import { Texto } from '../componentes/Texto';
import { FaixaFlui } from '../componentes/PaineisFlui';
import { usarTema } from '../contexto/ContextoTema';
import { Capitulo, usarCoresTela } from '../componentes/AssinaturaFlui';
import { Pagina, Botao, Mensagem } from '../componentes/Interface';

/* Acessibilidade r7: três capítulos sobre o fundo vivo; a prévia "Aa" fica num cartão claro. */
export function TelaAcessibilidade() {
  const {
    modo,
    alternarModo,
    fontScaleLabel,
    aumentarFonte,
    diminuirFonte,
    podeAumentarFonte,
    podeDiminuirFonte,
  } = usarTema();
  const { txt, txt2, cartao, bordaCartao } = usarCoresTela();
  const apoio = { fontSize: 14, lineHeight: 20, color: txt2 };
  return (
    <Pagina title="Acessibilidade" back profile={false}>
      <FaixaFlui
        icon="accessibility-outline"
        label="DO SEU JEITO"
        value="Um Flui mais confortável"
        detail="Texto, aparência e navegação para você"
      />

      <Capitulo num="01" titulo="Tamanho do texto" />
      <View
        style={{
          backgroundColor: cartao,
          borderColor: bordaCartao,
          borderWidth: 1,
          borderRadius: 24,
          padding: 18,
          gap: 4,
        }}
      >
        <Texto style={{ fontSize: 26, fontWeight: '600', letterSpacing: -0.6, color: '#5B2BBF' }}>
          Aa
        </Texto>
        <Texto style={{ fontSize: 15, lineHeight: 21, color: '#1B1A20' }}>
          Energia para o seu caminho.
        </Texto>
      </View>
      <Texto style={apoio}>
        A escala também se aplica aos campos de entrada. Os controles permanecem na rolagem,
        sem cobrir o conteúdo.
      </Texto>
      <Mensagem>Escala atual: {fontScaleLabel}</Mensagem>
      <View style={{ gap: 12, flexDirection: 'row', flexWrap: 'wrap' }}>
        <Botao
          variant="secondary"
          label="Diminuir fonte"
          icon="remove-outline"
          disabled={!podeDiminuirFonte}
          onPress={diminuirFonte}
        />
        <Botao
          variant="secondary"
          label="Aumentar fonte"
          icon="add-outline"
          disabled={!podeAumentarFonte}
          onPress={aumentarFonte}
        />
      </View>

      <Capitulo num="02" titulo="Aparência" />
      <Texto style={apoio}>
        Modo atual: {modo === 'dark' ? 'escuro' : 'claro'}. Os cartões claros preservam a
        identidade do Flui em ambos.
      </Texto>
      <Botao
        variant="secondary"
        label={`Ativar modo ${modo === 'dark' ? 'claro' : 'escuro'}`}
        icon={modo === 'dark' ? 'sunny-outline' : 'moon-outline'}
        onPress={alternarModo}
      />

      <Capitulo num="03" titulo="Teclado e movimento" />
      <Texto style={{ ...apoio, color: txt }}>
        Use Tab e Shift+Tab para navegar; Enter ou Espaço para ativar controles. O foco tem
        contorno visível.
      </Texto>
      <Texto style={apoio}>
        Entradas e transições curtas dão feedback, sem animações contínuas. Na web, a
        preferência de movimento reduzido do sistema reduz ou remove esses efeitos.
      </Texto>
      <Texto style={apoio}>
        Para leitura por voz, utilize o leitor de tela do dispositivo. O Flui não simula uma
        funcionalidade de voz que não existe.
      </Texto>
    </Pagina>
  );
}
export default TelaAcessibilidade;
