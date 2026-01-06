import * as React from 'react';
import {
	Typography,
	Box,
	Grid
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';

export default function Dashboard() {
	return (
		<Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #795548 0%, #ffeb3b 100%)' }}>
			<Box component="main" sx={{ flexGrow: 1, p: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '80vh' }}>
					<Grid item xs={12} md={8} lg={6}>
						<Box sx={{
							background: 'rgba(255,255,255,0.95)',
							borderRadius: 4,
							boxShadow: 6,
							p: { xs: 3, md: 6 },
							textAlign: 'center',
							mt: { xs: 2, md: 0 }
						}}>
							<StorefrontIcon sx={{ fontSize: 60, color: '#795548', mb: 2 }} />
							<Typography variant="h4" sx={{ fontWeight: 'bold', color: '#795548', mb: 2 }}>
							Bem-vindo ao sistema Leo Supermercado!
							</Typography>
							<Typography variant="h6" sx={{ color: '#333', mb: 2 }}>
								Gerencie produtos, clientes, rotas e relatórios de forma simples e eficiente.
							</Typography>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}
