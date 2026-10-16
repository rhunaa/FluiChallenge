import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Texto } from '../componentes/Texto';
import { FotoPosto } from '../componentes/VisualFlui';
import { Capitulo, Overline, usarCoresTela } from '../componentes/AssinaturaFlui';
import { CategoriasAvaliacao } from '../tipos';
import { estacoes, buscarEstacaoPorId } from '../dados/estacoes';
import { buscarEstacoes } from '../utilitarios/filtrarEstacoes';
import { usarAvaliacoes } from '../contexto/ContextoAvaliacoes';
import { AvaliacaoEstrelas } from '../componentes/AvaliacaoEstrelas';
import { Pagina, Papel, Titulo, Corpo, Campo, Botao, Mensagem } from '../componentes/Interface';

const aspects: [keyof CategoriasAvaliacao, string][] = [
  ['availability', 'Disponibilidade'],
  ['queue', 'Fila / espera'],
  ['speed', 'Velocidade de recarga'],
  ['comfort', 'Conforto do local'],
  ['value', 'Custo-benefício'],
];
const moods = ['Péssima', 'Ruim', 'Regular', 'Boa', 'Incrível'];
const rostos = ['😞', '🙁', '😐', '🙂', '😄'];
const etapas = ['Posto', 'Geral', 'Aspectos', 'Dica'];

