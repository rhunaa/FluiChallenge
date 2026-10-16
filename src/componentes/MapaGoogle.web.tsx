import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Estacao } from '../tipos';
import { usarFiltros } from '../contexto/ContextoFiltro';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { conectoresCorrespondentes, statusDosConectores } from '../utilitarios/filtrarEstacoes';
import { carregarGoogleMaps, mapIdGoogle, observarFalhaGoogleMaps, observarGoogleMapsTardio, temChaveGoogleMapsWeb } from '../servicos/googleMaps';
import { MapaEstilizado } from './MapaEstilizado';
import { Botao, Corpo, Mensagem } from './Interface';
interface Props { estacoes: Estacao[]; selectedId?: string; fadedIds?: string[]; onSelectStation: (id: string) => void }
export function MapaGoogle({ estacoes, selectedId, fadedIds = [], onSelectStation }: Props) {
  const focused = useIsFocused();
  const [visitado, setVisitado] = useState(focused);
  useEffect(() => { if (focused) setVisitado(true); }, [focused]);
  const { filters } = usarFiltros(); const { usuario } = usarAutenticacao();
  const configured = temChaveGoogleMapsWeb();
  const visible = useMemo(() => estacoes.filter(s => !fadedIds.includes(s.id)), [estacoes, fadedIds]);
  const container = useRef<HTMLDivElement>(null);
  const select = useRef(onSelectStation); select.current = onSelectStation;
  const entries = useRef(new Map<string, { marker: any; button: HTMLButtonElement }>());
  const [mapa, setMapa] = useState<any>(null), [sdk, setSdk] = useState<any>(null);
  const [fase, setFase] = useState<'loading'|'ready'|'failed'>('loading'), [erro, setErro] = useState(''), [tentativa, setTentativa] = useState(0);
  const signature = visible.map(s => `${s.id}:${s.lat}:${s.lng}`).join('|');
  const faseAtual = useRef(fase); faseAtual.current = fase; const recusado = useRef(false);
  useEffect(() => observarFalhaGoogleMaps(() => { recusado.current = true; setErro('O Google Maps recusou a configuração. Confira a chave web e os domínios permitidos.'); setFase('failed'); }), []);
  // Rede lenta: se o Google chegar depois do aviso, o mapa real entra sozinho no lugar do ilustrativo.
  useEffect(() => observarGoogleMapsTardio(() => { if (faseAtual.current === 'failed' && !recusado.current) { setFase('loading'); setTentativa(n => n + 1); } }), []);
  useEffect(() => {
    if (!configured || !visitado || !container.current) return;
    let cancelado = false; let instance: any; const node = container.current;
    setFase('loading'); setErro('');
    carregarGoogleMaps().then(async api => {
      const [{ Map: GoogleMap }, { AdvancedMarkerElement }] = await Promise.all([api.importLibrary('maps'), api.importLibrary('marker')]);
      if (cancelado) return;
      instance = new GoogleMap(node, { center: { lat: -23.5505, lng: -46.6333 }, zoom: 12, mapId: mapIdGoogle(), gestureHandling: 'cooperative', streetViewControl: false, mapTypeControl: false, fullscreenControl: true, keyboardShortcuts: true });
      setSdk({ api, AdvancedMarkerElement }); setMapa(instance); setFase('ready');
    }).catch(() => { if (!cancelado) { setErro('Não foi possível abrir o Google Maps. Confira conexão, chave web, APIs, faturamento e domínios permitidos.'); setFase('failed'); } });
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
      const status = statusDosConectores(conectoresCorrespondentes(station, filters, usuario?.tipoConector));
      const nomeStatus = status === 'available' ? 'conector disponível' : status === 'busy' ? 'conector ocupado' : 'fora de serviço';
      const checked = selectedId === station.id;
      entry.button.setAttribute('aria-label', `${station.name}, ${nomeStatus}, demonstração`); entry.button.setAttribute('aria-checked', String(checked));
      entry.button.textContent = station.id.replace('st-', '') + (status === 'available' ? 'D' : status === 'busy' ? 'O' : 'F');
      Object.assign(entry.button.style, { width: '48px', height: '48px', borderRadius: '16px', border: checked ? '4px solid #8B4DF0' : '3px solid #FFFFFF', background: status === 'available' ? '#241033' : status === 'busy' ? '#8A5A05' : '#665B77', color: '#FFFFFF', font: '700 14px Arial,sans-serif', boxShadow: '0 4px 16px rgba(26,12,47,.28)', cursor: 'pointer' });
      entry.marker.zIndex = checked ? 100 : 1;
    });
  }, [mapa, sdk, focused, fase, signature, selectedId, filters, usuario?.tipoConector]);
  useEffect(() => {
    if (!mapa || !sdk || fase !== 'ready' || !visible.length) return;
    const bounds = new sdk.api.LatLngBounds(); visible.forEach(s => bounds.extend({ lat: s.lat, lng: s.lng })); mapa.fitBounds(bounds, 52);
    const listener = mapa.addListener('idle', () => { if (mapa.getZoom() > 15) mapa.setZoom(15); sdk.api.event.removeListener(listener); });
    return () => sdk.api.event.removeListener(listener);
  }, [mapa, sdk, fase, signature]);
  useEffect(() => {
    if (!mapa || !sdk || !focused || fase !== 'ready') return;
    const frame = requestAnimationFrame(() => { sdk.api.event.trigger(mapa, 'resize'); const station = visible.find(s => s.id === selectedId); if (station) mapa.panTo({ lat: station.lat, lng: station.lng }); });
    return () => cancelAnimationFrame(frame);
  }, [mapa, sdk, focused, fase, selectedId]);
  const fallback = <MapaEstilizado estacoes={visible} selectedId={selectedId} onSelectStation={onSelectStation} />;
  if (!configured) return fallback;
  if (fase === 'failed') return <View style={{ gap: 12 }}><Mensagem erro>{erro} A lista continua disponível.</Mensagem><Botao variant="secondary" label="Tentar carregar Google Maps novamente" onPress={() => { setFase('loading'); setTentativa(n => n + 1); }} />{fallback}</View>;
  return <View style={{ gap: 10 }}><Corpo onBackground muted>Google Maps · base geográfica real. Os conectores e estados exibidos ainda são dados do cenário.</Corpo><div ref={container} role="region" aria-label="Google Maps com os postos dos filtros" data-testid="flui-google-map" style={{ width: '100%', height: 420, borderRadius: 24, overflow: 'hidden', background: '#E8E1F0', border: '1px solid #E2DCEF' }} />{fase === 'loading' && <Mensagem>Carregando Google Maps… Você já pode usar a lista de postos.</Mensagem>}</View>;
}
