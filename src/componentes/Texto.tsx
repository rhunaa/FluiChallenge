import React from 'react';
import { StyleSheet, Text as TextoRN, TextProps } from 'react-native';
import { usarTema } from '../contexto/ContextoTema';

export function Texto({ style, ...props }: TextProps) {
  const { fontScale } = usarTema();
  const achatado = StyleSheet.flatten(style) as { fontSize?: number } | undefined;

  const estiloComEscala =
    achatado?.fontSize && fontScale !== 1
      ? [style, { fontSize: achatado.fontSize * fontScale }]
      : style;

  return <TextoRN allowFontScaling {...props} style={estiloComEscala} />;
}
