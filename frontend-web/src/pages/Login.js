import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Paper } from '@mui/material';

// Usuários válidos (em produção, isso viria do backend)
const USUARIOS_VALIDOS = [
	{ usuario: 'superleo', senha: 'Superleo1.', nome: 'Administrador' },
	{ usuario: 'vendedor', senha: 'vendedor123', nome: 'Vendedor' }
];

export default function Login({ onLogin }) {
	const [usuario, setUsuario] = useState('');
	const [senha, setSenha] = useState('');
	const [erro, setErro] = useState('');

	function handleSubmit(e) {
		e.preventDefault();
		setErro('');

		// Validação de campos vazios
		if (!usuario || !senha) {
			setErro('Por favor, preencha todos os campos');
			return;
		}

		// Verificar se o usuário e senha são válidos
		const usuarioValido = USUARIOS_VALIDOS.find(
			u => u.usuario === usuario && u.senha === senha
		);

		if (usuarioValido) {
			// Salvar informações do usuário no localStorage
			localStorage.setItem('usuarioLogado', JSON.stringify({
				usuario: usuarioValido.usuario,
				nome: usuarioValido.nome
			}));
			onLogin();
		} else {
			setErro('Usuário ou senha inválidos');
		}
	}

	return (
		<Box
			sx={{
				display: 'flex',
				height: '100vh',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(135deg, #1a7e01 0%, #228B22 100%)'
			}}
		>
			<Paper
				elevation={3}
				sx={{
					padding: 4,
					borderRadius: 2,
					minWidth: 350,
					maxWidth: 400
				}}
			>
				<Box sx={{ textAlign: 'center', mb: 3 }}>
					<Typography variant="h4" sx={{ color: '#1a7e01', fontWeight: 'bold', mb: 1 }}>
						Leo Supermercado
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Sistema de Gestão
					</Typography>
				</Box>

				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Usuário"
						variant="outlined"
						value={usuario}
						onChange={e => setUsuario(e.target.value)}
						sx={{ mb: 2 }}
						autoFocus
					/>
					<TextField
						fullWidth
						label="Senha"
						type="password"
						variant="outlined"
						value={senha}
						onChange={e => setSenha(e.target.value)}
						sx={{ mb: 2 }}
					/>

					{erro && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{erro}
						</Alert>
					)}

					<Button
						type="submit"
						fullWidth
						variant="contained"
						size="large"
						sx={{
							background: 'linear-gradient(135deg, #1a7e01 0%, #228B22 100%)',
							'&:hover': {
								background: 'linear-gradient(135deg, #228B22 0%, #1a7e01 100%)'
							}
						}}
					>
						Entrar
					</Button>
				</form>

				<Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
					<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
						<strong>Usuários de teste:</strong>
					</Typography>
					<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
						• superleo / Superleo1.
					</Typography>
					<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
						• vendedor / vendedor123
					</Typography>
				</Box>
			</Paper>
		</Box>
	);
}
