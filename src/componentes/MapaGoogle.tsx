// Arquivo só para checagem de tipos. O Metro sempre resolve primeiro o
// arquivo específico da plataforma (MapaGoogle.native.tsx no iOS/Android,
// MapaGoogle.web.tsx na web), então este aqui nunca é usado de verdade —
// ele só existe pro `tsc` e pro editor terem algo pra resolver ao importar
// './MapaGoogle'.
export { MapaGoogle } from './MapaGoogle.web';
