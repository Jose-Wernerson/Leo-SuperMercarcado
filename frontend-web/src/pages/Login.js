import React, { useState } from 'react';

export default function Login({ onLogin }) {
	const [usuario, setUsuario] = useState('');
	const [senha, setSenha] = useState('');

	function handleSubmit(e) {
		e.preventDefault();
		// Login fake
		if (usuario && senha) onLogin();
	}

	return (
		<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
			<form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
				<h2>Leo Supermercado</h2>
				<input placeholder="Usuário" value={usuario} onChange={e => setUsuario(e.target.value)} style={{ display: 'block', marginBottom: 12, width: 200 }} />
				<input placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} style={{ display: 'block', marginBottom: 12, width: 200 }} />
				<button type="submit" style={{ width: '100%' }}>Entrar</button>
			</form>
		</div>
	);
}
