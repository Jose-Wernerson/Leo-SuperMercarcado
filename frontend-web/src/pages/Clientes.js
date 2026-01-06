import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, TextField, Button, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const regexNome = /^[A-Za-zÀ-ÿ\s]+$/;
const regexCpfCnpj = /^\d{11}$|^\d{14}$/;
const regexEndereco = /^[\wÀ-ÿ\s.,\-ºª°/]+$/i;

export default function Clientes() {
	const [clientes, setClientes] = useState([]);
	const [form, setForm] = useState({ nome: '', cpf_cnpj: '', endereco: '' });
	const [errors, setErrors] = useState({});

	useEffect(() => {
		axios.get(`${API}/clientes`).then(res => setClientes(res.data));
	}, []);

	function validate(field, value) {
		switch (field) {
			case 'nome':
				if (!regexNome.test(value)) return 'Apenas letras e espaços.';
				break;
			case 'cpf_cnpj':
				if (!regexCpfCnpj.test(value)) return 'Digite 11 dígitos para CPF ou 14 para CNPJ.';
				break;
			case 'endereco':
				if (!regexEndereco.test(value)) return 'Endereço inválido.';
				break;
			default:
				break;
		}
		return '';
	}

	function handleChange(e) {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
		setErrors({ ...errors, [name]: validate(name, value) });
	}

	function handleSubmit(e) {
		e.preventDefault();
		const newErrors = {
			nome: validate('nome', form.nome),
			cpf_cnpj: validate('cpf_cnpj', form.cpf_cnpj),
			endereco: validate('endereco', form.endereco)
		};
		setErrors(newErrors);
		if (Object.values(newErrors).some(Boolean)) return;
		axios.post(`${API}/clientes`, form).then(res => {
			setClientes([...clientes, res.data]);
			setForm({ nome: '', cpf_cnpj: '', endereco: '' });
			setErrors({});
		});
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Clientes</Typography>
			<Paper sx={{ p: 3, mb: 4, maxWidth: 900, mx: 'auto' }} elevation={3}>
				<form onSubmit={handleSubmit} autoComplete="off">
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								name="nome"
								label="Nome"
								value={form.nome}
								onChange={handleChange}
								required
								fullWidth
								error={!!errors.nome}
								helperText={errors.nome}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PersonIcon />
										</InputAdornment>
									)
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								name="cpf_cnpj"
								label="CPF/CNPJ"
								value={form.cpf_cnpj}
								onChange={handleChange}
								required
								fullWidth
								error={!!errors.cpf_cnpj}
								helperText={errors.cpf_cnpj}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<BadgeIcon />
										</InputAdornment>
									)
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								name="endereco"
								label="Endereço"
								value={form.endereco}
								onChange={handleChange}
								required
								fullWidth
								error={!!errors.endereco}
								helperText={errors.endereco}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<HomeIcon />
										</InputAdornment>
									)
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5, fontWeight: 'bold', background: '#1a7e01ff', color: '#fff', '&:hover': { background: '#2ac703ff' } }}>
								Cadastrar
							</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
			<TableContainer component={Paper} sx={{ maxWidth: 900, mx: 'auto', mt: 4 }} elevation={3}>
				<Table>
					<TableHead>
						<TableRow sx={{ backgroundColor: '#333' }}>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nome</TableCell>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>CPF/CNPJ</TableCell>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Endereço</TableCell>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Ações</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{clientes.map((c, idx) => (
							<TableRow key={c.id} sx={{ backgroundColor: idx % 2 === 0 ? '#f5f5f5' : '#fff' }}>
								<TableCell>{c.id}</TableCell>
								<TableCell>{c.nome}</TableCell>
								<TableCell>{c.cpf_cnpj}</TableCell>
								<TableCell>{c.endereco}</TableCell>
								<TableCell>
									<IconButton color="primary" size="small" disabled><EditIcon /></IconButton>
									<IconButton color="error" size="small" disabled><DeleteIcon /></IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}
