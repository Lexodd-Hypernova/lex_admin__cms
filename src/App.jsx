import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import theme from './theme.js';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CMSProvider } from './context/CMSContext.jsx';
import Layout from './components/Layout.jsx';

import Login from './pages/Login.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
import CareerPageManager from './pages/CareerPageManager.jsx';
import JobsManager from './pages/JobsManager.jsx';
import ApplicationsManager from './pages/ApplicationsManager.jsx';
import ContactsManager from './pages/ContactsManager.jsx';
import CaseStudiesManager from './pages/CaseStudiesManager.jsx';
import WhitePapersManager from './pages/WhitePapersManager.jsx';
import IndustriesManager from './pages/IndustriesManager.jsx';
import TechStackManager from './pages/TechStackManager.jsx';
import ProfileSettings from './pages/ProfileSettings.jsx';
import PageSEOManager from './pages/PageSEOManager.jsx';
import HowWeWorkManager from './pages/HowWeWorkManager.jsx';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          bgcolor: '#070a13' 
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CMSProvider>
          <BrowserRouter>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />

              {/* Protected dashboard routes wrapped in Layout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<DashboardHome />} />
                  <Route path="/career" element={<CareerPageManager />} />
                  <Route path="/how-we-work" element={<HowWeWorkManager />} />
                  <Route path="/jobs" element={<JobsManager />} />
                  <Route path="/applications" element={<ApplicationsManager />} />
                  <Route path="/contacts" element={<ContactsManager />} />
                  <Route path="/case-studies" element={<CaseStudiesManager />} />
                  <Route path="/white-papers" element={<WhitePapersManager />} />
                  <Route path="/industries" element={<IndustriesManager />} />
                  <Route path="/tech-stack" element={<TechStackManager />} />
                  <Route path="/page-seo" element={<PageSEOManager />} />
                  <Route path="/profile" element={<ProfileSettings />} />
                </Route>
              </Route>

              {/* Catch-all fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CMSProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
