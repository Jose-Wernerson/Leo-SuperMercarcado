
# Leo Super Mercado

MVP de sistema de vendas com rota.

## Como rodar o backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

O backend roda por padrão na porta 3001.

## Endpoints principais

- `GET /produtos` — listar produtos
- `POST /produtos` — cadastrar produto
- `GET /clientes` — listar clientes
- `POST /clientes` — cadastrar cliente
- `POST /rotas` — criar rota
- `GET /rotas/:id` — detalhes da rota
- `POST /vendas` — registrar venda
- `GET /vendas/:id/recibo` — gerar recibo simplificado


## Como rodar o frontend web

```bash
cd frontend-web
cp .env.example .env
npm install
npm start
```

O painel web roda por padrão na porta 3000.


## Como rodar o app mobile

```bash
cd frontend-mobile
cp .env.example .env
npm install
npm start
```

O app mobile pode ser rodado com Expo Go no celular ou emulador.
