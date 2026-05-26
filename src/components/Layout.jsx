import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import MailIcon from '@mui/icons-material/Mail';
import LayersIcon from '@mui/icons-material/Layers';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BusinessIcon from '@mui/icons-material/Business';
import TerminalIcon from '@mui/icons-material/Terminal';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const drawerWidth = 260;

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard Home', icon: <DashboardIcon />, path: '/' },
    { text: 'Career Page', icon: <SchoolIcon />, path: '/career' },
    { text: 'How We Work Page', icon: <TravelExploreIcon />, path: '/how-we-work' },
    { text: 'Jobs Listings', icon: <WorkIcon />, path: '/jobs' },
    { text: 'Job Applications', icon: <DescriptionIcon />, path: '/applications' },
    { text: 'Contact Requests', icon: <MailIcon />, path: '/contacts' },
    { text: 'Case Studies', icon: <LayersIcon />, path: '/case-studies' },
    { text: 'White Papers', icon: <AutoStoriesIcon />, path: '/white-papers' },
    { text: 'Sectors / Industries', icon: <BusinessIcon />, path: '/industries' },
    { text: 'Tech Stack', icon: <TerminalIcon />, path: '/tech-stack' },
    { text: 'Static Page SEO', icon: <TravelExploreIcon />, path: '/page-seo' },
    { text: 'Profile Settings', icon: <SettingsIcon />, path: '/profile' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0b0f19', borderRight: '1px solid #1e293b' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <img src="images/lexodd.svg" alt="" width={50} height={50}/>
        {/* <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 'bold', fontSize: 22, width: 42, height: 42 }}>L</Avatar> */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '1px', fontFamily: '"Outfit", sans-serif' }}>
            LEXODD <span style={{ color: '#6366f1' }}></span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
            CMS
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: '#1e293b' }} />
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  color: isActive ? '#818cf8' : '#94a3b8',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    color: '#f8fafc',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#818cf8' : '#475569', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.95rem' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ p: 2, borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={user?.avatar} sx={{ width: 38, height: 38, border: '1px solid #6366f1' }} />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: '#f8fafc' }}>
            {user?.name || 'Lex Admin'}
          </Typography>
          <Typography variant="caption" noWrap sx={{ color: '#64748b', display: 'block' }}>
            {user?.email || 'admin@lexodd.com'}
          </Typography>
        </Box>
        <IconButton onClick={handleLogout} sx={{ color: '#f43f5e' }}>
          <LogoutIcon size="small" />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#070a13' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'rgba(7, 10, 19, 0.7)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1e293b',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#94a3b8' }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'CMS Administration'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => window.open('http://localhost:5000/api/health', '_blank')}
              sx={{
                borderColor: '#1e293b',
                color: '#10b981',
                fontWeight: 'bold',
                '&:hover': {
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.05)'
                }
              }}
            >
              System Online
            </Button>

            <IconButton onClick={handleMenu} sx={{ p: 0.5, border: '1px solid #1e293b' }}>
              <Avatar src={user?.avatar} sx={{ width: 32, height: 32 }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                style: {
                  backgroundColor: '#0f1424',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  width: '160px'
                }
              }}
            >
              <MenuItem onClick={() => { handleClose(); navigate('/profile'); }} sx={{ py: 1, gap: 1 }}>
                <AccountCircleIcon fontSize="small" /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ py: 1, gap: 1, color: '#f43f5e' }}>
                <LogoutIcon fontSize="small" /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          overflowX: 'hidden'
        }}
      >
        <Box className="fade-in">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
