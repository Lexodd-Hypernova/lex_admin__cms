import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top left, #0e172a 0%, #030712 100%)',
        position: 'relative',
        overflow: 'hidden',
        px: 2
      }}
    >
      {/* Decorative Glows */}
      <Box sx={{ position: 'absolute', top: '15%', left: '15%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', filter: 'blur(80px)' }} />
      <Box sx={{ position: 'absolute', bottom: '15%', right: '15%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', filter: 'blur(100px)' }} />

      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          background: 'rgba(15, 20, 36, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          borderRadius: 4
        }}
      >
        <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                mb: 2.5
              }}
            >
              <LockOpenIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                color: '#fff',
                textAlign: 'center',
                letterSpacing: '0.5px',
                mb: 1
              }}
            >
              Lex Admin Login
            </Typography>
            
            <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', fontWeight: 500 }}>
              Enter your credentials to manage the CMS
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)', bgcolor: 'rgba(244, 63, 94, 0.05)' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Admin Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lexodd.com"
                disabled={loading}
                InputProps={{
                  sx: { color: '#f8fafc' }
                }}
                InputLabelProps={{
                  sx: { color: '#64748b' }
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                InputProps={{
                  sx: { color: '#f8fafc' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#64748b' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{
                  sx: { color: '#64748b' }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1.5,
                  py: 1.6,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Access Dashboard'}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
              Lexodd Digital. All Rights Reserved.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
