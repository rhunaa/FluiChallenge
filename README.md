# Flui

App mobile para motoristas de veículos elétricos encontrarem, avaliarem e planejarem paradas em pontos de recarga. Feito em React Native (Expo) com TypeScript, como projeto do Enterprise Challenge: Charge Map Cup.

## Funcionalidades

### Início
Tela inicial com atalho para o mapa, botão de destaque para o Planejador de viagem, aviso de reserva de horário ativa (quando houver) e uma lista dos postos disponíveis em destaque, cada um com foto real do carregador.

### Mapa
Busca de postos por nome ou endereço, contador de quantos pontos estão visíveis e filtros ativos, prévia do posto ao tocar num marcador. No navegador o mapa aparece numa versão estilizada (com pan e zoom); em um build nativo (Android/iOS) usa o Google Maps real, com os mesmos marcadores nas coordenadas reais das estações.

### Ficha do posto
Ao abrir um posto, mostra: foto real, carregadores disponíveis com tipo/potência/status, gráfico do período de menor movimento nas últimas 24h, reserva de horário de recarga (escolhendo entre os horários de menor movimento calculados a partir desse gráfico), horário de funcionamento, sugestões de cafés/lojas/restaurantes próximos para esperar a recarga, comodidades do local, botão de favoritar e botão "Iniciar navegação" que leva direto ao posto no mapa.

### Filtros de busca
Filtro por tipo de conector, potência mínima, comodidades e horário de funcionamento, além de atalhos rápidos por objetivo ("Chegar em casa", "Recarga rápida" etc.) que aplicam um conjunto de filtros de uma vez.

### Favoritos & Histórico
Duas abas: postos salvos como favoritos, e histórico de recargas já realizadas (com resumo de total de sessões, energia consumida e valor gasto).

### Comunidade
Feed de avaliações deixadas por outros usuários sobre os postos, com aba separada para ver só os próprios feedbacks. Cada avaliação tem nota por categoria (disponibilidade, fila, velocidade, conforto, preço) e comentário livre, registrados na tela "Contar experiência".

### Planejador de viagem
Escolha de destino (com busca por nome/endereço) e da autonomia restante do carro. A partir disso, calcula automaticamente as paradas de recarga necessárias no caminho — usando a mesma estratégia gulosa clássica de minimizar paradas —, mostra resumo da viagem (distância total, número de paradas, tempo estimado), potência de cada carregador no trajeto, e um botão "Iniciar viagem" que leva direto ao mapa focado na primeira parada.

### Acessibilidade
Tela de perfil com dois controles: aumentar o tamanho do texto do app (três níveis) e alternar entre modo claro e escuro. Ambos os controles são reativos em todo o app — não só nessa tela.

## Como abrir o projeto

Pré-requisitos: [Node.js](https://nodejs.org) instalado (versão 18 ou mais recente).

```bash
git clone https://github.com/rhunaa/FluiChallenge.git
cd FluiChallenge
npm install
```

Depois, para rodar no navegador (jeito mais rápido de ver o app funcionando):

```bash
npm run web
```

Isso abre o app em `http://localhost:8081`. Nessa versão, o mapa aparece de forma **estilizada** (interativo, com zoom e arraste), já que o mapa real do Google não roda em navegador — veja abaixo como ativar o mapa real.

Também é possível rodar com o Expo Go no celular (`npm start` e escanear o QR code), mas **sem o mapa real**, pelo mesmo motivo explicado abaixo.

## Como deixar o mapa 100% real (Google Maps)

O app já vem com a integração ao Google Maps pronta no código (biblioteca `react-native-maps`). Só falta configurar sua própria chave de API e gerar um build nativo, porque mapas nativos não funcionam em navegador nem no Expo Go.

### 1. Conseguir uma chave de API do Google Maps

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Crie um projeto (ou use um existente)
3. Em **APIs e serviços → Biblioteca**, ative:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
4. Em **APIs e serviços → Credenciais**, crie uma **Chave de API**
5. (Recomendado) Restrinja a chave para essas duas APIs

### 2. Configurar a chave no projeto

```bash
cp .env.example .env
```

Abra o arquivo `.env` e cole sua chave:

```
GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

Esse arquivo é ignorado pelo git (nunca é enviado ao repositório).

### 3. Gerar um build nativo

Como o mapa nativo só funciona dentro de um app instalado (não em Expo Go nem navegador), é preciso gerar um build com o [EAS](https://docs.expo.dev/build/introduction/):

```bash
npx eas-cli login
npx eas-cli build --profile preview --platform android
```

Ao final, o comando gera um link para baixar um `.apk` (ou, para iOS, um build instalável via TestFlight/simulador com `--platform ios`).

### 4. Instalar e testar

Baixe e instale o `.apk` no celular Android (ou o build de iOS no seu dispositivo), abra o app e vá até a aba **Mapa** — os pontos de recarga aparecem como marcadores sobre o mapa real do Google, com pan e zoom nativos.

## Sobre os dados

Todos os postos, avaliações, histórico de recargas e sugestões de locais próximos são dados simulados (mock), criados para demonstrar o funcionamento completo do app. Não há backend nem integração real com um provedor de dados de estações de recarga.

## Estrutura do projeto

```
src/
  telas/         → cada tela do app (Início, Mapa, Ficha do posto, Filtros, Favoritos,
                    Comunidade, Contar experiência, Planejador de viagem, Acessibilidade)
  componentes/    → componentes reutilizáveis de UI
  navegacao/      → configuração de navegação entre telas
  contexto/       → estado compartilhado (tema, favoritos, filtros, avaliações, reservas)
  dados/          → dados simulados: estações, avaliações, histórico, locais próximos,
                    algoritmo do planejador de rota
  tema/           → cores, espaçamentos e tipografia do app
  tipos/          → tipos e interfaces TypeScript
  utilitarios/    → funções auxiliares (ex: aplicar filtros)
docs/
  capturas-de-tela/ → prints do app para a documentação de entrega
```
