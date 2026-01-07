import axios from 'axios';

// URL base da API - altere para produção quando fazer deploy
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============= PRODUTOS =============
export const getProdutos = (params = {}) => {
  return api.get('/produtos', { params });
};

export const getProdutoById = (id) => {
  return api.get(`/produtos/${id}`);
};

export const createProduto = (produto) => {
  return api.post('/produtos', produto);
};

export const updateProduto = (id, produto) => {
  return api.put(`/produtos/${id}`, produto);
};

export const deleteProduto = (id) => {
  return api.delete(`/produtos/${id}`);
};

export const getProdutosCategorias = () => {
  return api.get('/produtos/categorias');
};

// ============= CLIENTES =============
export const getClientes = (params = {}) => {
  return api.get('/clientes', { params });
};

export const getClienteById = (id) => {
  return api.get(`/clientes/${id}`);
};

export const createCliente = (cliente) => {
  return api.post('/clientes', cliente);
};

export const updateCliente = (id, cliente) => {
  return api.put(`/clientes/${id}`, cliente);
};

export const deleteCliente = (id) => {
  return api.delete(`/clientes/${id}`);
};

// ============= ROTAS =============
export const getRotas = () => {
  return api.get('/rotas');
};

export const getRotaById = (id) => {
  return api.get(`/rotas/${id}`);
};

export const createRota = (rota) => {
  return api.post('/rotas', rota);
};

export const updateRota = (id, rota) => {
  return api.put(`/rotas/${id}`, rota);
};

export const deleteRota = (id) => {
  return api.delete(`/rotas/${id}`);
};

export const getClientesByRota = (rotaId) => {
  return api.get(`/rotas/${rotaId}/clientes`);
};

// ============= VENDAS =============
export const getVendas = (params = {}) => {
  return api.get('/vendas', { params });
};

export const getVendaById = (id) => {
  return api.get(`/vendas/${id}`);
};

export const createVenda = (venda) => {
  return api.post('/vendas', venda);
};

export const updateVenda = (id, venda) => {
  return api.put(`/vendas/${id}`, venda);
};

export const deleteVenda = (id) => {
  return api.delete(`/vendas/${id}`);
};

export const getVendasByCliente = (clienteId) => {
  return api.get(`/vendas/cliente/${clienteId}`);
};

export const getVendasByRota = (rotaId, data) => {
  return api.get(`/vendas/rota/${rotaId}`, { params: { data } });
};

export const finalizarVenda = (id) => {
  return api.patch(`/vendas/${id}/finalizar`);
};

// ============= RECIBO =============
export const gerarRecibo = (vendaId) => {
  return api.get(`/vendas/${vendaId}/recibo`, {
    responseType: 'blob'
  });
};

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