/* Contar experiência r7: quatro etapas numeradas na mesma página, sobre o fundo vivo. */
export function TelaContarExperiencia() {
  const { txt, txt2, energia, fio, controle, controleBorda, controleTexto, cartao, bordaCartao } =
    usarCoresTela();
  const nav = useNavigation<any>(),
    route = useRoute<any>(),
    initial = buscarEstacaoPorId(route.params?.stationId),
    { adicionarAvaliacao } = usarAvaliacoes(),
    [id, setId] = useState<string | undefined>(initial?.id),
    [query, setQuery] = useState(initial?.name || ''),
    [mood, setMood] = useState(0),
    [ratings, setRatings] = useState<CategoriasAvaliacao>({
      availability: 0,
      queue: 0,
      speed: 0,
      comfort: 0,
      value: 0,
    }),
    [comment, setComment] = useState(''),
    [published, setPublished] = useState(false),
    [erro, setErro] = useState('');
  const valid = !!id && mood > 0 && Object.values(ratings).every((v) => v > 0),
    suggestions = !id ? buscarEstacoes(estacoes, query).slice(0, 5) : [],
    avaliados = Object.values(ratings).filter((v) => v > 0).length,
    escolhido = id ? buscarEstacaoPorId(id) : undefined,
    feitas = [!!id, mood > 0, avaliados === 5, comment.trim().length > 0];
  const apoio = { fontSize: 14, lineHeight: 20, color: txt2 };
  return (
    <Pagina
      title="Contar experiência"
      subtitle="Sua opinião ajuda quem vem depois."
      back
      profile={false}
    >
      {published ? (
        <Papel>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: '#E6DCFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="checkmark" size={26} color="#5B2BBF" />
          </View>
          <Titulo onCard>Experiência publicada nesta sessão</Titulo>
          <Corpo>
            Seu apelido e as cinco notas estão no feed. A demonstração não envia esta avaliação a
            um operador.
          </Corpo>
          <Botao
            label="Ver minha avaliação na comunidade"
            onPress={() => nav.navigate('Tabs', { screen: 'Community' })}
          />
        </Papel>
      ) : (
        <>
          <View aria-hidden style={{ flexDirection: 'row', gap: 6 }}>
            {etapas.map((e, i) => (
              <View key={e} style={{ flex: 1, gap: 6 }}>
                <View
                  style={{ height: 4, borderRadius: 2, backgroundColor: feitas[i] ? energia : fio }}
                />
                <Texto
                  numberOfLines={1}
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.3,
                    color: feitas[i] ? txt : txt2,
                  }}
                >
                  {`${String(i + 1).padStart(2, '0')} ${e}`}
                </Texto>
              </View>
            ))}
          </View>

          <Capitulo num="01" titulo="O posto" />
          <Campo
            label="Selecione um posto"
            value={query}
            onChangeText={(t) => {
              setQuery(t);
              setId(undefined);
            }}
            placeholder="Nome ou endereço"
            help="A busca ignora acentos e espaços extras."
            icone="search-outline"
          />
          {escolhido ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: bordaCartao,
                backgroundColor: cartao,
              }}
            >
              <FotoPosto
                id={escolhido.id}
                legenda={false}
                style={{ width: 52, height: 52, borderRadius: 14 }}
              />
              <View style={{ flex: 1, gap: 2 }}>
                <Overline cor="#5F5D69">POSTO ESCOLHIDO</Overline>
                <Texto style={{ fontSize: 15, fontWeight: '600', color: '#1B1A20' }}>
                  {escolhido.name}
                </Texto>
                <Texto style={{ fontSize: 12, color: '#4E4C58' }}>{escolhido.address}</Texto>
              </View>
            </View>
          ) : null}
          {suggestions.map((s) => (
            <Pressable
              key={s.id}
              accessibilityRole="button"
              accessibilityLabel={`${s.name} · ${s.address}`}
              onPress={() => {
                setId(s.id);
                setQuery(s.name);
              }}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                minHeight: 60,
                padding: 10,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: controleBorda,
                backgroundColor: controle,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <FotoPosto
                id={s.id}
                legenda={false}
                style={{ width: 40, height: 40, borderRadius: 12 }}
              />
              <View style={{ flex: 1, gap: 1 }}>
                <Texto style={{ fontSize: 14, fontWeight: '600', color: controleTexto }}>
                  {s.name}
                </Texto>
                <Texto style={{ fontSize: 12, color: txt2 }}>{s.address}</Texto>
              </View>
              <Ionicons name="chevron-forward" size={16} color={txt2} />
            </Pressable>
          ))}
          {!id && query.trim().length > 0 && !suggestions.length && (
            <Mensagem>Nenhum posto encontrado. Tente outro nome ou endereço.</Mensagem>
          )}

          <Capitulo num="02" titulo="Como foi sua experiência geral?" />
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel="Experiência geral"
            style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
          >
            {moods.map((l, i) => {
              const sel = mood === i + 1;
              return (
                <Pressable
                  key={l}
                  accessibilityRole="radio"
                  accessibilityLabel={l}
                  accessibilityState={{ checked: sel }}
                  aria-checked={sel}
                  onPress={() => setMood(i + 1)}
                  style={({ pressed }) => ({
                    flex: 1,
                    minWidth: 44,
                    minHeight: 84,
                    borderRadius: 18,
                    paddingVertical: 12,
                    paddingHorizontal: 4,
                    gap: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1.5,
                    borderColor: sel ? '#8B4DF0' : controleBorda,
                    backgroundColor: sel ? '#8B4DF0' : controle,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Texto style={{ fontSize: 25 }}>{rostos[i]}</Texto>
                  <Texto
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      textAlign: 'center',
                      color: sel ? '#FFFFFF' : controleTexto,
                    }}
                  >
                    {l}
                  </Texto>
                </Pressable>
              );
            })}
          </View>

          <Capitulo num="03" titulo="Avalie os cinco aspectos" />
          <View accessibilityLiveRegion="polite" style={{ gap: 8 }}>
            <Texto style={apoio}>{avaliados} de 5 aspectos avaliados</Texto>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              {aspects.map(([k]) => (
                <View
                  key={k}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: ratings[k] > 0 ? energia : fio,
                  }}
                />
              ))}
            </View>
          </View>
          {aspects.map(([k, l]) => (
            <View
              key={k}
              style={{ paddingVertical: 10, gap: 6, borderBottomWidth: 1, borderColor: fio }}
            >
              <Texto style={{ fontSize: 15, fontWeight: '600', color: txt }}>{l}</Texto>
              <AvaliacaoEstrelas
                label={l}
                value={ratings[k]}
                onChange={(n) => setRatings((v) => ({ ...v, [k]: n }))}
              />
            </View>
          ))}

          <Capitulo num="04" titulo="Uma dica para a comunidade" />
          <Campo
            label="Conte mais sobre sua experiência (opcional)"
            multiline
            value={comment}
            onChangeText={setComment}
            maxLength={500}
            placeholder="Dicas e observações, sem dados pessoais"
            help={`${comment.length}/500 caracteres`}
          />
          {!valid && (
            <Texto style={apoio}>
              Selecione um posto, a experiência geral e uma nota em cada um dos cinco aspectos.
            </Texto>
          )}
          {!!erro && <Mensagem erro>{erro}</Mensagem>}
          <Botao
            label="Publicar experiência"
            icon="paper-plane-outline"
            disabled={!valid}
            onPress={() => {
              if (id && adicionarAvaliacao({ stationId: id, mood, ratings, comment })) {
                setPublished(true);
              } else setErro('Não foi possível publicar. Revise o posto e todas as notas.');
            }}
          />
        </>
      )}
    </Pagina>
  );
}
export default TelaContarExperiencia;
