import React, { useEffect, useState } from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Texto } from './Texto';
import { fotosLugares } from '../dados/fotosLugares';

/* Foto real da região do endereço do posto (não é foto do posto), escolhida e creditada em assets/lugares.
   Nunca é trocada por foto do Google: o Google fica só no mapa. Legenda curta embaixo, como na prancha. */
export function FotoLugar({
  id,
  style,
  legenda = true,
  referencia,
  fallback,
}: {
  id: string;
  style?: StyleProp<ImageStyle>;
  legenda?: boolean;
  referencia?: ImageSourcePropType;
  fallback: React.ReactNode;
}) {
  const info = fotosLugares[id];
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [id]);
  const plano = (StyleSheet.flatten(style) || {}) as ImageStyle;
  const raio = typeof plano.borderRadius === 'number' ? plano.borderRadius : 16;
  const altura = typeof plano.height === 'number' ? plano.height : 200;
  const rotulo = info ? `Foto da região do posto: ${info.lugar}` : 'Foto do local';
  return (
    <View style={{ gap: 5 }}>
      <View style={{ overflow: 'hidden', borderRadius: raio, backgroundColor: '#242428' }}>
        {!failed && referencia ? (
          <Image
            testID={'foto-' + id}
            source={referencia}
            resizeMode="cover"
            accessibilityLabel={rotulo}
            onError={() => setFailed(true)}
            style={[{ width: '100%', height: 200 }, style]}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: altura,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {altura >= 160 ? fallback : <Ionicons name="location-outline" size={22} color="#C9B6FF" />}
          </View>
        )}
      </View>
      {legenda ? <Texto style={{ fontSize: 10, color: '#5F5D69' }}>Foto do local</Texto> : null}
    </View>
  );
}
