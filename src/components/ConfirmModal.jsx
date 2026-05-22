import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ConfirmModal = ({ open, title, description, cascadeWarning, onConfirm, onCancel, confirmText = "Delete" }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        style: {
          backgroundColor: '#0f1424',
          border: '1px solid #e11d48', // Red border for deletion confirmation
          borderRadius: '16px',
          padding: '8px'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <WarningAmberIcon color="error" sx={{ fontSize: 32 }} />
        <Typography variant="h5" component="span" fontWeight="bold">
          {title || "Are you absolutely sure?"}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText sx={{ color: '#cbd5e1', mb: 2 }}>
          {description || "This action cannot be undone. Please confirm if you wish to proceed."}
        </DialogContentText>
        
        {cascadeWarning && (
          <Box
            sx={{
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              borderLeft: '4px solid #ef4444',
              p: 2,
              borderRadius: '4px',
              mt: 1
            }}
          >
            <Typography variant="subtitle2" color="error.main" fontWeight="bold" gutterBottom>
              ⚠️ CRITICAL CASCADE DELETE WARNING:
            </Typography>
            <Typography variant="body2" sx={{ color: '#fda4af' }}>
              {cascadeWarning}
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderColor: '#334155',
            color: '#94a3b8',
            '&:hover': {
              borderColor: '#475569',
              backgroundColor: 'rgba(71, 85, 105, 0.1)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            backgroundColor: '#f43f5e',
            '&:hover': {
              backgroundColor: '#e11d48'
            }
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
