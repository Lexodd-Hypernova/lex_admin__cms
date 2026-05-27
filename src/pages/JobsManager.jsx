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
  Button,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Grid,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ConfirmModal from '../components/ConfirmModal.jsx';
import FeedbackSnackbar from '../components/FeedbackSnackbar.jsx';
import getErrorMessage from '../utils/errorMessage.js';
import { todayInputValue, toDateInputValue } from '../utils/dateFormat.js';

const initialFormState = {
  title: '',
  dept: 'Engineering',
  loc: '',
  type: 'Full-time',
  exp: '',
  tags: '',
  desc: '',
  resp: '',
  req: '',
  nice: '',
  postedDate: todayInputValue(),
  isVisible: true
};

const JobsManager = () => {
  const { jobs, fetchJobs, saveJob, deleteJob, toggleJobVisibility, loading } = useCMS();

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [feedback, setFeedback] = useState({ open: false, severity: 'success', message: '' });
  const showFeedback = (severity, message) => setFeedback({ open: true, severity, message });
  const closeFeedback = () => setFeedback((current) => ({ ...current, open: false }));

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (job) => {
    setEditingId(job._id);
    setFormData({
      title: job.title || '',
      dept: job.dept || '',
      loc: job.loc || '',
      type: job.type || '',
      exp: job.exp || '',
      tags: '',
      desc: job.desc || '',
      resp: job.resp ? job.resp.join('\n') : '',
      req: job.req ? job.req.join('\n') : '',
      nice: '',
      postedDate: toDateInputValue(job.postedDate) || todayInputValue(),
      isVisible: job.isVisible
    });
    setOpenForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const missing = [
      !formData.title.trim() && 'Job Title is required',
      !formData.dept.trim() && 'Department is required',
      !formData.loc.trim() && 'Location is required',
      !formData.type.trim() && 'Employment Type is required',
      !formData.postedDate && 'Posted Date is required',
      !formData.desc.trim() && 'Job Description is required',
      !formData.resp.trim() && 'At least one responsibility is required',
      !formData.req.trim() && 'At least one requirement is required'
    ].filter(Boolean);
    if (missing.length) {
      showFeedback('warning', `Complete these fields before publishing:\n\n${missing.join('\n')}`);
      return;
    }

    const formattedData = {
      ...formData,
      tags: [],
      nice: [],
      postedDate: toDateInputValue(formData.postedDate),
      resp: formData.resp ? formData.resp.split('\n').map((r) => r.trim()).filter(Boolean) : [],
      req: formData.req ? formData.req.split('\n').map((r) => r.trim()).filter(Boolean) : []
    };

    if (editingId) {
      formattedData._id = editingId;
    }

    try {
      await saveJob(formattedData);
      setOpenForm(false);
      showFeedback('success', editingId ? 'Job posting updated successfully.' : 'Job posting published successfully.');
    } catch (err) {
      showFeedback('error', getErrorMessage(err, 'Error saving job details'));
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteJob(deleteId);
      setDeleteOpen(false);
      showFeedback('success', 'Job posting deleted successfully.');
    } catch (err) {
      showFeedback('error', getErrorMessage(err, 'Error deleting job posting.'));
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleJobVisibility(id);
      showFeedback('success', 'Job visibility updated successfully.');
    } catch (err) {
      showFeedback('error', getErrorMessage(err, 'Failed to update job visibility status.'));
    }
  };

  if (loading.jobs && jobs.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>
            Job Postings
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Manage simple career-page postings and visibility.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Create Job Posting
        </Button>
      </Box>

      <Card>
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="center">Visible</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{job.title}</TableCell>
                  <TableCell>{job.dept}</TableCell>
                  <TableCell>{job.loc}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={job.isVisible}
                      onChange={() => handleToggleVisibility(job._id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton color="primary" onClick={() => handleOpenEdit(job)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(job._id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#475569' }}>
                    No job postings found. Click 'Create Job Posting' to add your first job.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: { backgroundColor: '#0f1424', border: '1px solid #1e293b', borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700 }}>
          {editingId ? 'Edit Job Posting' : 'Create New Job Posting'}
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent dividers sx={{ borderColor: '#1e293b' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Job Title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Department"
                  value={formData.dept}
                  onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Location"
                  placeholder="e.g. Hyderabad / Remote"
                  value={formData.loc}
                  onChange={(e) => setFormData({ ...formData, loc: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Employment Type"
                  placeholder="e.g. Full-time"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Posted Date"
                  type="date"
                  value={formData.postedDate}
                  onChange={(e) => setFormData({ ...formData, postedDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Job Description"
                  multiline
                  rows={3}
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Responsibilities (One per line)"
                  multiline
                  rows={6}
                  placeholder="Design responsive systems\nWrite unit tests\nOptimize SQL transactions"
                  value={formData.resp}
                  onChange={(e) => setFormData({ ...formData, resp: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Requirements (One per line)"
                  multiline
                  rows={6}
                  placeholder="5+ years in full stack web dev\nProficiency in MongoDB\nStrong communication skills"
                  value={formData.req}
                  onChange={(e) => setFormData({ ...formData, req: e.target.value })}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isVisible}
                      onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Visible to Public"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenForm(false)} sx={{ color: '#94a3b8' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editingId ? 'Update Posting' : 'Publish Job'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmModal
        open={deleteOpen}
        title="Delete Job Posting?"
        description="Are you sure you want to delete this job listing? Deleting it will automatically delete all applications associated with this job."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
      <FeedbackSnackbar feedback={feedback} onClose={closeFeedback} />
    </Box>
  );
};

export default JobsManager;
