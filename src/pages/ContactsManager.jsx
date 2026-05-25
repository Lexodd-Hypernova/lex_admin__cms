import React, { useEffect, useState } from 'react';
import { useCMS } from '../context/CMSContext.jsx';
import {
  Typography,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Grid
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmModal from '../components/ConfirmModal.jsx';

const ContactsManager = () => {
  const { contacts, fetchContacts, deleteContact, loading } = useCMS();
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleOpenDetails = (contact) => {
    setSelectedContact(contact);
    setDetailsOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteContact(deleteId);
      setDeleteOpen(false);
    } catch (err) {
      alert('Failed to delete contact inquiry.');
    }
  };

  if (loading.contacts && contacts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>
          Contact Form Inquiries
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          View submitted inquiries and delete records that no longer need to be kept.
        </Typography>
      </Box>

      <Card>
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Submitted On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{contact.name}</TableCell>
                  <TableCell>{contact.company || '-'}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone || '-'}</TableCell>
                  <TableCell>{contact.industry || '-'}</TableCell>
                  <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton color="primary" onClick={() => handleOpenDetails(contact)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setDeleteId(contact._id);
                          setDeleteOpen(true);
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {contacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#475569' }}>
                    No contact inquiries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {selectedContact && (
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            style: { backgroundColor: '#0f1424', border: '1px solid #1e293b', borderRadius: '16px' }
          }}
        >
          <DialogTitle sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700 }}>
            Inquiry from {selectedContact.name}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}><Typography variant="body2"><strong>Email:</strong> {selectedContact.email}</Typography></Grid>
              <Grid item xs={12}><Typography variant="body2"><strong>Phone:</strong> {selectedContact.phone || '-'}</Typography></Grid>
              <Grid item xs={12}><Typography variant="body2"><strong>Company:</strong> {selectedContact.company || '-'}</Typography></Grid>
              <Grid item xs={12}><Typography variant="body2"><strong>Industry:</strong> {selectedContact.industry || '-'}</Typography></Grid>
              <Grid item xs={12}><Typography variant="body2"><strong>Employees:</strong> {selectedContact.employees || '-'}</Typography></Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  Message
                </Typography>
                <Paper sx={{ p: 2, bgcolor: '#070a13', border: '1px solid #1e293b' }}>
                  <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                    {selectedContact.message || 'No message provided.'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDetailsOpen(false)} sx={{ color: '#94a3b8' }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <ConfirmModal
        open={deleteOpen}
        title="Delete Contact Inquiry?"
        description="Are you sure you want to delete this contact submission? This action cannot be reverted."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default ContactsManager;
