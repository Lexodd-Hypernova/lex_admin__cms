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
  Tabs,
  Tab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ConfirmModal from '../components/ConfirmModal.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import SEOFields from '../components/SEOFields.jsx';

const initialFormState = {
  id: '',
  slug: '',
  topic: '',
  date: '',
  readTime: '',
  title: '',
  excerpt: '',
  coverImage: '',
  filters: '',
  breadcrumbParent: 'Whitepapers',
  breadcrumbCurrent: '',
  heroTitle: '',
  heroDescription: '',
  downloadTitle: '',
  downloadDescription: '',
  downloadButtonText: '',
  downloadPdfUrl: '',
  frameworkDiagram: '',
  abstract: '',
  pullQuote: '',
  contentProblem: '',
  contentFramework: '',
  sidebarAuthor: '',
  sidebarPages: '',
  sidebarPublished: '',
  sidebarLicense: '',
  isVisible: true,
  seo: {
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: {},
    canonicalUrl: '',
    robots: 'index,follow'
  }
};

const WhitePapersManager = () => {
  const { whitePapers, fetchWhitePapers, saveWhitePaper, deleteWhitePaper, toggleWhitePaperVisibility, loading } = useCMS();

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchWhitePapers();
  }, []);

  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setActiveTab(0);
    setOpenForm(true);
  };

  const handleOpenEdit = (wp) => {
    setEditingId(wp._id);
    setFormData({
      id: wp.id || '',
      slug: wp.slug || '',
      topic: wp.topic || '',
      date: wp.date || '',
      readTime: wp.readTime || '',
      title: wp.title || '',
      excerpt: wp.excerpt || '',
      coverImage: wp.coverImage || '',
      filters: wp.filters ? wp.filters.join(', ') : '',
      breadcrumbParent: wp.breadcrumb?.parent || 'Whitepapers',
      breadcrumbCurrent: wp.breadcrumb?.current || '',
      heroTitle: wp.hero?.title || '',
      heroDescription: wp.hero?.description || '',
      downloadTitle: wp.download?.title || '',
      downloadDescription: wp.download?.description || '',
      downloadButtonText: wp.download?.buttonText || '',
      downloadPdfUrl: wp.download?.pdfUrl || '',
      frameworkDiagram: wp.images?.frameworkDiagram || '',
      abstract: wp.abstract || '',
      pullQuote: wp.pullQuote || '',
      contentProblem: wp.content?.problem || '',
      contentFramework: wp.content?.framework || '',
      sidebarAuthor: wp.sidebar?.author || '',
      sidebarPages: wp.sidebar?.pages || '',
      sidebarPublished: wp.sidebar?.published || '',
      sidebarLicense: wp.sidebar?.license || '',
      isVisible: wp.isVisible,
      seo: wp.seo || initialFormState.seo
    });
    setActiveTab(0);
    setOpenForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.id.trim() || !formData.slug.trim()) return;

    const payload = {
      id: formData.id.trim(),
      slug: formData.slug.trim(),
      topic: formData.topic.trim(),
      date: formData.date.trim(),
      readTime: formData.readTime.trim(),
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim(),
      coverImage: formData.coverImage.trim(),
      filters: formData.filters ? formData.filters.split(',').map(f => f.trim()).filter(f => !!f) : [],
      breadcrumb: {
        parent: formData.breadcrumbParent.trim(),
        current: formData.breadcrumbCurrent.trim()
      },
      hero: {
        title: formData.heroTitle.trim() || formData.title.trim(),
        description: formData.heroDescription.trim() || formData.excerpt.trim()
      },
      download: {
        title: formData.downloadTitle.trim(),
        description: formData.downloadDescription.trim(),
        buttonText: formData.downloadButtonText.trim(),
        pdfUrl: formData.downloadPdfUrl.trim()
      },
      images: {
        frameworkDiagram: formData.frameworkDiagram.trim()
      },
      abstract: formData.abstract.trim(),
      pullQuote: formData.pullQuote.trim(),
      content: {
        problem: formData.contentProblem.trim(),
        framework: formData.contentFramework.trim()
      },
      sidebar: {
        author: formData.sidebarAuthor.trim(),
        pages: formData.sidebarPages.trim(),
        published: formData.sidebarPublished.trim() || formData.date.trim(),
        license: formData.sidebarLicense.trim()
      },
      isVisible: formData.isVisible,
      seo: formData.seo
    };

    if (editingId) {
      payload._id = editingId;
    }

    try {
      await saveWhitePaper(payload);
      setOpenForm(false);
    } catch (err) {
      alert('Error saving white paper');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteWhitePaper(deleteId);
      setDeleteOpen(false);
    } catch (err) {
      alert('Error deleting white paper.');
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleWhitePaperVisibility(id);
    } catch (err) {
      alert('Failed to toggle visibility status.');
    }
  };

  if (loading.whitePapers && whitePapers.length === 0) {
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
            White Papers & Reports
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Manage scientific reports, blueprints, PDF downloads, and abstracts.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Create White Paper
        </Button>
      </Box>

      <Card>
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Topic / Sector</TableCell>
                <TableCell>Read Time</TableCell>
                <TableCell>Downloads / Views</TableCell>
                <TableCell align="center">Visible</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {whitePapers.map((wp) => (
                <TableRow key={wp._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{wp.title}</TableCell>
                  <TableCell>{wp.topic}</TableCell>
                  <TableCell>{wp.readTime}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      📥 {wp.downloadCount || 0} / 👁️ {wp.viewCount || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={wp.isVisible}
                      onChange={() => handleToggleVisibility(wp._id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton color="primary" onClick={() => handleOpenEdit(wp)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(wp._id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {whitePapers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#475569' }}>
                    No white papers found. Click 'Create White Paper' to publish your first technical blueprint!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Forms Modal with custom Tabs */}
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
          {editingId ? 'Edit White Paper Details' : 'Publish White Paper'}
        </DialogTitle>

        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ px: 3, borderBottom: '1px solid #1e293b' }}>
          <Tab label="1. Basics" />
          <Tab label="2. Layout Media" />
          <Tab label="3. Abstract & Body" />
          <Tab label="4. Download & Metadata" />
          <Tab label="5. SEO" />
        </Tabs>

        <form onSubmit={handleSave}>
          <DialogContent sx={{ minHeight: '400px' }}>
            
            {/* TAB 1: BASICS */}
            {activeTab === 0 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Unique String ID"
                    required
                    placeholder="e.g. high-scale-databases"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="URL Slug"
                    required
                    placeholder="e.g. database-scaling-blueprint"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="White Paper Title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Topic Category"
                    placeholder="e.g. Database Engineering"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Read Time Description"
                    placeholder="e.g. 15 Min Read"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Publish Date"
                    placeholder="e.g. Jan 2026 / October 2025"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Filters Tags (Comma-separated)"
                    placeholder="Security, System Design, Databases"
                    value={formData.filters}
                    onChange={(e) => setFormData({ ...formData, filters: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Paper Abstract Excerpt"
                    multiline
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
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
            )}

            {/* TAB 2: LAYOUT MEDIA */}
            {activeTab === 1 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                  <ImageUploader
                    label="Cover Image"
                    value={formData.coverImage}
                    onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ImageUploader
                    label="Framework Architecture Diagram"
                    value={formData.frameworkDiagram}
                    onChange={(url) => setFormData({ ...formData, frameworkDiagram: url })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Breadcrumb Parent Text"
                    value={formData.breadcrumbParent}
                    onChange={(e) => setFormData({ ...formData, breadcrumbParent: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Breadcrumb Current Text"
                    value={formData.breadcrumbCurrent}
                    onChange={(e) => setFormData({ ...formData, breadcrumbCurrent: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}

            {/* TAB 3: ABSTRACT & BODY */}
            {activeTab === 2 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hero Overlay Title"
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hero Overlay Description"
                    value={formData.heroDescription}
                    onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Full Abstract Text"
                    multiline
                    rows={4}
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Pull Quote / Highlight Sentence"
                    multiline
                    rows={2}
                    value={formData.pullQuote}
                    onChange={(e) => setFormData({ ...formData, pullQuote: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Core Problem Description"
                    multiline
                    rows={3}
                    value={formData.contentProblem}
                    onChange={(e) => setFormData({ ...formData, contentProblem: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Proposed Solution / Framework"
                    multiline
                    rows={4}
                    value={formData.contentFramework}
                    onChange={(e) => setFormData({ ...formData, contentFramework: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}

            {/* TAB 4: DOWNLOAD & METADATA */}
            {activeTab === 3 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Download Card Title"
                    placeholder="Download Technical Report"
                    value={formData.downloadTitle}
                    onChange={(e) => setFormData({ ...formData, downloadTitle: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Download Card Button Text"
                    placeholder="Download PDF"
                    value={formData.downloadButtonText}
                    onChange={(e) => setFormData({ ...formData, downloadButtonText: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Download Card Description"
                    value={formData.downloadDescription}
                    onChange={(e) => setFormData({ ...formData, downloadDescription: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <ImageUploader
                    label="Upload PDF Asset"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    field="cv"
                    maxSize={10 * 1024 * 1024}
                    value={formData.downloadPdfUrl}
                    onChange={(url) => setFormData({ ...formData, downloadPdfUrl: url })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Author Name & Title"
                    placeholder="e.g. Alex Mercer, Chief Architect"
                    value={formData.sidebarAuthor}
                    onChange={(e) => setFormData({ ...formData, sidebarAuthor: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Sidebar Pages Count"
                    placeholder="e.g. 42 Pages"
                    value={formData.sidebarPages}
                    onChange={(e) => setFormData({ ...formData, sidebarPages: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Publish Date Info"
                    placeholder="e.g. January 2026"
                    value={formData.sidebarPublished}
                    onChange={(e) => setFormData({ ...formData, sidebarPublished: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Publish License Standard"
                    placeholder="e.g. CC BY-ND 4.0 / Proprietary"
                    value={formData.sidebarLicense}
                    onChange={(e) => setFormData({ ...formData, sidebarLicense: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 4 && (
              <SEOFields
                value={formData.seo}
                onChange={(seo) => setFormData({ ...formData, seo })}
              />
            )}

          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenForm(false)} sx={{ color: '#94a3b8' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editingId ? 'Save Changes' : 'Publish Report'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteOpen}
        title="Delete White Paper Blueprint?"
        description="Are you sure you want to permanently delete this scientific report? Document entries and PDF files will be cleared."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default WhitePapersManager;
