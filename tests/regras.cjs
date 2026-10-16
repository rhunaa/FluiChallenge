const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => {
  const src = fs.readFileSync(file, 'utf8');
  const code =
    typeof ts.transpileModule === 'function'
      ? ts.transpileModule(src, {
          compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
        }).outputText
      : require('esbuild').transformSync(src, {
          loader: 'ts',
          format: 'cjs',
          target: 'es2020',
        }).code;
  module._compile(code, file);
};
const { estacoes } = require('../src/dados/estacoes.ts');
const {
  aplicarFiltros,
  FILTROS_PADRAO,
  buscarEstacoes,
  statusDosConectores,
} = require('../src/utilitarios/filtrarEstacoes.ts');
const H = require('../src/utilitarios/horarios.ts');
const { planejarRota, estimarDuracaoViagemMin } = require('../src/dados/planejadorRota.ts');
let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('PASS ' + name);
  } catch (e) {
    console.error('FAIL ' + name);
    throw e;
  }
}
const filters = (d) => ({ ...FILTROS_PADRAO, compatibleOnly: false, ...d });
const now = new Date(2098, 0, 1);
const date = '2099-01-01';
test('Tipo 2 + 100 kW não mistura conectores', () =>
  assert.equal(
    aplicarFiltros(estacoes, filters({ connectorTypes: ['Tipo 2'], minPower: 100 })).length,
    0,
  ));
test('CHAdeMO + 100 kW não mistura conectores', () =>
  assert.equal(
    aplicarFiltros(estacoes, filters({ connectorTypes: ['CHAdeMO'], minPower: 100 })).length,
    0,
  ));
test('CHAdeMO + 300 kW vazio', () =>
  assert.equal(
    aplicarFiltros(estacoes, filters({ connectorTypes: ['CHAdeMO'], minPower: 300 })).length,
    0,
  ));
test('CCS ocupado não herda disponibilidade CHAdeMO', () =>
  assert(
    !aplicarFiltros(
      estacoes,
      filters({ connectorTypes: ['CCS Combo2'], onlyAvailable: true }),
    ).some((s) => s.id === 'st-2'),
  ));
test('Conector do veículo afeta descoberta', () =>
  assert(
    !aplicarFiltros(estacoes, FILTROS_PADRAO, 'CCS Combo2').some((s) => s.id === 'st-8'),
  ));
test('Disponibilidade deriva do conector, não do posto', () =>
  assert.equal(
    statusDosConectores(estacoes.find((s) => s.id === 'st-6').connectors),
    'available',
  ));
test('Busca normaliza acentos e espaços', () =>
  assert(buscarEstacoes(estacoes, '  praca  da se ').some((s) => s.id === 'st-1')));
test('Busca pesquisa endereço', () =>
  assert(buscarEstacoes(estacoes, 'inovacao').some((s) => s.id === 'st-5')));
for (const id of ['st-1', 'st-2'])
  test('Horários respeitam funcionamento ' + id, () => {
    const s = estacoes.find((s) => s.id === id),
      ws = H.obterMelhoresJanelas(s.hourlyOccupancy, 3, 2, s, date, now);
    assert(ws.length > 0);
    ws.forEach((w) => assert(H.dentroDoFuncionamento(s, w.start, w.start + 2)));
  });
test('Janelas 24h não se sobrepõem na meia-noite', () => {
  const occupancy = Array.from({ length: 24 }, (_, h) => (h === 23 || h === 0 ? 0 : 0.8));
  const ws = H.obterMelhoresJanelas(occupancy, 4, 2);
  for (let i = 0; i < ws.length; i++)
    for (let j = i + 1; j < ws.length; j++)
      assert(
        !H.intervalosSobrepostos(
          { start: ws[i].start, end: ws[i].start + 2 },
          { start: ws[j].start, end: ws[j].start + 2 },
        ),
      );
});
test('Intervalo 23h–02h avança data', () => {
  const r = H.intervaloAgendamento(date, 23, 2);
  assert.equal(r.fim.getDate(), 2);
  assert.equal((r.fim - r.inicio) / 3600000, 3);
});
test('Funcionamento 22h–02h suporta virada do dia', () => {
  const s = { is24h: false, openHours: '22:00 – 02:00' };
  assert(H.dentroDoFuncionamento(s, 23, 26));
  assert(H.dentroDoFuncionamento(s, 0, 2));
  assert(!H.dentroDoFuncionamento(s, 1, 3));
});
test('Data impossível é rejeitada', () => assert.equal(H.parseDataLocal('2099-02-30'), null));
test('Horários passados não são sugeridos', () =>
  assert.equal(
    H.obterMelhoresJanelas(estacoes[0].hourlyOccupancy, 3, 2, estacoes[0], '2000-01-01', now)
      .length,
    0,
  ));
test('Ocupação incompleta não fabrica recomendação', () =>
  assert.equal(H.obterMelhoresJanelas([0, 0]).length, 0));
test('Conector incompatível não permite horário', () =>
  assert(!H.horarioValido(estacoes[0], date, 'c2', 'CCS Combo2', 10, 12, now)));
test('Conector ocupado não permite horário', () =>
  assert(!H.horarioValido(estacoes[1], date, 'c3', 'CCS Combo2', 10, 12, now)));
