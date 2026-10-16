// Google Maps JS is loaded only when requested. The web key must have website/API restrictions.
export type GoogleMapsSdk = { importLibrary: (name: string) => Promise<any>; [key: string]: any };
let carregamento: Promise<GoogleMapsSdk> | undefined;
const falhas = new Set<() => void>();
export function temChaveGoogleMapsWeb() {
  return !!process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
}
export function mapIdGoogle() {
  return process.env.EXPO_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() || 'DEMO_MAP_ID';
}
export function observarFalhaGoogleMaps(listener: () => void) {
  falhas.add(listener);
  return () => { falhas.delete(listener); };
}
export function carregarGoogleMaps(chave = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || ''): Promise<GoogleMapsSdk> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return Promise.reject(new Error('Mapa disponível no navegador.'));
  if (!chave) return Promise.reject(new Error('A chave web do Google Maps ainda não foi configurada.'));
  const w = window as any;
  if (w.google?.maps?.importLibrary) return Promise.resolve(w.google.maps);
  if (carregamento) return carregamento;
  carregamento = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const callback = '__fluiMapsReady';
    let concluido = false;
    const terminar = (erro?: Error) => {
      if (concluido) return;
      concluido = true; clearTimeout(timer); delete w[callback];
      if (erro) { script.remove(); carregamento = undefined; reject(erro); }
      else resolve(w.google.maps);
    };
    const timer = window.setTimeout(() => terminar(new Error('O Google Maps demorou para responder. A lista continua disponível.')), 20000);
    w[callback] = () => w.google?.maps?.importLibrary ? terminar() : terminar(new Error('Não foi possível iniciar o Google Maps.'));
    const anterior = w.gm_authFailure;
    w.gm_authFailure = () => {
      falhas.forEach(fn => fn());
      terminar(new Error('O Google Maps recusou a configuração. Confira chave, APIs, faturamento e domínios permitidos.'));
      if (typeof anterior === 'function') anterior();
    };
    script.id = 'flui-google-maps-sdk'; script.async = true;
    const params = new URLSearchParams({ key: chave, loading: 'async', callback, v: 'quarterly', language: 'pt-BR', region: 'BR' });
    script.src = 'https://maps.googleapis.com/maps/api/js?' + params.toString();
    script.onerror = () => terminar(new Error('Não foi possível carregar o Google Maps. Confira a conexão.'));
    document.head.appendChild(script);
  });
  return carregamento;
}
export interface FotoGoogleLugar {
  url: string; nome: string; endereco: string;
  autores: Array<{ displayName: string; uri?: string }>;
}
export async function obterFotoGoogleLugar(placeId: string): Promise<FotoGoogleLugar | null> {
  const sdk = await carregarGoogleMaps();
  const { Place } = await sdk.importLibrary('places');
  const place = new Place({ id: placeId });
  await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'photos'] });
  const photo = place.photos?.[0];
  if (!photo) return null;
  // No persistent photo/URL cache: Places photos and attribution stay tied to the provider.
  return { url: photo.getURI({ maxWidth: 1200 }), nome: place.displayName || 'Local', endereco: place.formattedAddress || '', autores: photo.authorAttributions || [] };
}
