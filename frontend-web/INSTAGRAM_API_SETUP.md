# Guia de Configuração da Instagram Graph API

## Como conectar o feed real do Instagram

O componente `InstagramFeed` está pronto para usar a Instagram Graph API. Para ativar o feed real, siga os passos abaixo:

## Passo 1: Criar um App no Facebook Developers

1. Acesse: https://developers.facebook.com/
2. Vá em "Meus Apps" > "Criar App"
3. Escolha o tipo "Business"
4. Preencha os dados do app

## Passo 2: Configurar Instagram Graph API

1. No painel do app, adicione o produto "Instagram Graph API"
2. Configure as permissões necessárias:
   - `instagram_basic`
   - `instagram_graph_user_media`
   - `instagram_graph_user_profile`

## Passo 3: Obter Token de Acesso

### Opção A: Token de Longa Duração (Recomendado)

1. Vá em Graph API Explorer
2. Selecione seu app
3. Adicione permissões: `instagram_basic`, `instagram_graph_user_media`
4. Clique em "Generate Access Token"
5. Copie o token de curta duração
6. Converta para longa duração usando:

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?
  grant_type=fb_exchange_token&
  client_id={app-id}&
  client_secret={app-secret}&
  fb_exchange_token={short-lived-token}"
```

### Opção B: Token de Usuário

1. Use o Graph API Explorer para obter o token
2. Certifique-se de ter uma conta Business conectada ao Instagram

## Passo 4: Obter seu User ID do Instagram

Execute no navegador ou Postman:
```
https://graph.instagram.com/me?fields=id,username&access_token={seu-token}
```

Guarde o `id` retornado.

## Passo 5: Configurar no Código

Abra `frontend-web/src/components/InstagramFeed.js` e:

1. Localize o comentário `// Para usar a API real do Instagram, descomente e configure:`
2. Descomente o código da função `fetchInstagramPosts`
3. Substitua:
   - `SEU_TOKEN_DE_ACESSO` pelo token obtido
   - `SEU_USER_ID` pelo ID obtido

## Passo 6 (Opcional): Usar Variáveis de Ambiente

Para maior segurança, crie um arquivo `.env` na pasta `frontend-web`:

```env
REACT_APP_INSTAGRAM_ACCESS_TOKEN=seu_token_aqui
REACT_APP_INSTAGRAM_USER_ID=seu_user_id_aqui
```

E no código, use:
```javascript
const accessToken = process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN;
const userId = process.env.REACT_APP_INSTAGRAM_USER_ID;
```

## Renovação do Token

Os tokens de longa duração expiram após 60 dias. Você precisará:

1. Criar um script para renovação automática
2. Ou renovar manualmente todo mês

### Script de Renovação Automática (Node.js)

```javascript
const axios = require('axios');

async function refreshToken(currentToken) {
  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;
  
  try {
    const response = await axios.get(url);
    console.log('Novo token:', response.data.access_token);
    console.log('Expira em:', response.data.expires_in, 'segundos');
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
  }
}

// Executar todo mês
refreshToken('seu_token_atual');
```

## Alternativa: Embed do Instagram

Se preferir uma solução mais simples sem API, você pode usar o Instagram Embed:

```html
<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/POST_ID/">
</blockquote>
<script async src="//www.instagram.com/embed.js"></script>
```

## Testando

Após configurar:
1. Reinicie o servidor React (`npm start`)
2. Acesse a landing page
3. Role até a seção Instagram
4. Você deverá ver as últimas 6 fotos/vídeos do seu perfil

## Campos Disponíveis da API

Você pode buscar mais informações dos posts alterando o parâmetro `fields`:

```javascript
fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count
```

**Nota:** Alguns campos requerem permissões adicionais.

## Suporte

- Documentação oficial: https://developers.facebook.com/docs/instagram-api
- Graph API Explorer: https://developers.facebook.com/tools/explorer/
