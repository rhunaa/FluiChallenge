import { ImageSourcePropType } from 'react-native';

// Fotos reais da região de cada endereço (Wikimedia Commons). Mostram o lugar, não o posto: os postos são do cenário de demonstração.
export type FotoLugarInfo = { arquivo: ImageSourcePropType; lugar: string; autor: string; licenca: string; pagina: string };

export const fotosLugares: Record<string, FotoLugarInfo> = {
  'st-1': { arquivo: require('../../assets/lugares/st-1.jpg'), lugar: "Praça da Sé, Centro de São Paulo", autor: "Webysther Nunes", licenca: "CC BY-SA 4.0", pagina: "https://commons.wikimedia.org/wiki/File:Webysther_20190306142828_-_Pra%C3%A7a_da_S%C3%A9.jpg" },
  'st-2': { arquivo: require('../../assets/lugares/st-2.jpg'), lugar: "Ponte Octávio Frias de Oliveira, na Av. das Nações Unidas", autor: "ikedaleo", licenca: "CC0", pagina: "https://commons.wikimedia.org/wiki/File:Ponte_Oct%C3%A1vio_Frias_de_Oliveira,_S%C3%A3o_Paulo,_Brasil.jpg" },
  'st-3': { arquivo: require('../../assets/lugares/st-3.jpg'), lugar: "Rodovia Rio–Santos (BR-101)", autor: "Cacobianchi", licenca: "Public domain", pagina: "https://commons.wikimedia.org/wiki/File:Rodovia_Rio_Santos.JPG" },
  'st-4': { arquivo: require('../../assets/lugares/st-4.jpg'), lugar: "Jardim Europa, São Paulo", autor: "José Marques de Oliv…", licenca: "CC BY-SA 3.0", pagina: "https://commons.wikimedia.org/wiki/File:Jardim_Europa,_S%C3%A3o_Paulo_-_State_of_S%C3%A3o_Paulo,_Brazil_-_panoramio_(1).jpg" },
  'st-5': { arquivo: require('../../assets/lugares/st-5.jpg'), lugar: "Brooklin e região da Berrini, zona sul", autor: "Pedu0303", licenca: "CC0", pagina: "https://commons.wikimedia.org/wiki/File:Brooklin_Novo_-_S%C3%A3o_Paulo_-_2017_3.jpg" },
  'st-6': { arquivo: require('../../assets/lugares/st-6.jpg'), lugar: "Rio Tietê e Marginal Tietê", autor: "Sintegrity", licenca: "CC BY-SA 4.0", pagina: "https://commons.wikimedia.org/wiki/File:Marginal_Tiet%C3%AA_20231215_05.jpg" },
  'st-7': { arquivo: require('../../assets/lugares/st-7.jpg'), lugar: "Theatro Municipal de São Paulo", autor: "Wilfredor", licenca: "CC0", pagina: "https://commons.wikimedia.org/wiki/File:Teatro_Municipal_de_S%C3%A3o_Paulo_8.jpg" },
  'st-8': { arquivo: require('../../assets/lugares/st-8.jpg'), lugar: "Paranapiacaba, no alto da Serra do Mar", autor: "Rodrigo Tetsuo Argenton", licenca: "CC BY-SA 4.0", pagina: "https://commons.wikimedia.org/wiki/File:Vila_Ferrovi%C3%A1ria_de_Paranapiacaba_por_Rodrigo_Tetsuo_Argenton_(01).jpg" },
};

export function creditoFoto(id: string): string | null {
  const f = fotosLugares[id];
  return f ? `Foto: ${f.autor} · ${f.licenca} · Wikimedia Commons` : null;
}
