import React, { useEffect, useState } from 'react';
import { useCMS } from '../context/CMSContext.jsx';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReplyIcon from '@mui/icons-material/Reply';
import ConfirmModal from '../components/ConfirmModal.jsx';

const ContactsManager = () => {
  const {
    contacts,
    fetchContacts,
    updateContactStatus,
    replyToContact,
    deleteContact,
    loading
  } = useCMS();

  const [selectedContact, setSelectedContact] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  
  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleOpenDetails = (contact) => {
    setSelectedContact(contact);
    setNotes(contact.notes || '');
    setStatus(contact.status);
    setReplyMessage('');
    setDetailsOpen(true);
    
    // Mark as Read if it was New
    if (contact.status === 'new') {
      updateContactStatus(contact._id, 'read', contact.notes);
    }
  };

  const handleSaveDetails = async () => {
    try {
      await updateContactStatus(selectedContact._id, status, notes);
      setDetailsOpen(false);
      fetchContacts(); // Reload contacts
    } catch (err) {
      alert('Error updating inquiry status');
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    try {
      await replyToContact(selectedContact._id, replyMessage);
      alert('Reply sent successfully!');
      setDetailsOpen(false);
      fetchContacts();
    } catch (err) {
      alert('Failed to send reply');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
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
          Manage partnerships, enterprise queries, and consultation requests.
        </Typography>
      </Box>

      <Card>
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Sector</TableCell>
                <TableCell>Submitted On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{contact.name}</TableCell>
                  <TableCell>{contact.company || '-'}</TableCell>
                  <TableCell>{contact.industry || '-'}</TableCell>
                  <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={contact.status.toUpperCase()}
                      size="small"
                      color={
                        contact.status === 'new' ? 'warning' :
                        contact.status === 'replied' ? 'success' :
                        contact.status === 'read' ? 'info' : 'default'
                      }
                      sx={{ fontWeight: 'bold', fontSize: 11 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton color="primary" onClick={() => handleOpenDetails(contact)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(contact._id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {contacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#475569' }}>
                    No contact messages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Details & Reply Dialog */}
      {selectedContact && (
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: { backgroundColor: '#0f1424', border: '1px solid #1e293b', borderRadius: '16px' }
          }}
        >
          <DialogTitle sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, pb: 1 }}>
            Inquiry from {selectedContact.name}
          </DialogTitle>
          
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              {/* Left Column - Form Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  SENDER PROFILE
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                  <Typography variant="body2"><strong>Email:</strong> {selectedContact.email}</Typography>
                  <Typography variant="body2"><strong>Phone:</strong> {selectedContact.phone || '-'}</Typography>
                  <Typography variant="body2"><strong>Company:</strong> {selectedContact.company || '-'}</Typography>
                  <Typography variant="body2"><strong>Industry/Sector:</strong> {selectedContact.industry || '-'}</Typography>
                  <Typography variant="body2"><strong>Employees count:</strong> {selectedContact.employees || '-'}</Typography>
                </Box>

                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  MESSAGE CONTENT
                </Typography>
                <Paper sx={{ p: 2, bgcolor: '#070a13', border: '1px solid #1e293b', mb: 3 }}>
                  <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                    {selectedContact.message || 'No message provided.'}
                  </Typography>
                </Paper>
                
                {selectedContact.repliedAt && (
                  <>
                    <Typography variant="subtitle2" color="secondary" gutterBottom fontWeight="bold">
                      YOUR PREVIOUS REPLY ({new Date(selectedContact.repliedAt).toLocaleDateString()})
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', mb: 3 }}>
                      <Typography variant="body2" style={{ whiteSpace: 'pre-line', color: '#34d399' }}>
                        {selectedContact.replyMessage}
                      </Typography>
                    </Paper>
                  </>
                )}
              </Grid>

              {/* Right Column - Status & Reply Panel */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  ADMIN ACTION & NOTES
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3 }}>
                  <TextField
                    select
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="new">New / Unread</MenuItem>
                    <MenuItem value="read">Read</MenuItem>
                    <MenuItem value="replied">Replied</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </TextField>

                  <TextField
                    label="Internal Review Notes"
                    multiline
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter review notes here..."
                    fullWidth
                  />
                  
                  <Button variant="contained" onClick={handleSaveDetails} color="primary" fullWidth>
                    Save Notes & Status
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  SEND EMAIL REPLY
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Email Body"
                    multiline
                    rows={4}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response to the sender here..."
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendReply}
                    color="secondary"
                    startIcon={<ReplyIcon />}
                    disabled={!replyMessage.trim()}
                    fullWidth
                  >
                    Send Reply
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDetailsOpen(false)} sx={{ color: '#94a3b8' }}>
              Close Window
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteOpen}
        title="Delete Contact Inquiry?"
        description="Are you sure you want to delete this contact submission from the dashboard? This action cannot be reverted."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default ContactsManager;
