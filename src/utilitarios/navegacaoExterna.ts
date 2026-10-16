import { Linking, Platform } from 'react-native';
import { Estacao } from '../tipos';
import { urlNavegacao } from './coordenadas';
export { urlNavegacao } from './coordenadas';
export async function abrirNavegacao(station: Estacao): Promise<boolean> {
  try {
    const url = urlNavegacao(station);
    if (Platform.OS === 'web') {
      const win = (globalThis as any).window;
      if (!win || win.navigator?.onLine === false) return false;
      win.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
