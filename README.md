# Flui

App mobile para motoristas de veículos elétricos encontrarem, avaliarem e planejarem paradas em pontos de recarga. Feito em React Native (Expo) com TypeScript.

## Como abrir o projeto

Pré-requisitos: [Node.js](https://nodejs.org) instalado (versão 18 ou mais recente).

```bash
git clone https://github.com/rhunaa/ChallengeFlui.git
cd ChallengeFlui
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

## Estrutura do projeto

```
src/
  telas/         → cada tela do app (Início, Mapa, Filtros, Comunidade, etc.)
  componentes/    → componentes reutilizáveis de UI
  navegacao/      → configuração de navegação entre telas
  contexto/       → estado compartilhado (favoritos, filtros, avaliações)
  dados/          → dados simulados dos pontos de recarga e avaliações
  tema/           → cores, espaçamentos e tipografia do app
  tipos/          → tipos e interfaces TypeScript
  utilitarios/    → funções auxiliares (ex: aplicar filtros)
docs/
  capturas-de-tela/ → prints do app para a documentação de entrega
```
