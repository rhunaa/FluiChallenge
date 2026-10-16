# Flui — candidata para revisão web

Atualização: 07/10/2026. Integração local no clone isolado do Mac, branch `melhoria/demo-estande-20261006`, base `9863db26030494bd4210ca5bd834958c7087948f`.

## Implementação
As 38 fontes preparadas foram aplicadas, com backup, além dos ajustes de tema e da pasta de evidência local. Foram integrados filtros por uma mesma unidade de conector, busca compartilhada, mapa/lista coerentes, favoritos, perfil demonstrativo, horários futuros por unidade, avaliações com cinco categorias e planejamento em corredor fictício com margem de segurança.

O roxo do Flui foi preservado, com superfícies claras, ilustrações vetoriais locais, controles na rolagem e escala de texto nos campos. Foram corrigidos o acesso ao plano nulo, condições que renderizavam strings vazias dentro de View, a legenda duplicada de virada do dia e estados web explícitos de seleção nos radios, favoritos e abas.

## Evidência da candidata
- Typecheck completo Expo/React Native: `./node_modules/.bin/tsc --noEmit`, exit 0 em 07/10 às 22:01 UTC.
- Regras: `node tests/regras.cjs`, 35 testes passaram, exit 0 às 22:01 UTC.
- Export web: `./node_modules/.bin/expo export --platform web --output-dir .frontend-ai/export-web`, exit 0 às 22:02 UTC.
- Chrome novo: 13 cenários passaram. Incluem entrada por Enter, filtro negativo de mesma unidade, busca sem acentos, seleção do mapa, favoritos vazios, destinos incompatível e compatível, autonomia inválida, persistência do plano, datas passadas, salvar/substituir/cancelar horário, avaliação obrigatória de cinco aspectos e sua média, troca de veículo e isolamento/reset de sessão.
- Cinco abas em 320/393/768/1440 px: sem overflow horizontal; um main acessível atual; idioma pt-BR. Home escura em 320 px com escala 1.3 e campo do perfil ampliado também passaram.
- No percurso executado: zero erros de console, pageerror, respostas HTTP de erro ou requisições falhas. Há avisos de desenvolvimento de movimento reduzido e pointerEvents; não são certificação de acessibilidade.

Produto testado (59 arquivos em App.tsx/index.ts/src/assets): `0e40ebeadece3cd5599ad4068dcbfef5a652c5ead110dfd692d0c36bc2eed585`.
Configuração: `a7d287e3b570bb6d88022f2abd64fed4317fc23c1990bb5a69d93492c89e707d`.
Package, lock, app.json, app.config.js, tsconfig.json e licença foram conferidos byte a byte contra a base e preservados. Hash identifica a candidata; não prova correção por si só.

## Acesso e escopo
Expo web sem CI: http://localhost:8081, somente no Mac que hospeda o clone. É uma demonstração em memória, sem autenticação de produção, operadores, pagamento ou reserva real. Não há ETA, tarifa nem distância viária inventadas.

O clone original do Windows não foi sincronizado com esta recuperação. Nenhum commit, push, PR, merge, deploy ou publicação foi realizado. O ZIP de recuperação inicial é histórico e anterior às correções: não reaplicá-lo sobre a candidata atual.

## Limites e revisão
Validação própria, não revisão independente nem execução Daybreak. Revisão visual do Lucas pendente. Não executados: iOS/Android físicos, leitor de tela real, verificação completa de teclado/foco, zoom nativo de navegador a 200%, navegação externa física e integração com mapas/operadores reais. A checagem axe anterior foi limitada ao planejador e teve contraste de gradiente inconclusivo; não há certificação WCAG. O arquivo é uma candidata de demonstração, não uma release de produção.