test('Conector compatível e horário futuro válido', () =>
  assert(H.horarioValido(estacoes[0], date, 'c1', 'CCS Combo2', 10, 12, now)));
const station = (id, km, type = 'CCS Combo2') => ({
  ...estacoes[0],
  id,
  demoRouteKm: km,
  connectors: [{ id: 'c-' + id, type, powerKw: 100, status: 'available' }],
});
test('Modelo não trata distância radial como trajeto', () => {
  const d = { ...station('d', 12), demoRouteKm: undefined, distanceKm: 8 };
  assert(!planejarRota(d, 5, [station('n', 4)]).viavel);
});
test('Baseline de corredor fechado é viável', () => {
  const d = station('d', 12);
  const r = planejarRota(d, 5, [station('a', 4), station('b', 8), d], {
    tipoConector: 'CCS Combo2',
    margemSeguranca: 0,
  });
  assert(r.viavel);
  assert.equal(r.paradas.length, 2);
});
test('Parada somente NACS é excluída de carro CCS', () => {
  const d = station('d', 12);
  assert(
    !planejarRota(d, 5, [station('a', 4, 'Tesla NACS'), station('b', 8), d], {
      tipoConector: 'CCS Combo2',
      margemSeguranca: 0,
    }).viavel,
  );
});
test('Margem pode invalidar trecho no limite', () => {
  const d = station('d', 5);
  assert(
    !planejarRota(d, 5, [d], { tipoConector: 'CCS Combo2', margemSeguranca: 0.1 }).viavel,
  );
});
test('Autonomia zero e NaN não são viáveis', () => {
  const d = station('d', 5);
  for (const n of [0, -1, NaN, Infinity]) assert(!planejarRota(d, n, [d]).viavel);
});
test('Cada trecho respeita autonomia útil', () => {
  const d = station('d', 16);
  const r = planejarRota(d, 6, [station('a', 4), station('b', 8), station('c', 12), d]);
  assert(r.viavel);
  r.paradas.forEach((p) => assert(p.distanciaTrechoKm <= 5.4));
  assert(r.trechoFinalKm <= 5.4);
});
test('Potência da parada pertence ao conector compatível', () => {
  const a = station('a', 4);
  a.connectors.push({ id: 'nacs', type: 'Tesla NACS', powerKw: 350, status: 'available' });
  const d = station('d', 8);
  const r = planejarRota(d, 5, [a, d]);
  assert.equal(r.paradas[0].conector.powerKw, 100);
});
test('Sem premissas, não há ETA universal', () =>
  assert.equal(estimarDuracaoViagemMin(20, 1), null));

test('Compatibilidade desconhecida falha fechada', () =>
  assert.equal(aplicarFiltros(estacoes, FILTROS_PADRAO).length, 0));
test('Minutos inválidos no funcionamento são rejeitados', () =>
  assert.equal(H.intervaloFuncionamento({ is24h: false, openHours: '06:99 – 22:00' }), null));
const { urlNavegacao } = require('../src/utilitarios/coordenadas.ts');
test('Navegação usa latitude/longitude exatas', () => {
  const url = new URL(urlNavegacao(estacoes[0]));
  assert.equal(url.hostname, 'www.google.com');
  assert.equal(url.searchParams.get('destination'), '-23.5505,-46.6333');
  assert.equal(url.searchParams.get('api'), '1');
});
test('Navegação rejeita coordenadas inválidas', () => {
  for (const lat of [NaN, Infinity, 91, -91])
    assert.throws(() => urlNavegacao({ lat, lng: 0 }));
  assert.throws(() => urlNavegacao({ lat: 0, lng: 181 }));
});
const {
  avaliacaoValida,
  mediaAvaliacao,
  resumoAvaliacoes,
} = require('../src/utilitarios/avaliacoes.ts');
const rating = { availability: 5, queue: 1, speed: 4, comfort: 3, value: 2 };
test('Avaliação exige todas as cinco categorias', () => {
  assert(!avaliacaoValida({ mood: 4, ratings: { availability: 5 }, comment: '' }));
  assert(!avaliacaoValida({ mood: 4, ratings: {}, comment: '' }));
  assert(avaliacaoValida({ mood: 4, ratings: rating, comment: '' }));
});
test('Avaliação rejeita notas e comentários fora do contrato', () => {
  assert(!avaliacaoValida({ mood: 0, ratings: rating, comment: '' }));
  assert(!avaliacaoValida({ mood: 4, ratings: { ...rating, value: 6 }, comment: '' }));
  assert(!avaliacaoValida({ mood: 4, ratings: rating, comment: 'x'.repeat(501) }));
});
test('Média inclui nota baixa, não escolhe só as duas melhores', () =>
  assert.equal(mediaAvaliacao({ ratings: rating }), 3));
test('Agregação da ficha e do cartão usa a mesma fonte', () => {
  const r = { stationId: 'st-1', ratings: rating };
  const sum = resumoAvaliacoes([r, { ...r, stationId: 'st-2' }], 'st-1');
  assert.equal(sum.nota, 3);
  assert.equal(sum.quantidade, 1);
});

console.log(`\n${passed} testes de regressão passaram.`);
