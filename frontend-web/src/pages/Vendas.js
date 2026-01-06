import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatarMoeda } from '../utils/formatarValor';
import { 
  Container, Grid, TextField, Button, InputAdornment, Paper, MenuItem, 
  Snackbar, Alert, Typography, Box, List, ListItem, ListItemText, 
  Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableRow, Autocomplete
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentIcon from '@mui/icons-material/Payment';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const formasPagamento = [
  { label: 'Dinheiro', value: 'dinheiro' },
  { label: 'Cartão de Crédito', value: 'cartao_credito' },
  { label: 'Cartão de Débito', value: 'cartao_debito' },
  { label: 'PIX', value: 'pix' }
];

export default function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [motorista, setMotorista] = useState('');
  const [rota, setRota] = useState('');
  const [desconto, setDesconto] = useState(0);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ open: false, success: true, message: '' });
  const [modalComprovante, setModalComprovante] = useState(false);
  const [vendaAtual, setVendaAtual] = useState(null);
  const [buscaProduto, setBuscaProduto] = useState('');
  const [filtroEstoque, setFiltroEstoque] = useState('');

  useEffect(() => {
    axios.get(`${API}/produtos`).then(res => {
      // Se a resposta tem a estrutura de paginação, pega o array de produtos
      const produtosData = res.data.produtos || res.data;
      setProdutos(Array.isArray(produtosData) ? produtosData : []);
    }).catch(() => setProdutos([]));
    axios.get(`${API}/clientes`).then(res => setClientes(res.data)).catch(() => setClientes([]));
  }, []);

  function adicionarAoCarrinho() {
    if (!produtoSelecionado || !quantidade || parseInt(quantidade) <= 0) {
      setFeedback({ open: true, success: false, message: 'Selecione um produto e quantidade válida.' });
      return;
    }

    const itemExistente = carrinho.find(item => item.produto.id === produtoSelecionado.id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item.produto.id === produtoSelecionado.id 
          ? { ...item, quantidade: item.quantidade + parseInt(quantidade) }
          : item
      ));
    } else {
      setCarrinho([...carrinho, { 
        produto: produtoSelecionado, 
        quantidade: parseInt(quantidade) 
      }]);
    }

    setProdutoSelecionado(null);
    setQuantidade('');
    setFeedback({ open: true, success: true, message: 'Produto adicionado ao carrinho!' });
  }

  function removerDoCarrinho(index) {
    setCarrinho(carrinho.filter((_, i) => i !== index));
  }

  function calcularTotal() {
    return carrinho.reduce((total, item) => {
      const preco = parseFloat(item.produto.preco) || 0;
      return total + (preco * item.quantidade);
    }, 0);
  }

  function calcularTotalLiquido() {
    return calcularTotal() - desconto;
  }

  function gerarUUID() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => {
      return Math.floor(Math.random() * 16).toString(16);
    });
  }

  function gerarNumeroRecibo() {
    return String(Date.now()).slice(-6).padStart(6, '0');
  }

  async function registrarVenda() {
    if (carrinho.length === 0) {
      setFeedback({ open: true, success: false, message: 'Adicione produtos ao carrinho.' });
      return;
    }
    if (!formaPagamento) {
      setFeedback({ open: true, success: false, message: 'Selecione a forma de pagamento.' });
      return;
    }
    if (!clienteSelecionado) {
      setFeedback({ open: true, success: false, message: 'Selecione um cliente.' });
      return;
    }

    const now = new Date();
    const dataFormatada = now.toLocaleDateString('pt-BR');
    const horaFormatada = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const venda = {
      numeroRecibo: gerarNumeroRecibo(),
      data: `${dataFormatada} ${horaFormatada}`,
      motorista: motorista || 'Não informado',
      rota: rota || 'Não informada',
      cliente: clienteSelecionado,
      produtos: carrinho,
      totalBruto: calcularTotal(),
      desconto: desconto,
      totalLiquido: calcularTotalLiquido(),
      formaPagamento: formasPagamento.find(f => f.value === formaPagamento)?.label || formaPagamento,
      uuid: gerarUUID()
    };

    try {
      // Salvar venda no backend
      const response = await axios.post('http://localhost:3001/vendas', venda);
      const vendaSalva = { ...venda, id: response.data.id };
      
      setVendaAtual(vendaSalva);
      setModalComprovante(true);
      setCarrinho([]);
      setFormaPagamento('');
      setClienteSelecionado(null);
      setMotorista('');
      setRota('');
      setDesconto(0);
      setFeedback({ open: true, success: true, message: 'Venda registrada com sucesso!' });
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      setFeedback({ open: true, success: false, message: 'Erro ao registrar venda. Tente novamente.' });
    }
  }

  function imprimirComprovante() {
    if (!vendaAtual) return;
    
    // Função auxiliar para formatar moeda na impressão
    const formatarMoedaImpressao = (valor) => {
      return parseFloat(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Comprovante de Venda - Recibo ${vendaAtual.numeroRecibo}</title>
          <style>
            @media print {
              @page { margin: 10mm; }
              body { margin: 0; }
            }
            body { 
              font-family: 'Courier New', monospace; 
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
              font-size: 14px;
              line-height: 1.5;
            }
            h1 { 
              text-align: center; 
              font-size: 22px;
              margin: 10px 0;
              text-transform: uppercase;
            }
            .info-linha { 
              text-align: center; 
              margin: 5px 0;
              font-size: 13px;
            }
            .linha { 
              border-top: 1px dashed #333; 
              margin: 15px 0; 
            }
            .secao { margin: 15px 0; }
            .item { 
              margin: 8px 0;
              padding-left: 10px;
            }
            .totais { 
              margin-top: 20px;
              font-size: 15px;
            }
            .total-liquido { 
              font-weight: bold; 
              font-size: 18px;
              color: #795548;
              margin: 10px 0;
            }
            .uuid {
              font-size: 11px;
              color: #666;
              word-break: break-all;
              margin-top: 15px;
            }
            strong { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>LEO SUPERMERCADO — RECIBO</h1>
          <div class="info-linha">
            <strong>Recibo nº:</strong> ${vendaAtual.numeroRecibo} | 
            <strong>Data:</strong> ${vendaAtual.data}
          </div>
          <div class="info-linha">
            <strong>Motorista:</strong> ${vendaAtual.motorista} | 
            <strong>Rota:</strong> ${vendaAtual.rota}
          </div>
          
          <div class="linha"></div>
          
          <div class="secao">
            <p><strong>Cliente:</strong> ${vendaAtual.cliente.nome} | <strong>CPF/CNPJ:</strong> ${vendaAtual.cliente.cpf_cnpj || 'Não informado'}</p>
            <p><strong>Endereço:</strong> ${vendaAtual.cliente.endereco}</p>
          </div>
          
          <div class="linha"></div>
          
          <div class="secao">
            <p><strong>Itens:</strong></p>
            ${vendaAtual.produtos.map((item, idx) => 
              `<div class="item">${idx + 1}) ${item.produto.nome} — ${item.quantidade} un x ${formatarMoedaImpressao(item.produto.preco)} = ${formatarMoedaImpressao(parseFloat(item.produto.preco) * item.quantidade)}</div>`
            ).join('')}
          </div>
          
          <div class="linha"></div>
          
          <div class="totais">
            <p><strong>Total bruto:</strong> ${formatarMoedaImpressao(vendaAtual.totalBruto)}</p>
            <p><strong>Desconto:</strong> ${formatarMoedaImpressao(vendaAtual.desconto)}</p>
            <p class="total-liquido"><strong>Total líquido:</strong> ${formatarMoedaImpressao(vendaAtual.totalLiquido)}</p>
            <p><strong>Pagamento:</strong> ${vendaAtual.formaPagamento}</p>
          </div>
          
          <div class="uuid">
            <strong>UUID:</strong> ${vendaAtual.uuid}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  function salvarPDF() {
    setFeedback({ open: true, success: true, message: 'Funcionalidade de PDF em desenvolvimento.' });
  }

  // Filtrar produtos com base na busca e no filtro de estoque
  const produtosFiltrados = Array.isArray(produtos) ? produtos.filter(produto => {
    // Filtro de busca por nome
    const matchBusca = !buscaProduto || 
      produto.nome.toLowerCase().includes(buscaProduto.toLowerCase());
    
    // Filtro de estoque
    const matchEstoque = !filtroEstoque || 
      produto.estoque >= parseInt(filtroEstoque);
    
    return matchBusca && matchEstoque;
  }) : [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
        Registrar Venda
      </Typography>

      <Grid container spacing={3}>
        {/* Formulário de Adição de Produtos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
              Adicionar Produto
            </Typography>
            
            {/* Busca e Filtros */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Buscar produto"
                  placeholder="Digite o nome do produto"
                  value={buscaProduto}
                  onChange={(e) => setBuscaProduto(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Estoque mínimo"
                  placeholder="Ex: 10"
                  value={filtroEstoque}
                  onChange={(e) => setFiltroEstoque(e.target.value)}
                  type="number"
                  fullWidth
                  size="small"
                  inputProps={{ min: 0 }}
                  helperText={filtroEstoque ? `Exibindo produtos com estoque ≥ ${filtroEstoque}` : ''}
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={produtosFiltrados}
                  getOptionLabel={(option) => `${option.nome} - R$ ${parseFloat(option.preco).toFixed(2)} (Estoque: ${option.estoque || 0})`}
                  value={produtoSelecionado}
                  onChange={(_, newValue) => setProdutoSelecionado(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Produto"
                      required
                      helperText={produtosFiltrados.length === 0 ? 'Nenhum produto encontrado' : `${produtosFiltrados.length} produto(s) disponível(is)`}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <ShoppingCartIcon sx={{ mr: 1, color: '#333' }} />
                            {params.InputProps.startAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                  noOptionsText="Nenhum produto encontrado"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quantidade"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  type="number"
                  fullWidth
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  onClick={adicionarAoCarrinho}
                  sx={{ 
                    py: 1.5, 
                    fontWeight: 'bold', 
                    background: '#333',
                    '&:hover': { background: '#2ac703ff' }
                  }}
                >
                  Adicionar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Carrinho de Compras */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
              Carrinho
            </Typography>
            {carrinho.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                Carrinho vazio
              </Typography>
            ) : (
              <List>
                {carrinho.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" onClick={() => removerDoCarrinho(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={item.produto.nome}
                        secondary={`Qtd: ${item.quantidade} × ${formatarMoeda(item.produto.preco)} = ${formatarMoeda(parseFloat(item.produto.preco) * item.quantidade)}`}
                      />
                    </ListItem>
                    {index < carrinho.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total:</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                {formatarMoeda(calcularTotal())}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Forma de Pagamento e Finalização */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto' }} elevation={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
              Dados da Venda
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' }, alignItems: 'center' }}>
                  <Box sx={{ flex: 1.5, minWidth: 120, width: { xs: '100%', md: 'auto' } }}>
                    <Autocomplete
                      options={clientes}
                      getOptionLabel={(option) => option.nome}
                      value={clienteSelecionado}
                      onChange={(_, newValue) => setClienteSelecionado(newValue)}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Cliente"
                          required
                          size="medium"
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ flex: 1.5, minWidth: 120, width: { xs: '100%', md: 'auto' } }}>
                    <TextField
                      label="Motorista"
                      value={motorista}
                      onChange={(e) => setMotorista(e.target.value)}
                      fullWidth
                      size="medium"
                      placeholder="Nome do motorista"
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 100, width: { xs: '100%', md: 'auto' } }}>
                    <TextField
                      label="Rota"
                      value={rota}
                      onChange={(e) => setRota(e.target.value)}
                      fullWidth
                      size="medium"
                      placeholder="Ex: Norte A"
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 80, width: { xs: '100%', md: 'auto' } }}>
                    <TextField
                      label="Desconto (R$)"
                      value={desconto}
                      onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
                      type="number"
                      fullWidth
                      size="medium"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Box>
                  <Box sx={{ flex: 1.2, minWidth: 120, width: { xs: '100%', md: 'auto' } }}>
                    <TextField
                      label="Forma de Pagamento"
                      value={formaPagamento}
                      onChange={(e) => setFormaPagamento(e.target.value)}
                      required
                      select
                      fullWidth
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PaymentIcon />
                          </InputAdornment>
                        )
                      }}
                    >
                      {formasPagamento.map(f => (
                        <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 120, width: { xs: '100%', md: 'auto' } }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={registrarVenda}
                      disabled={carrinho.length === 0}
                      sx={{ 
                        height: 56, 
                        fontWeight: 'bold',
                        background: '#1a7e01ff',
                        color: '#fff',
                        '&:hover': { background: '#2ac703ff' }
                      }}
                    >
                      Finalizar Venda
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal de Comprovante */}
      <Dialog open={modalComprovante} onClose={() => setModalComprovante(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', bgcolor: '#333', color: '#fff', fontWeight: 'bold' }}>
          Comprovante de Venda
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {vendaAtual && (
            <Box id="comprovante-impressao">
              <Typography variant="h5" sx={{ textAlign: 'center', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                LEO SUPERMERCADO — RECIBO
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', mb: 1 }}>
                Recibo nº: {vendaAtual.numeroRecibo} | Data: {vendaAtual.data}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                Motorista: {vendaAtual.motorista} | Rota: {vendaAtual.rota}
              </Typography>
              
              <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
              
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Cliente:</strong> {vendaAtual.cliente.nome} | <strong>CPF/CNPJ:</strong> {vendaAtual.cliente.cpf_cnpj || 'Não informado'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Endereço:</strong> {vendaAtual.cliente.endereco}
              </Typography>
              
              <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
              
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Itens:</Typography>
              {vendaAtual.produtos.map((item, idx) => (
                <Typography key={idx} variant="body2" sx={{ mb: 0.5, fontFamily: 'monospace' }}>
                  {idx + 1}) {item.produto.nome} — {item.quantidade} un x {formatarMoeda(item.produto.preco)} = {formatarMoeda(parseFloat(item.produto.preco) * item.quantidade)}
                </Typography>
              ))}
              
              <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
              
              <Box sx={{ fontFamily: 'monospace' }}>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Total bruto:</strong> {formatarMoeda(vendaAtual.totalBruto)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Desconto:</strong> {formatarMoeda(vendaAtual.desconto)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#795548', mb: 0.5 }}>
                  <strong>Total líquido:</strong> {formatarMoeda(vendaAtual.totalLiquido)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Pagamento:</strong> {vendaAtual.formaPagamento}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>UUID:</strong> {vendaAtual.uuid}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button startIcon={<PrintIcon />} onClick={imprimirComprovante} variant="outlined">
            Imprimir
          </Button>
          <Button startIcon={<PictureAsPdfIcon />} onClick={salvarPDF} variant="outlined">
            Salvar PDF
          </Button>
          <Button onClick={() => setModalComprovante(false)} variant="contained" sx={{ bgcolor: '#795548' }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={feedback.open} autoHideDuration={3000} onClose={() => setFeedback(f => ({ ...f, open: false }))}>
        <Alert onClose={() => setFeedback(f => ({ ...f, open: false }))} severity={feedback.success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
