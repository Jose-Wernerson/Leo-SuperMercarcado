import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Snackbar, Alert, Typography, Autocomplete, Chip
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import RouteIcon from '@mui/icons-material/Route';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Mock de motoristas
const MOTORISTAS = [
  'João Silva',
  'Maria Souza',
  'Carlos Oliveira',
  'Ana Paula',
  'Pedro Santos'
];

export default function Rotas() {
  const [motorista, setMotorista] = useState('');
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [clientes, setClientes] = useState([]);
  const [rotas, setRotas] = useState([]);
  const [clientesOptions, setClientesOptions] = useState([]);
  const [feedback, setFeedback] = useState({ open: false, success: true, message: '' });
  const [errors, setErrors] = useState({ nome: '', data: '', motorista: '', clientes: '' });

  useEffect(() => {
    axios.get(`${API}/clientes`).then(res => setClientesOptions(res.data));
  }, []);

  function validateFields() {
    let valid = true;
    const newErrors = { nome: '', data: '', motorista: '', clientes: '' };
    // Nome da Rota: apenas letras e espaços
    if (!/^([A-Za-zÀ-ÿ\s]+)$/.test(nome.trim())) {
      newErrors.nome = 'Nome da Rota deve conter apenas letras e espaços.';
      valid = false;
    }
    // Data: formato dd/mm/aaaa
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.trim())) {
      newErrors.data = 'Data deve estar no formato dd/mm/aaaa.';
      valid = false;
    } else {
      // Verifica se a data é válida
      const [dia, mes, ano] = data.split('/').map(Number);
      const dt = new Date(`${ano}-${mes}-${dia}`);
      if (dt.getFullYear() !== ano || dt.getMonth() + 1 !== mes || dt.getDate() !== dia) {
        newErrors.data = 'Data inválida.';
        valid = false;
      }
    }
    // Motorista: apenas letras e espaços
    if (!/^([A-Za-zÀ-ÿ\s]+)$/.test(motorista.trim())) {
      newErrors.motorista = 'Motorista deve conter apenas letras.';
      valid = false;
    }
    // Clientes: nomes separados por vírgula, sem números
    if (clientes.length === 0) {
      newErrors.clientes = 'Selecione pelo menos um cliente.';
      valid = false;
    } else if (!clientes.every(c => /^([A-Za-zÀ-ÿ\s]+)$/.test(c.nome))) {
      newErrors.clientes = 'Os nomes dos clientes devem conter apenas letras.';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateFields()) return;
    axios.post(`${API}/rotas`, {
      nome,
      data,
      motorista,
      clientes: clientes.map(c => c.nome)
    }).then(res => {
      setRotas([...rotas, res.data]);
      setNome(''); setData(''); setMotorista(''); setClientes([]);
      setErrors({ nome: '', data: '', motorista: '', clientes: '' });
      setFeedback({ open: true, success: true, message: 'Rota criada com sucesso!' });
    }).catch(() => {
      setFeedback({ open: true, success: false, message: 'Erro ao criar rota.' });
    });
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#333' }}>
        <RouteIcon sx={{ mr: 1 }} />Planejar Rota
      </Typography>
      <Paper sx={{ p: 3, mb: 4, maxWidth: 900, mx: 'auto' }} elevation={3}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome da Rota"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                fullWidth
                error={!!errors.nome}
                helperText={errors.nome}
                InputProps={{ startAdornment: <RouteIcon sx={{ mr: 1 }} /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data"
                placeholder="dd/mm/aaaa"
                value={data}
                onChange={e => setData(e.target.value)}
                required
                fullWidth
                error={!!errors.data}
                helperText={errors.data}
                InputLabelProps={{ shrink: true }}
                InputProps={{ startAdornment: <EventIcon sx={{ mr: 1 }} /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={MOTORISTAS}
                value={motorista}
                onChange={(_, v) => setMotorista(v || '')}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Motorista"
                    required
                    error={!!errors.motorista}
                    helperText={errors.motorista}
                    InputProps={{ ...params.InputProps, startAdornment: <DirectionsCarIcon sx={{ mr: 1 }} /> }}
                  />
                )}
                fullWidth
                disableClearable
                isOptionEqualToValue={(option, value) => option === value}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={clientesOptions}
                getOptionLabel={option => option.nome}
                value={clientes}
                onChange={(_, v) => setClientes(v)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option.nome} {...getTagProps({ index })} icon={<GroupIcon />} />
                  ))
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Clientes"
                    required
                    error={!!errors.clientes}
                    helperText={errors.clientes}
                    InputProps={{ ...params.InputProps, startAdornment: <GroupIcon sx={{ mr: 1 }} /> }}
                  />
                )}
                fullWidth
                filterSelectedOptions
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5, fontWeight: 'bold', background: '#1a7e01ff', color: '#fff', '&:hover': { background: '#2ac703ff' } }}>
                Criar Rota
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar open={feedback.open} autoHideDuration={3000} onClose={() => setFeedback(f => ({ ...f, open: false }))}>
        <Alert onClose={() => setFeedback(f => ({ ...f, open: false }))} severity={feedback.success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>
      <Paper sx={{ p: 3, mt: 5, maxWidth: 900, mx: 'auto' }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>Rotas Criadas</Typography>
        {rotas.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Nenhuma rota criada ainda.
          </Typography>
        ) : (
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {rotas.map(r => (
              <Box component="li" key={r.id} sx={{ 
                p: 2, 
                mb: 1, 
                borderRadius: 1, 
                backgroundColor: '#f5f5f5',
                '&:hover': { backgroundColor: '#e0e0e0' }
              }}>
                <Typography variant="body1">
                  <strong>{r.nome}</strong> - {r.data} - {r.motorista}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clientes: {r.clientes.join(', ')}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
