import React, { useState, useEffect } from 'react';
import { formatarMoeda } from '../utils/formatarValor';
import { 
  Container, 
  Typography, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, success: true, message: '' });

  useEffect(() => {
    carregarPedidos();
  }, []);

  useEffect(() => {
    if (filtro.trim() === '') {
      setPedidosFiltrados(pedidos);
    } else {
      const filtrados = pedidos.filter(pedido => 
        pedido.numeroRecibo.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.motorista.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.rota.toLowerCase().includes(filtro.toLowerCase())
      );
      setPedidosFiltrados(filtrados);
    }
  }, [filtro, pedidos]);

  const carregarPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/vendas');
      // Se não houver vendas, o array estará vazio mas não deve dar erro
      const vendasCarregadas = response.data || [];
      setPedidos(vendasCarregadas);
      setPedidosFiltrados(vendasCarregadas);
      
      if (vendasCarregadas.length === 0) {
        setFeedback({ open: true, success: true, message: 'Nenhum pedido encontrado. Faça uma venda primeiro!' });
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      // Mantém arrays vazios em caso de erro
      setPedidos([]);
      setPedidosFiltrados([]);
      setFeedback({ 
        open: true, 
        success: false, 
        message: 'Erro ao conectar com o servidor. Verifique se o backend está rodando.' 
      });
    }
  };

  const abrirDetalhes = (pedido) => {
    setPedidoSelecionado(pedido);
    setModalDetalhes(true);
  };

  const fecharDetalhes = () => {
    setModalDetalhes(false);
    setPedidoSelecionado(null);
  };

  const imprimirPedido = (pedido) => {
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
          <title>Comprovante de Venda - Recibo ${pedido.numeroRecibo}</title>
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
              color: #333;
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
            <strong>Recibo nº:</strong> ${pedido.numeroRecibo} | 
            <strong>Data:</strong> ${pedido.data}
          </div>
          <div class="info-linha">
            <strong>Motorista:</strong> ${pedido.motorista} | 
            <strong>Rota:</strong> ${pedido.rota}
          </div>
          
          <div class="linha"></div>
          
          <div class="secao">
            <p><strong>Cliente:</strong> ${pedido.cliente.nome} | <strong>CPF/CNPJ:</strong> ${pedido.cliente.cpf_cnpj || 'Não informado'}</p>
            <p><strong>Endereço:</strong> ${pedido.cliente.endereco}</p>
          </div>
          
          <div class="linha"></div>
          
          <div class="secao">
            <p><strong>Itens:</strong></p>
            ${pedido.produtos.map((item, idx) => 
              `<div class="item">${idx + 1}) ${item.produto.nome} — ${item.quantidade} un x ${formatarMoedaImpressao(item.produto.preco)} = ${formatarMoedaImpressao(parseFloat(item.produto.preco) * item.quantidade)}</div>`
            ).join('')}
          </div>
          
          <div class="linha"></div>
          
          <div class="totais">
            <p><strong>Total bruto:</strong> ${formatarMoedaImpressao(pedido.totalBruto)}</p>
            <p><strong>Desconto:</strong> ${formatarMoedaImpressao(pedido.desconto)}</p>
            <p class="total-liquido"><strong>Total líquido:</strong> ${formatarMoedaImpressao(pedido.totalLiquido)}</p>
            <p><strong>Pagamento:</strong> ${pedido.formaPagamento}</p>
          </div>
          
          <div class="uuid">
            <strong>UUID:</strong> ${pedido.uuid}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const cancelarPedido = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/vendas/${id}`);
      setFeedback({ open: true, success: true, message: 'Pedido cancelado com sucesso!' });
      carregarPedidos(); // Recarregar lista
      if (modalDetalhes && pedidoSelecionado?.id === id) {
        fecharDetalhes();
      }
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      setFeedback({ open: true, success: false, message: 'Erro ao cancelar pedido.' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluído':
        return 'success';
      case 'Pendente':
        return 'warning';
      case 'Cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
        Gerenciar Pedidos
      </Typography>

      {/* Barra de Pesquisa e Ações */}
      <Paper sx={{ p: 3, mb: 3, maxWidth: 1200, mx: 'auto' }} elevation={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Pesquisar por recibo, cliente, motorista ou rota"
              variant="outlined"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: '#333' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={carregarPedidos}
              sx={{ bgcolor: '#1a7e01ff', color: '#fff', '&:hover': { bgcolor: '#2ac703ff' }, height: 56 }}
            >
              Atualizar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabela de Pedidos */}
      <TableContainer component={Paper} sx={{ maxWidth: 1200, mx: 'auto' }} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#333' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Recibo</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Data/Hora</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Motorista</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Rota</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'right' }}>Total</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhum pedido encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pedidosFiltrados.map((pedido) => (
                <TableRow key={pedido.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                      #{pedido.numeroRecibo}
                    </Typography>
                  </TableCell>
                  <TableCell>{pedido.data}</TableCell>
                  <TableCell>{pedido.cliente.nome}</TableCell>
                  <TableCell>{pedido.motorista}</TableCell>
                  <TableCell>{pedido.rota}</TableCell>
                  <TableCell sx={{ textAlign: 'right', fontWeight: 'bold', color: '#333' }}>
                    {formatarMoeda(pedido.totalLiquido)}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Chip 
                      label={pedido.status} 
                      color={getStatusColor(pedido.status)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => abrirDetalhes(pedido)}
                      title="Ver detalhes"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => imprimirPedido(pedido)}
                      title="Imprimir"
                    >
                      <PrintIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => cancelarPedido(pedido.id)}
                      title="Cancelar"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Detalhes */}
      <Dialog open={modalDetalhes} onClose={fecharDetalhes} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', bgcolor: '#795548', color: '#fff', fontWeight: 'bold' }}>
          Detalhes do Pedido #{pedidoSelecionado?.numeroRecibo}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {pedidoSelecionado && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Data/Hora:</strong> {pedidoSelecionado.data}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Status:</strong>{' '}
                    <Chip 
                      label={pedidoSelecionado.status} 
                      color={getStatusColor(pedidoSelecionado.status)} 
                      size="small"
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Motorista:</strong> {pedidoSelecionado.motorista}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Rota:</strong> {pedidoSelecionado.rota}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Dados do Cliente
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Nome:</strong> {pedidoSelecionado.cliente.nome}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>CPF/CNPJ:</strong> {pedidoSelecionado.cliente.cpf_cnpj || 'Não informado'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Endereço:</strong> {pedidoSelecionado.cliente.endereco}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Produtos
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Produto</strong></TableCell>
                      <TableCell align="center"><strong>Qtd</strong></TableCell>
                      <TableCell align="right"><strong>Preço Un.</strong></TableCell>
                      <TableCell align="right"><strong>Subtotal</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedidoSelecionado.produtos.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.produto.nome}</TableCell>
                        <TableCell align="center">{item.quantidade}</TableCell>
                        <TableCell align="right">{formatarMoeda(item.produto.preco)}</TableCell>
                        <TableCell align="right">
                          {formatarMoeda(parseFloat(item.produto.preco) * item.quantidade)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Total bruto:</strong> {formatarMoeda(pedidoSelecionado.totalBruto)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Desconto:</strong> {formatarMoeda(pedidoSelecionado.desconto)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#795548', mb: 0.5 }}>
                  <strong>Total líquido:</strong> {formatarMoeda(pedidoSelecionado.totalLiquido)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Forma de Pagamento:</strong> {pedidoSelecionado.formaPagamento}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  <strong>UUID:</strong> {pedidoSelecionado.uuid}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            startIcon={<PrintIcon />}
            onClick={() => imprimirPedido(pedidoSelecionado)}
            variant="outlined"
          >
            Imprimir
          </Button>
          <Button
            onClick={fecharDetalhes}
            variant="contained"
            sx={{ bgcolor: '#795548' }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={feedback.success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
