import React from 'react';
import { Box, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';

export default function ReciboDANFE({ venda }) {
  if (!venda) return null;
  const { cliente, itens, total, formaPagamento, data } = venda;
  return (
    <Box sx={{
      maxWidth: 500,
      mx: 'auto',
      my: 4,
      p: 3,
      border: '2px dashed #333',
      borderRadius: 2,
      background: '#fff',
      fontFamily: 'monospace',
      boxShadow: 2
    }}>
      <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', letterSpacing: 2 }} gutterBottom>
        LEO SUPERMERCADO LTDA
      </Typography>
      <Typography align="center" sx={{ fontSize: 13 }}>
        CNPJ: 00.000.000/0001-00<br />Rua Exemplo, 123 - Centro<br />Cidade/UF: Exemplo/SP
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1 }}>RECIBO DE VENDA (DANFE Simplificado)</Typography>
      <Typography sx={{ fontSize: 13, mb: 1 }}>Data: {data || new Date().toLocaleDateString()}</Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={1} sx={{ fontSize: 13 }}>
        <Grid item xs={12} sm={7}><b>Cliente:</b> {cliente?.nome}</Grid>
        <Grid item xs={12} sm={5}><b>CPF/CNPJ:</b> {cliente?.cpf_cnpj}</Grid>
        <Grid item xs={12}><b>Endereço:</b> {cliente?.endereco}</Grid>
      </Grid>
      <Divider sx={{ my: 1 }} />
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: 13 }}>Produto</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 13 }}>Qtd</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 13 }}>Preço</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 13 }}>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itens?.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.nome || item.produto_id}</TableCell>
                <TableCell align="right">{item.quantidade}</TableCell>
                <TableCell align="right">R$ {Number(item.preco || item.preco_unitario).toFixed(2)}</TableCell>
                <TableCell align="right">R$ {(item.quantidade * (item.preco || item.preco_unitario)).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ my: 1 }} />
      <Grid container justifyContent="space-between" sx={{ fontSize: 15, fontWeight: 'bold' }}>
        <Grid item>Total:</Grid>
        <Grid item>R$ {Number(total).toFixed(2)}</Grid>
      </Grid>
      <Typography sx={{ mt: 1, fontSize: 14 }}><b>Forma de Pagamento:</b> {formaPagamento}</Typography>
      <Divider sx={{ my: 1 }} />
      <Typography align="center" sx={{ fontSize: 12, color: '#888', mt: 2 }}>
        Documento sem valor fiscal<br />Obrigado pela preferência!
      </Typography>
    </Box>
  );
}
