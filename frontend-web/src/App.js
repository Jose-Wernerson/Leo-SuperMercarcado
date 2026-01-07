import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Clientes from './pages/Clientes';
import Rotas from './pages/Rotas';
import Vendas from './pages/Vendas';
import Pedidos from './pages/Pedidos';
import Usuarios from './pages/Usuarios';
import Configuracoes from './pages/Configuracoes';
import LandingPage from './pages/LandingPage';
import './styles/global.css';

function App() {
	// Simples controle de login fake
	const [logado, setLogado] = React.useState(true);

	return (
		<Router>
			<Routes>
				{/* Landing Page - Rota Pública */}
				<Route path="/home" element={<LandingPage />} />
				
				{/* Sistema - Rotas Protegidas */}
				<Route path="/sistema/*" element={
					!logado ? (
						<Login onLogin={() => setLogado(true)} />
					) : (
						<Box sx={{ display: 'flex', minHeight: '100vh' }}>
							<Sidebar />
							<Box
								component="main"
								sx={{
									flexGrow: 1,
									bgcolor: '#f5f5f5',
									minHeight: '100vh',
									overflow: 'auto'
								}}
							>
								<Routes>
									<Route path="/" element={<Dashboard />} />
									<Route path="/vendas" element={<Vendas />} />
									<Route path="/pedidos" element={<Pedidos />} />
									<Route path="/produtos" element={<Produtos />} />
									<Route path="/clientes" element={<Clientes />} />
									<Route path="/rotas" element={<Rotas />} />
									<Route path="/usuarios" element={<Usuarios />} />
									<Route path="/configuracoes" element={<Configuracoes />} />
									<Route path="*" element={<Navigate to="/sistema" />} />
								</Routes>
							</Box>
						</Box>
					)
				} />
				
				{/* Redirecionar raiz para landing page */}
				<Route path="/" element={<Navigate to="/home" />} />
				<Route path="*" element={<Navigate to="/home" />} />
			</Routes>
		</Router>
	);
}

export default App;
