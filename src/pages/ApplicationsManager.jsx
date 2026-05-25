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
  Grid,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import LinkIcon from '@mui/icons-material/Link';
import ConfirmModal from '../components/ConfirmModal.jsx';
import api from '../utils/api.js';

const ApplicationsManager = () => {
  const {
    applications,
    fetchApplications,
    updateApplicationStatus,
    deleteApplication,
    loading
  } = useCMS();

  const [selectedApp, setSelectedApp] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenDetails = (app) => {
    setSelectedApp(app);
    setStatus(app.status);
    setNotes(app.notes || '');
    setDetailsOpen(true);

    // If it was pending, update to reviewing
    if (app.status === 'pending') {
      updateApplicationStatus(app._id, 'reviewing', app.notes);
    }
  };

  const handleSaveDetails = async () => {
    try {
      await updateApplicationStatus(selectedApp._id, status, notes);
      setDetailsOpen(false);
      fetchApplications(); // Refresh list
    } catch (err) {
      alert('Error updating application status');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteApplication(deleteId);
      setDeleteOpen(false);
    } catch (err) {
      alert('Failed to delete application.');
    }
  };

  const handleDownloadCV = async (applicationId, filename) => {
    try {
      const response = await api.get(`/api/cms/applications/${applicationId}/download-cv`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download CV.');
    }
  };

  const filteredApps = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  if (loading.applications && applications.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>
            Job Applications
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Review candidate details, download CVs, write notes, and track application statuses.
          </Typography>
        </Box>
        
        {/* Status Filter */}
        <TextField
          select
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 180 }}
          size="small"
        >
          <MenuItem value="all">All Applications</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="reviewing">Reviewing</MenuItem>
          <MenuItem value="shortlisted">Shortlisted</MenuItem>
          <MenuItem value="interview">Interviewing</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
          <MenuItem value="hired">Hired</MenuItem>
        </TextField>
      </Box>

      <Card>
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Applicant</TableCell>
                <TableCell>Applied Position</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Submitted On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>CV</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApps.map((app) => (
                <TableRow key={app._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {app.firstName} {app.lastName}
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      {app.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {app.jobId ? app.jobId.title : 'Deleted Position'}
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      {app.jobId ? app.jobId.dept : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{app.yearsExperience || '-'}</TableCell>
                  <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={app.status.toUpperCase()}
                      size="small"
                      color={
                        app.status === 'pending' ? 'warning' :
                        app.status === 'hired' ? 'success' :
                        app.status === 'rejected' ? 'error' : 'info'
                      }
                      sx={{ fontWeight: 'bold', fontSize: 11 }}
                    />
                  </TableCell>
                  <TableCell>
                    {app.cvUrl ? (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadCV(app._id, app.cvFilename)}
                      >
                        Download
                      </Button>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton color="primary" onClick={() => handleOpenDetails(app)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(app._id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredApps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#475569' }}>
                    No job applications found matching filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Application Details Dialog */}
      {selectedApp && (
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
            Application: {selectedApp.firstName} {selectedApp.lastName}
          </DialogTitle>
          
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              {/* Left Column - Applicant Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  APPLICANT PROFILE
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                  <Typography variant="body2"><strong>Email:</strong> {selectedApp.email}</Typography>
                  <Typography variant="body2"><strong>Phone:</strong> {selectedApp.phone || '-'}</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {selectedApp.currentLocation || '-'}</Typography>
                  <Typography variant="body2"><strong>Experience:</strong> {selectedApp.yearsExperience || '-'}</Typography>
                  <Typography variant="body2"><strong>Notice Period:</strong> {selectedApp.noticePeriod || '-'}</Typography>
                  <Typography variant="body2"><strong>Source:</strong> {selectedApp.source || '-'}</Typography>
                  <Typography variant="body2">
                    <strong>Consent Provided:</strong> {selectedApp.consentGiven ? '✅ Yes' : '❌ No'}
                  </Typography>
                </Box>

                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  RESUME / CV
                </Typography>
                {selectedApp.cvUrl ? (
                  <Box sx={{ mb: 3 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownloadCV(selectedApp._id, selectedApp.cvFilename)}
                    >
                      Download Resume ({selectedApp.cvFilename || 'Resume.pdf'})
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" color="error" sx={{ mb: 3 }}>No CV file was uploaded.</Typography>
                )}

                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  LINKS
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  {selectedApp.linkedinUrl && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<LinkIcon />}
                      onClick={() => window.open(selectedApp.linkedinUrl, '_blank')}
                    >
                      LinkedIn
                    </Button>
                  )}
                  {selectedApp.portfolioUrl && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<LinkIcon />}
                      onClick={() => window.open(selectedApp.portfolioUrl, '_blank')}
                    >
                      Portfolio
                    </Button>
                  )}
                  {!selectedApp.linkedinUrl && !selectedApp.portfolioUrl && (
                    <Typography variant="body2" sx={{ color: '#475569' }}>No external links provided.</Typography>
                  )}
                </Box>

                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  COVER NOTE
                </Typography>
                <Paper sx={{ p: 2.5, bgcolor: '#070a13', border: '1px solid #1e293b' }}>
                  <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                    {selectedApp.coverNote || 'No cover note provided by candidate.'}
                  </Typography>
                </Paper>
              </Grid>

              {/* Right Column - Status and Internal Notes */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  ADMIN REVIEW PANEL
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    select
                    label="Application Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="pending">Pending Review</MenuItem>
                    <MenuItem value="reviewing">Reviewing</MenuItem>
                    <MenuItem value="shortlisted">Shortlisted</MenuItem>
                    <MenuItem value="interview">Interviewing</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                    <MenuItem value="hired">Hired</MenuItem>
                  </TextField>

                  <TextField
                    label="Internal HR Notes"
                    multiline
                    rows={8}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Type candidate evaluations, interview feedback, rating..."
                    fullWidth
                  />

                  {selectedApp.reviewedAt && (
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Last reviewed on: {new Date(selectedApp.reviewedAt).toLocaleString()}
                    </Typography>
                  )}
                  
                  <Button variant="contained" color="primary" onClick={handleSaveDetails} fullWidth size="large">
                    Save Review Changes
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
        title="Delete Job Application?"
        description="Are you sure you want to permanently delete this application? Candidate information and history will be cleared."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default ApplicationsManager;
