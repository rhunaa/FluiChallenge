# Google Maps Web no Flui

## O que está pronto

O componente web usa Maps JavaScript API, marcadores nos pontos filtrados, seleção sincronizada com a ficha, enquadramento e câmera. O desenho ilustrativo é fallback declarado, não um Google Maps simulado. A chave nativa não é reutilizada automaticamente na web.

## Configuração da conta — operação manual

1. Abra a documentação oficial de início: https://developers.google.com/maps/get-started . No Google Cloud, selecione um projeto existente ou use **Create Project**. Para uma chave padrão, confira o faturamento desse projeto. O Flui não cria conta, não ativa cobrança e não modifica limites automaticamente.
2. Na biblioteca do Google Maps Platform, habilite **Maps JavaScript API**. Para as fotos, habilite **Places API (New)**. **ENABLE** habilita; **MANAGE** significa que já está habilitada. Não habilite todas as APIs indiscriminadamente.
3. Em **Google Maps Platform > Credentials**, uma chave existente aparece em **API keys**. Para criar uma nova, use **Create credentials > API key**, depois **Close**. Não publique nem envie a chave em conversa.
4. Na página de edição da chave, configure restrição de aplicação **Websites**. Autorize somente as origens necessárias, com protocolo e porta: `http://localhost:8081` e `http://127.0.0.1:8081`. Se acessar pela rede do festival, adicione a origem exata usada no Mac/rede; não libere todos os sites.
5. Em **API restrictions**, use **Restrict key**, **Select APIs** e selecione **Maps JavaScript API**, além de **Places API (New)** se as fotos forem usadas. Clique **Save**. Uma chave restrita a Android/iOS não serve automaticamente para esta web.
6. Abra `.frontend-ai/maps-background-r5/Configurar_Google_Maps.command` com duplo clique no Mac. A entrada é oculta e fica apenas em `.env.local`, ignorado pelo Git. Não é uma chave de servidor: `EXPO_PUBLIC_` será incluído no cliente, então as restrições do Google são obrigatórias.
7. Recarregue completamente `http://localhost:8081` e abra Mapa. Depois verifique que o mapa geográfico aparece, que os marcadores seguem os filtros e que clicar num ponto seleciona o mesmo posto. Só esse teste com uma chave válida confirma a integração autenticada.

O map ID `DEMO_MAP_ID` é padrão de desenvolvimento documentado. Para configuração própria de apresentação/produção, pode-se usar `EXPO_PUBLIC_GOOGLE_MAPS_MAP_ID` com um map ID do projeto. As chaves de demonstração do Google são destinadas a prototipação, não devem ser tratadas como ativação de produção.

Use os controles de quota e orçamento da sua conta. Alertas de orçamento não equivalem a um bloqueio automático de cobranças. Não há teste de 6.000 acessos simultâneos.

## Fotos dos lugares

Decisão do produto: os 8 postos continuam fictícios e cada um mostra uma foto real da região do endereço que diz ter (por exemplo, a Praça da Sé para a Estação Praça da Sé). A foto não é do posto, e a interface diz isso («Foto do local» e o crédito na ficha). As fotos são curadas do Wikimedia Commons, ficam em `assets/lugares/` e têm autor, licença e página em `assets/lugares/creditos.json`. O Google é usado só no mapa: a foto do local nunca é trocada por uma foto do Google Places. Se os postos passarem a ser reais, confirmar endereço, coordenadas e o `googlePlaceId` de cada um antes de usar qualquer foto do Google, e então exibir as atribuições exigidas pela política do Google.

Referências oficiais consultadas:
- https://developers.google.com/maps/documentation/javascript/get-api-key
- https://developers.google.com/maps/documentation/javascript/load-maps-js-api
- https://developers.google.com/maps/api-security-best-practices
- https://developers.google.com/maps/documentation/javascript/examples/place-photos
- https://docs.expo.dev/guides/environment-variables
