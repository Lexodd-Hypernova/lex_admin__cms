import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [alertInfo, setAlertInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertInfo(null);

    if (newPassword && newPassword !== confirmPassword) {
      setAlertInfo({ type: 'error', message: 'New passwords do not match!' });
      return;
    }

    setLoading(true);
    try {
      const payload = { name, email };
      if (newPassword) {
        payload.newPassword = newPassword;
      }
      if (newPassword || email !== user.email) {
        payload.currentPassword = currentPassword;
      }

      await updateProfile(payload);
      setAlertInfo({ type: 'success', message: 'Profile settings updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setAlertInfo({ type: 'error', message: err.message || 'Profile update failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>
          Admin Profile Settings
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Change name, email address, and update security credentials.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontFamily: '"Outfit", sans-serif' }}>
                Account Information
              </Typography>

              {alertInfo && (
                <Alert severity={alertInfo.type} sx={{ mb: 3, borderRadius: '8px' }}>
                  {alertInfo.message}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Admin User Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email Address"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ my: 1 }}><Divider sx={{ borderColor: '#1e293b' }} /></Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f59e0b', mb: 2 }}>
                      🔒 Credentials Update (Leave empty if keeping current password)
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="New Password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      fullWidth
                    />
                  </Grid>

                  {(newPassword || email !== user?.email) && (
                    <Grid item xs={12}>
                      <TextField
                        label="Current Password (Required to apply credentials/email changes)"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={loading}
                        fullWidth
                      />
                    </Grid>
                  )}
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    startIcon={<SaveIcon />}
                    size="large"
                    disabled={loading}
                  >
                    Save Profile Settings
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: '"Outfit", sans-serif' }}>
                Account Security Notice
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                - You are logged in as a <strong>System Administrator</strong>.
                <br />
                <br />
                - Keep credentials secure. Avoid sharing admin credentials.
                <br />
                <br />
                - If you change your email address, you must login next time using the newly updated email.
                <br />
                <br />
                - Password requirements: Highly recommend combining capital letters, numbers, and special symbols (min. 8 characters).
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileSettings;
