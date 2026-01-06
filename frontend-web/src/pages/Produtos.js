import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Box, Container, Grid, TextField, Button, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert, Typography } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import NumbersIcon from '@mui/icons-material/Numbers';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StorageIcon from '@mui/icons-material/Storage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { formatarMoeda } from '../utils/formatarValor';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const regexNome = /^[A-Za-zÀ-ÿ\s]+$/;
const regexCodigo = /^[A-Z0-9]+$/;
const regexPreco = /^\d{1,}(\.|,)?\d{0,2}$/;
const regexEstoque = /^\d+$/;

export default function Produtos() {
	const [produtos, setProdutos] = useState([]);
	const [form, setForm] = useState({ nome: '', codigo: '', preco: '', estoque: '' });
	const [errors, setErrors] = useState({});
	const [feedback, setFeedback] = useState({ open: false, success: true, message: '' });
	const [editando, setEditando] = useState(null);
	const fileInputRef = useRef();

	useEffect(() => {
		axios.get(`${API}/produtos`).then(res => {
			// Se a resposta tem a estrutura de paginação, pega o array de produtos
			const produtosData = res.data.produtos || res.data;
			setProdutos(Array.isArray(produtosData) ? produtosData : []);
		}).catch(() => setProdutos([]));
	}, []);

	function validate(field, value) {
		switch (field) {
			case 'nome':
				if (!regexNome.test(value)) return 'Apenas letras e espaços.';
				break;
			case 'codigo':
				if (!regexCodigo.test(value)) return 'Somente letras maiúsculas e números.';
				break;
			case 'preco':
				if (!regexPreco.test(value.replace(',', '.'))) return 'Somente números decimais (ex: 10.50 ou 10,50).';
				break;
			case 'estoque':
				if (!regexEstoque.test(value) || parseInt(value) < 0) return 'Somente números inteiros positivos.';
				break;
			default:
				break;
		}
		return '';
	}

	function handleChange(e) {
		const { name, value } = e.target;
		
		// Formatação especial para o campo de preço
		if (name === 'preco') {
			// Remove tudo que não for número
			const apenasNumeros = value.replace(/\D/g, '');
			
			// Se não tiver números, limpa o campo
			if (!apenasNumeros) {
				setForm({ ...form, preco: '' });
				setErrors({ ...errors, preco: '' });
				return;
			}
			
			// Converte para número e divide por 100 para ter os centavos
			const valorNumerico = parseInt(apenasNumeros) / 100;
			
			// Formata com vírgula e ponto
			const valorFormatado = valorNumerico.toLocaleString('pt-BR', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
			
			// Atualiza o form com valor formatado para exibição e valor numérico para validação
			setForm({ ...form, preco: valorFormatado });
			setErrors({ ...errors, preco: validate('preco', valorNumerico.toString().replace('.', ',')) });
			return;
		}
		
		setForm({ ...form, [name]: value });
		setErrors({ ...errors, [name]: validate(name, value) });
	}

	function handleSubmit(e) {
		e.preventDefault();
		
		// Converte o preço formatado de volta para número antes de enviar
		const precoNumerico = form.preco.replace(/\./g, '').replace(',', '.');
		
		const newErrors = {
			nome: validate('nome', form.nome),
			codigo: validate('codigo', form.codigo),
			preco: validate('preco', form.preco),
			estoque: validate('estoque', form.estoque)
		};
		setErrors(newErrors);
		if (Object.values(newErrors).some(Boolean)) return;
		
		// Prepara os dados para envio com preço em formato numérico
		const dadosEnvio = {
			...form,
			preco: precoNumerico
		};
		
		if (editando) {
			// Modo edição - atualizar produto existente
			axios.put(`${API}/produtos/${editando}`, dadosEnvio).then(res => {
				setProdutos(Array.isArray(produtos) ? produtos.map(p => p.id === editando ? res.data : p) : [res.data]);
				setForm({ nome: '', codigo: '', preco: '', estoque: '' });
				setErrors({});
				setEditando(null);
				setFeedback({ open: true, success: true, message: 'Produto atualizado com sucesso!' });
			}).catch(() => {
				setFeedback({ open: true, success: false, message: 'Erro ao atualizar produto.' });
			});
		} else {
			// Modo criação - adicionar novo produto
			axios.post(`${API}/produtos`, dadosEnvio).then(res => {
				setProdutos(Array.isArray(produtos) ? [...produtos, res.data] : [res.data]);
				setForm({ nome: '', codigo: '', preco: '', estoque: '' });
				setErrors({});
				setFeedback({ open: true, success: true, message: 'Produto cadastrado com sucesso!' });
			}).catch(() => {
				setFeedback({ open: true, success: false, message: 'Erro ao cadastrar produto.' });
			});
		}
	}

	function handleEdit(produto) {
		// Formata o preço para exibição no formato brasileiro
		const precoFormatado = parseFloat(produto.preco).toLocaleString('pt-BR', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
		
		setForm({
			nome: produto.nome,
			codigo: produto.codigo,
			preco: precoFormatado,
			estoque: produto.estoque
		});
		setEditando(produto.id);
		setErrors({});
		// Scroll suave para o formulário
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleCancelEdit() {
		setForm({ nome: '', codigo: '', preco: '', estoque: '' });
		setEditando(null);
		setErrors({});
	}

	function handleDelete(id) {
		if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
		
		axios.delete(`${API}/produtos/${id}`).then(() => {
			setProdutos(produtos.filter(p => p.id !== id));
			setFeedback({ open: true, success: true, message: 'Produto excluído com sucesso!' });
			// Se estava editando este produto, limpar formulário
			if (editando === id) {
				handleCancelEdit();
			}
		}).catch(() => {
			setFeedback({ open: true, success: false, message: 'Erro ao excluir produto.' });
		});
	}

	return (
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Produtos</Typography>
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
											<Inventory2Icon />
										</InputAdornment>
									)
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								name="codigo"
								label="Código"
								value={form.codigo}
								onChange={handleChange}
								required
								fullWidth
								error={!!errors.codigo}
								helperText={errors.codigo}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<NumbersIcon />
										</InputAdornment>
									)
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								name="preco"
								label="Preço"
								value={form.preco}
								onChange={handleChange}
								required
								error={!!errors.preco}
								helperText={errors.preco}
								type="text"
								inputProps={{ inputMode: 'decimal', pattern: '[0-9,.]*' }}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<AttachMoneyIcon />
										</InputAdornment>
									)
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								name="estoque"
								label="Estoque"
								value={form.estoque}
								onChange={handleChange}
								required
								error={!!errors.estoque}
								helperText={errors.estoque}
								type="text"
								inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<StorageIcon />
										</InputAdornment>
									)
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={editando ? 4 : 6}>
							<Button type="submit" variant="contained" color="success" fullWidth sx={{ py: 1.5, fontWeight: 'bold' }}>
								{editando ? 'Atualizar' : 'Cadastrar'}
							</Button>
						</Grid>
						{editando && (
							<Grid item xs={12} sm={2}>
								<Button 
									variant="outlined" 
									color="error"
									fullWidth
									onClick={handleCancelEdit}
									sx={{ py: 1.5, fontWeight: 'bold' }}
								>
									Cancelar
								</Button>
							</Grid>
						)}
						<Grid item xs={12} sm={6}>
							<Button
								variant="contained"
								color="primary"
								fullWidth
								sx={{ py: 1.5, fontWeight: 'bold', background: '#1976d2' }}
								onClick={() => fileInputRef.current.click()}
							>
								Importar Planilha
							</Button>
							<input
								type="file"
								accept=".xlsx,.xls,.csv"
								ref={fileInputRef}
								style={{ display: 'none' }}
								onChange={handleFileUpload}
							/>
						</Grid>
					</Grid>
				</form>
			</Paper>
			<Snackbar open={feedback.open} autoHideDuration={4000} onClose={() => setFeedback(f => ({ ...f, open: false }))}>
				<Alert onClose={() => setFeedback(f => ({ ...f, open: false }))} severity={feedback.success ? 'success' : 'error'} sx={{ width: '100%' }}>
					{feedback.message}
				</Alert>
			</Snackbar>
			<TableContainer component={Paper} sx={{ maxWidth: 900, mx: 'auto', mt: 4 }} elevation={3}>
				<Table>
					<TableHead>
						<TableRow sx={{ backgroundColor: '#333' }}>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nome</TableCell>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Código</TableCell>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Preço</TableCell>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Estoque</TableCell>
							<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Ações</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{!Array.isArray(produtos) ? (
							<TableRow>
								<TableCell colSpan={6} align="center">
									Carregando produtos...
								</TableCell>
							</TableRow>
						) : produtos.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} align="center">
									Nenhum produto cadastrado
								</TableCell>
							</TableRow>
						) : produtos.map((p, idx) => (
							<TableRow key={p.id} sx={{ backgroundColor: idx % 2 === 0 ? '#f5f5f5' : '#fff' }}>
								<TableCell>{p.id}</TableCell>
								<TableCell>{p.nome}</TableCell>
								<TableCell>{p.codigo}</TableCell>
								<TableCell>{formatarMoeda(p.preco)}</TableCell>
								<TableCell>{p.estoque}</TableCell>
								<TableCell>
								<IconButton 
									color="primary" 
									size="small" 
									onClick={() => handleEdit(p)}
									title="Editar produto"
								>
									<EditIcon />
								</IconButton>
								<IconButton 
									color="error" 
									size="small" 
									onClick={() => handleDelete(p.id)}
									title="Excluir produto"
								>
									<DeleteIcon />
								</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
	// Função para processar o upload de arquivo
	function handleFileUpload(e) {
		const file = e.target.files[0];
		if (!file) return;
		const ext = file.name.split('.').pop().toLowerCase();
		if (!["xlsx", "xls", "csv"].includes(ext)) {
			setFeedback({ open: true, success: false, message: 'Formato de arquivo não suportado.' });
			return;
		}
		if (ext === 'csv') {
			Papa.parse(file, {
				header: true,
				skipEmptyLines: true,
				complete: (results) => {
					processImportedProducts(results.data);
				},
				error: () => setFeedback({ open: true, success: false, message: 'Erro ao ler o arquivo CSV.' })
			});
		} else {
			const reader = new FileReader();
			reader.onload = (evt) => {
				try {
					const wb = XLSX.read(evt.target.result, { type: 'binary' });
					const wsname = wb.SheetNames[0];
					const ws = wb.Sheets[wsname];
					const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
					processImportedProducts(data);
				} catch {
					setFeedback({ open: true, success: false, message: 'Erro ao ler a planilha.' });
				}
			};
			reader.readAsBinaryString(file);
		}
		// Limpa o input para permitir novo upload do mesmo arquivo
		e.target.value = '';
	}

	// Função para validar e adicionar produtos importados
	function processImportedProducts(data) {
		if (!Array.isArray(data) || data.length === 0) {
			setFeedback({ open: true, success: false, message: 'Planilha vazia ou inválida.' });
			return;
		}
		const requiredCols = ['Nome', 'Código', 'Preço', 'Estoque'];
		const colunas = Object.keys(data[0]);
		const missing = requiredCols.filter(col => !colunas.includes(col));
		if (missing.length > 0) {
			setFeedback({ open: true, success: false, message: `Colunas ausentes: ${missing.join(', ')}` });
			return;
		}
		const novosProdutos = [];
		let erroLinha = null;
		data.forEach((row, idx) => {
			const nome = String(row['Nome'] || '').trim();
			const codigo = String(row['Código'] || '').trim();
			const preco = String(row['Preço'] || '').replace(',', '.').trim();
			const estoque = String(row['Estoque'] || '').trim();
			if (!regexNome.test(nome)) erroLinha = idx + 2;
			if (!regexCodigo.test(codigo)) erroLinha = idx + 2;
			if (!regexPreco.test(preco)) erroLinha = idx + 2;
			if (!regexEstoque.test(estoque) || parseInt(estoque) < 0) erroLinha = idx + 2;
			novosProdutos.push({ nome, codigo, preco, estoque });
		});
		if (erroLinha) {
			setFeedback({ open: true, success: false, message: `Erro de validação na linha ${erroLinha}.` });
			return;
		}
		// Adiciona os produtos importados à tabela localmente
		setProdutos(produtosAnt => ([
			...(Array.isArray(produtosAnt) ? produtosAnt : []), 
			...novosProdutos.map((p, i) => ({
				...p,
				id: `imp-${Date.now()}-${i}` // id temporário
			}))
		]));
		setFeedback({ open: true, success: true, message: 'Produtos importados com sucesso!' });
	}
}
