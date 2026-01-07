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
	// Controle de login
	const [logado, setLogado] = React.useState(false);
	// Controle se o usuário já viu a landing
	const [viuLanding, setViuLanding] = React.useState(() => {
		return localStorage.getItem('viuLanding') === 'true';
	});


	// Marca que o usuário viu a landing ao acessar / ou /home
	function handleLandingVisit() {
		localStorage.setItem('viuLanding', 'true');
		setViuLanding(true);
	}

	return (
		<Router>
			<Routes>
				{/* Sistema - Rotas Protegidas */}
				<Route path="/sistema/*" element={
					!viuLanding ? (
						<Navigate to="/" />
					) : !logado ? (
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


				{/* Landing Page - Rotas Públicas */}
				<Route path="/" element={<LandingPage onVisit={handleLandingVisit} />} />
				<Route path="/home" element={<LandingPage onVisit={handleLandingVisit} />} />

				{/* Qualquer outra rota vai para a landing page */}
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</Router>
	);
}

export default App;
