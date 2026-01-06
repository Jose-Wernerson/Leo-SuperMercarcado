import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function Relatorios() {
	const [vendas, setVendas] = useState([]);
	const [rotaId, setRotaId] = useState('');
	const [relatorio, setRelatorio] = useState([]);

	useEffect(() => {
		// Não há endpoint de listagem de vendas, então mock
		setVendas([]);
	}, []);

	function buscarRelatorio() {
		if (!rotaId) return;
		axios.get(`${API}/rotas/${rotaId}`).then(res => {
			// Simula relatório
			setRelatorio([{ cliente: 'Cliente 1', total: 100 }, { cliente: 'Cliente 2', total: 200 }]);
		});
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Typography variant="h4" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#333' }}>
				<AssessmentIcon sx={{ mr: 1, fontSize: 32 }} />
				Relatório de Vendas por Rota
			</Typography>
			<Paper sx={{ p: 3, mb: 3, maxWidth: 600, mx: 'auto' }} elevation={3}>
				<TextField
					label="ID da Rota"
					value={rotaId}
					onChange={e => setRotaId(e.target.value)}
					fullWidth
					sx={{ mb: 2 }}
				/>
				<Button variant="contained" color="primary" onClick={buscarRelatorio} fullWidth>
					Buscar
				</Button>
			</Paper>
			<TableContainer component={Paper} sx={{ maxWidth: 900, mx: 'auto', mt: 4 }} elevation={3}>
				<Table>
					<TableHead>
						<TableRow sx={{ backgroundColor: '#1976d2' }}>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Cliente</TableCell>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Total</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{relatorio.map((r, i) => (
							<TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#fff' }}>
								<TableCell>{r.cliente}</TableCell>
								<TableCell>R$ {r.total.toFixed(2)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}
