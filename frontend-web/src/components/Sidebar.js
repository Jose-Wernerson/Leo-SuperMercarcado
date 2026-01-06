import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import logo from '../assets/logo-leo.png';
import {
  ShoppingCart as VenderIcon,
  Receipt as PedidosIcon,
  Inventory2 as ProdutosIcon,
  People as ClientesIcon,
  Route as RotasIcon,
  Group as UsuariosIcon,
  Settings as ConfiguracoesIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Vender', icon: <VenderIcon />, path: '/vendas' },
  { text: 'Pedidos', icon: <PedidosIcon />, path: '/pedidos' },
  { text: 'Produtos', icon: <ProdutosIcon />, path: '/produtos' },
  { text: 'Clientes', icon: <ClientesIcon />, path: '/clientes' },
  { text: 'Rotas', icon: <RotasIcon />, path: '/rotas' },
  { text: 'Usuários', icon: <UsuariosIcon />, path: '/usuarios' },
  { text: 'Configurações', icon: <ConfiguracoesIcon />, path: '/configuracoes' }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#2A323E',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#1f2630',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img 
          src={logo} 
          alt="Leo Supermercado" 
          style={{ 
            height: 100, 
            width: 'auto',
            maxWidth: '100%',
            objectFit: 'contain'
          }} 
        />
      </Box>

      {/* Menu Items */}
      <List sx={{ pt: 2, flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 1,
                borderRadius: 1,
                backgroundColor: location.pathname === item.path ? '#FFEB3B' : 'transparent',
                color: location.pathname === item.path ? '#4E342E' : '#FFFFFF',
                '&:hover': {
                  backgroundColor: location.pathname === item.path ? '#FFEB3B' : 'rgba(255, 235, 59, 0.1)',
                  color: location.pathname === item.path ? '#4E342E' : '#FFEB3B'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? '#4E342E' : '#FFFFFF',
                  minWidth: 40
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          © 2026 Leo Supermercado
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: '#2A323E',
            color: '#FFEB3B',
            '&:hover': {
              backgroundColor: '#1f2630'
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none'
            }
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none'
            }
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
