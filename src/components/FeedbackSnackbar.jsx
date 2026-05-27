import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const FeedbackSnackbar = ({ feedback, onClose }) => (
  <Snackbar
    open={feedback.open}
    autoHideDuration={4500}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert
      onClose={onClose}
      severity={feedback.severity || 'info'}
      sx={{
        width: '100%',
        whiteSpace: 'pre-line',
        backgroundColor: '#141418',
        border: '1px solid #27272F',
        color: '#FFFFFF',
        '& .MuiAlert-icon': {
          color: '#D1D1D6',
        },
        '& .MuiAlert-action': {
          color: '#D1D1D6',
        },
      }}
    >
      {feedback.message}
    </Alert>
  </Snackbar>
);

export default FeedbackSnackbar;
