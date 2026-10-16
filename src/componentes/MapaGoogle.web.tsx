import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Estacao } from '../tipos';
import { usarFiltros } from '../contexto/ContextoFiltro';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { usarTema } from '../contexto/ContextoTema';
import { conectoresCorrespondentes, statusDosConectores } from '../utilitarios/filtrarEstacoes';
import { carregarGoogleMaps, mapIdGoogle, observarFalhaGoogleMaps, observarGoogleMapsTardio, temChaveGoogleMapsWeb } from '../servicos/googleMaps';
import { MapaEstilizado } from './MapaEstilizado';
import { EstadoMapa } from './estadoMapa';

interface Props {
  estacoes: Estacao[];
  selectedId?: string;
  fadedIds?: string[];
  onSelectStation: (id: string) => void;
  /* Altura total da área do mapa. A busca e o contador cobrem o topo até `reservaSuperior`; a folha cobre os últimos `reservaInferior` px. */
  altura?: number;
  reservaSuperior?: number;
  reservaInferior?: number;
  /* A tela mostra o estado do mapa numa linha curta da folha. */
  onStatus?: (estado: EstadoMapa) => void;
}

/* Fundo atrás dos cantos arredondados da folha, perto do terreno do Google Maps. */
const FUNDO_GOOGLE = '#ECEAF1';
const FONTE = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const SVG = 'http://www.w3.org/2000/svg';

/* Pino do Google igual ao do mapa ilustrativo: pílula com a potência; o selecionado fica em energia, com raio e nome. */
function desenharPino(botao: HTMLButtonElement, p: { status: string; kw: number; nome: string; marcado: boolean; compacto: boolean }) {
  const fora = p.status === 'offline';
  const pilula = document.createElement('span');
  Object.assign(pilula.style, {
    display: 'inline-flex', alignItems: 'center', gap: '6px', boxSizing: 'border-box', pointerEvents: 'none',
    height: p.marcado ? '38px' : '30px', padding: p.marcado ? '0 14px' : '0 11px', borderRadius: '999px',
    background: p.marcado ? '#8B4DF0' : fora ? '#FFFFFF' : '#242428', color: p.marcado ? '#FFFFFF' : fora ? '#5E5B6B' : '#EEEDF8',
    border: fora && !p.marcado ? '1px solid #858293' : '0', boxShadow: p.marcado ? '0 0 18px rgba(139,77,240,0.6)' : '0 4px 10px rgba(0,0,0,0.22)',
    font: `600 ${p.marcado ? 13 : 12}px ${FONTE}`, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
  });
  if (p.marcado) {
    const icone = document.createElementNS(SVG, 'svg');
    icone.setAttribute('viewBox', '0 0 24 24'); icone.setAttribute('width', '13'); icone.setAttribute('height', '13'); icone.setAttribute('aria-hidden', 'true');
    const raio = document.createElementNS(SVG, 'path');
    raio.setAttribute('d', 'M13.5 2 4 14h7l-1.5 8L20 10h-7z'); raio.setAttribute('fill', '#FFFFFF');
    icone.appendChild(raio); pilula.appendChild(icone);
  } else {
    const ponto = document.createElement('span');
    Object.assign(ponto.style, { width: '9px', height: '9px', borderRadius: '5px', boxSizing: 'border-box', flex: '0 0 auto' }, fora ? { border: '2px solid #5E5B6B' } : { background: p.status === 'available' ? '#C0F589' : '#F5C46B' });
    pilula.appendChild(ponto);
  }
  const texto = document.createElement('span');
  texto.textContent = p.marcado && !p.compacto ? `${p.kw} kW · ${p.nome}` : `${p.kw} kW`;
  pilula.appendChild(texto);
  const filhos: Node[] = [pilula];
  if (p.marcado) {
    const ponta = document.createElement('span');
    Object.assign(ponta.style, { position: 'absolute', left: '50%', bottom: '0', width: '12px', height: '12px', background: '#8B4DF0', transform: 'translateX(-50%) rotate(45deg)', pointerEvents: 'none' });
    filhos.unshift(ponta);
  }
  botao.replaceChildren(...filhos);
  Object.assign(botao.style, { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '44px', padding: '0', margin: '0', border: '0', background: 'transparent', cursor: 'pointer' });
}

