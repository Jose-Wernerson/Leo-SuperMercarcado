import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';

export default function Usuarios() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#333' }}>
        <GroupIcon sx={{ mr: 1, fontSize: 32 }} />
        Usuários
      </Typography>
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 800, mx: 'auto' }} elevation={3}>
        <Typography variant="h6" color="text.secondary">
          Página em desenvolvimento
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Em breve você poderá gerenciar usuários e permissões.
        </Typography>
      </Paper>
    </Container>
  );
}
