import React from 'react';
import { StyleSheet, Text as TextoRN, TextProps } from 'react-native';
import { usarTema } from '../contexto/ContextoTema';

/* Aplica a escala de fonte do app (1; 1,15; 1,3). escalaMax limita numeros grandes, como o numero heroi. */
export function Texto({ style, escalaMax, ...props }: TextProps & { escalaMax?: number }) {
  const { fontScale } = usarTema();
  const escala = escalaMax ? Math.min(fontScale, escalaMax) : fontScale;
  const achatado = StyleSheet.flatten(style) as { fontSize?: number; lineHeight?: number } | undefined;
  const estiloComEscala =
    achatado?.fontSize && escala !== 1
      ? [style, { fontSize: achatado.fontSize * escala, ...(achatado.lineHeight ? { lineHeight: achatado.lineHeight * escala } : {}) }]
      : style;
  return <TextoRN allowFontScaling {...props} style={estiloComEscala} />;
}
