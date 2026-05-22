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
  Button,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Grid,
  CircularProgress,
  Chip,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ConfirmModal from '../components/ConfirmModal.jsx';

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
  isVisible: true,
  isFeatured: false,
  orderIndex: 0
};

const JobsManager = () => {
  const { jobs, fetchJobs, saveJob, deleteJob, toggleJobVisibility, loading } = useCMS();

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
      tags: job.tags ? job.tags.join(', ') : '',
      desc: job.desc || '',
      resp: job.resp ? job.resp.join('\n') : '',
      req: job.req ? job.req.join('\n') : '',
      nice: job.nice ? job.nice.join('\n') : '',
      isVisible: job.isVisible,
      isFeatured: job.isFeatured || false,
      orderIndex: job.orderIndex || 0
    });
    setOpenForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Parse array inputs
    const formattedData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => !!t) : [],
      resp: formData.resp ? formData.resp.split('\n').map(r => r.trim()).filter(r => !!r) : [],
      req: formData.req ? formData.req.split('\n').map(r => r.trim()).filter(r => !!r) : [],
      nice: formData.nice ? formData.nice.split('\n').map(r => r.trim()).filter(r => !!r) : []
    };

    if (editingId) {
      formattedData._id = editingId;
    }

    try {
      await saveJob(formattedData);
      setOpenForm(false);
    } catch (err) {
      alert('Error saving job details');
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
    } catch (err) {
      alert('Error deleting job posting.');
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleJobVisibility(id);
    } catch (err) {
      alert('Failed to update job visibility status.');
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
            Careers & Jobs Listings
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Manage active job positions, descriptions, requirements, and views.
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
                <TableCell>Views / Apps</TableCell>
                <TableCell align="center">Featured</TableCell>
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
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      👁️ {job.viewCount} / 📥 {job.applicationCount}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={job.isFeatured ? 'YES' : 'NO'}
                      size="small"
                      color={job.isFeatured ? 'secondary' : 'default'}
                      sx={{ fontWeight: 'bold', fontSize: 10 }}
                    />
                  </TableCell>
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
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#475569' }}>
                    No job postings found. Click 'Create Job Posting' to add your first job.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Form Dialog */}
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
              <Grid item xs={12} sm={8}>
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
                  label="Sorting Order Index"
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Department"
                  value={formData.dept}
                  onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  fullWidth
                >
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Product">Product</MenuItem>
                  <MenuItem value="Infrastructure">Infrastructure</MenuItem>
                  <MenuItem value="Sales & Marketing">Sales & Marketing</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Location"
                  placeholder="e.g. Remote (US) / New York, NY"
                  value={formData.loc}
                  onChange={(e) => setFormData({ ...formData, loc: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Employment Type"
                  placeholder="e.g. Full-time, Contract, Part-time"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Experience Level Required"
                  placeholder="e.g. 5+ years / Senior level"
                  value={formData.exp}
                  onChange={(e) => setFormData({ ...formData, exp: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Skills Tags (Comma-separated)"
                  placeholder="React, Node.js, AWS, Redis"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Short Job Description"
                  multiline
                  rows={3}
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Responsibilities (One per line)"
                  multiline
                  rows={6}
                  placeholder="Design responsive systems&#10;Write unit tests&#10;Optimize SQL transactions"
                  value={formData.resp}
                  onChange={(e) => setFormData({ ...formData, resp: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Requirements (One per line)"
                  multiline
                  rows={6}
                  placeholder="5+ years in full stack web dev&#10;Proficiency in MongoDB&#10;Strong communication skills"
                  value={formData.req}
                  onChange={(e) => setFormData({ ...formData, req: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Nice to Have (One per line)"
                  multiline
                  rows={6}
                  placeholder="Experience with Docker/CI-CD&#10;AWS certified architect certificate"
                  value={formData.nice}
                  onChange={(e) => setFormData({ ...formData, nice: e.target.value })}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      color="secondary"
                    />
                  }
                  label="Featured Listing"
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteOpen}
        title="Delete Job Posting?"
        description="Are you sure you want to delete this job listing? Deleting it will automatically delete all applications associated with this job."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default JobsManager;