export function MapaGoogle({ estacoes, selectedId, fadedIds = [], onSelectStation, altura = 520, reservaSuperior = 0, reservaInferior = 0, onStatus }: Props) {
  const focused = useIsFocused();
  const [visitado, setVisitado] = useState(focused);
  useEffect(() => { if (focused) setVisitado(true); }, [focused]);
  const { filters } = usarFiltros(); const { usuario } = usarAutenticacao(); const { fontScale } = usarTema();
  const janela = useWindowDimensions();
  /* Como no mapa ilustrativo: em tela estreita ou com fonte grande, o pino escolhido mostra só a potência; o nome segue na folha. */
  const compacto = janela.width < 380 || fontScale > 1.2;
  const configured = temChaveGoogleMapsWeb();
  const visible = useMemo(() => estacoes.filter(s => !fadedIds.includes(s.id)), [estacoes, fadedIds]);
  const container = useRef<HTMLDivElement>(null);
  const select = useRef(onSelectStation); select.current = onSelectStation;
  const avisar = useRef(onStatus); avisar.current = onStatus;
  const alto = altura - reservaInferior;
  const faixa = useRef({ topo: reservaSuperior, alto }); faixa.current = { topo: reservaSuperior, alto };
  const entries = useRef(new Map<string, { marker: any; button: HTMLButtonElement }>());
  const [mapa, setMapa] = useState<any>(null), [sdk, setSdk] = useState<any>(null);
  const [fase, setFase] = useState<'loading' | 'ready' | 'failed'>('loading'), [recusou, setRecusou] = useState(false), [tentativa, setTentativa] = useState(0);
  const signature = visible.map(s => `${s.id}:${s.lat}:${s.lng}`).join('|');
  const faseAtual = useRef(fase); faseAtual.current = fase; const recusado = useRef(false);
  const tentarDeNovo = useCallback(() => { setFase('loading'); setTentativa(n => n + 1); }, []);
  useEffect(() => observarFalhaGoogleMaps(() => {
    recusado.current = true; setRecusou(true); setFase('failed');
    console.warn('[Flui] Chave web do Google Maps recusada: confira APIs, faturamento e domínios permitidos.');
  }), []);
  // Rede lenta: se o Google chegar depois do aviso, o mapa real entra sozinho no lugar do ilustrativo.
  useEffect(() => observarGoogleMapsTardio(() => { if (faseAtual.current === 'failed' && !recusado.current) { setFase('loading'); setTentativa(n => n + 1); } }), []);
  useEffect(() => {
    const estado: EstadoMapa = !configured ? { fase: 'ilustrativo' } : fase === 'ready' ? { fase: 'pronto' } : fase === 'failed' ? (recusou ? { fase: 'recusado' } : { fase: 'lento', tentarDeNovo }) : { fase: 'carregando' };
    avisar.current?.(estado);
  }, [configured, fase, recusou, tentarDeNovo]);
  useEffect(() => {
    if (!configured || !visitado || !container.current) return;
    let cancelado = false; let instance: any; const node = container.current;
    setFase('loading');
    carregarGoogleMaps().then(async api => {
      const [{ Map: GoogleMap }, { AdvancedMarkerElement }] = await Promise.all([api.importLibrary('maps'), api.importLibrary('marker')]);
      if (cancelado) return;
      // Só o zoom fica: tela cheia, Street View, tipo de mapa e câmera batiam na busca e no botão de filtros. Pontos do Google não abrem balões de texto. 'greedy': um dedo ou o mouse arrasta o mapa; dois dedos, pinça ou a roda dão zoom.
      instance = new GoogleMap(node, { center: { lat: -23.5505, lng: -46.6333 }, zoom: 12, mapId: mapIdGoogle(), gestureHandling: 'greedy', disableDefaultUI: true, zoomControl: true, clickableIcons: false, keyboardShortcuts: true });
      setSdk({ api, AdvancedMarkerElement }); setMapa(instance); setFase('ready');
    }).catch(() => { if (!cancelado) setFase('failed'); });
    return () => { cancelado = true; entries.current.forEach(e => { e.marker.map = null; }); entries.current.clear(); instance && (window as any).google?.maps?.event?.clearInstanceListeners(instance); node.replaceChildren(); };
  }, [configured, visitado, tentativa]);
  useEffect(() => {
    if (!mapa || !sdk || !focused || fase !== 'ready') return;
    const ids = new Set(visible.map(s => s.id));
    entries.current.forEach((entry, id) => { if (!ids.has(id)) { entry.marker.map = null; entries.current.delete(id); } });
    visible.forEach(station => {
      let entry = entries.current.get(station.id);
      if (!entry) {
        const button = document.createElement('button'); button.type = 'button'; button.setAttribute('role', 'radio');
        button.addEventListener('click', e => { e.stopPropagation(); select.current(station.id); });
        const marker = new sdk.AdvancedMarkerElement({ map: mapa, position: { lat: station.lat, lng: station.lng }, title: station.name, content: button });
        entry = { marker, button }; entries.current.set(station.id, entry);
      }
      entry.marker.map = mapa;
      const cs = conectoresCorrespondentes(station, filters, usuario?.tipoConector);
      const status = statusDosConectores(cs);
      const kw = Math.max(...(cs.length ? cs : station.connectors).map(c => c.powerKw));
      const nomeStatus = status === 'available' ? 'conector disponível' : status === 'busy' ? 'conector ocupado' : 'fora de serviço';
      const marcado = selectedId === station.id;
      entry.button.setAttribute('aria-label', `${station.name}, ${nomeStatus}, demonstração`); entry.button.setAttribute('aria-checked', String(marcado));
      desenharPino(entry.button, { status, kw, nome: station.name, marcado, compacto });
      entry.marker.zIndex = marcado ? 100 : 1;
    });
  }, [mapa, sdk, focused, fase, signature, selectedId, filters, usuario?.tipoConector, compacto]);
  useEffect(() => {
    if (!mapa || !sdk || fase !== 'ready' || !visible.length) return;
    const bounds = new sdk.api.LatLngBounds(); visible.forEach(s => bounds.extend({ lat: s.lat, lng: s.lng }));
    // Os pinos crescem para cima a partir do ponto (44 px): a moldura deixa todos abaixo da busca e acima da folha.
    const { topo, alto: visivel } = faixa.current;
    const cima = Math.min(Math.max(48, topo + 52), Math.max(48, visivel - 140));
    mapa.fitBounds(bounds, { top: cima, right: 28, bottom: 28, left: 28 });
    const listener = mapa.addListener('idle', () => { if (mapa.getZoom() > 15) mapa.setZoom(15); sdk.api.event.removeListener(listener); });
    return () => sdk.api.event.removeListener(listener);
  }, [mapa, sdk, fase, signature]);
  useEffect(() => {
    if (!mapa || !sdk || !focused || fase !== 'ready') return;
    const frame = requestAnimationFrame(() => {
      sdk.api.event.trigger(mapa, 'resize');
      const station = visible.find(s => s.id === selectedId);
      if (!station) return;
      // O posto escolhido vai para o meio da faixa livre entre a busca e a folha, não para o meio do retângulo inteiro.
      const { topo, alto: visivel } = faixa.current;
      const desloca = Math.max(0, Math.round((topo + 44 + visivel) / 2 - visivel / 2));
      const proj = mapa.getProjection?.(); const zoom = mapa.getZoom?.();
      if (proj && typeof zoom === 'number' && desloca) {
        const ponto = proj.fromLatLngToPoint(new sdk.api.LatLng(station.lat, station.lng));
        mapa.panTo(proj.fromPointToLatLng(new sdk.api.Point(ponto.x, ponto.y - desloca / Math.pow(2, zoom))));
      } else mapa.panTo({ lat: station.lat, lng: station.lng });
    });
    return () => cancelAnimationFrame(frame);
  }, [mapa, sdk, focused, fase, selectedId]);
  const fallback = <MapaEstilizado estacoes={visible} selectedId={selectedId} onSelectStation={onSelectStation} altura={altura} reservaSuperior={reservaSuperior} reservaInferior={reservaInferior} />;
  if (!configured) return fallback;
  const pronto = fase === 'ready';
  /* O Google ocupa a área toda acima da folha (logo e créditos à vista). Enquanto ele não chega, ou se falhar, o mapa ilustrativo segura a tela. */
  return (
    <View style={{ height: altura, overflow: 'hidden', zIndex: 0, backgroundColor: pronto ? FUNDO_GOOGLE : 'transparent' }}>
      {pronto ? null : fallback}
      <div ref={container} role="region" aria-label="Google Maps com os postos dos filtros" data-testid="flui-google-map" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: alto, visibility: pronto ? 'visible' : 'hidden' }} />
    </View>
  );
}
