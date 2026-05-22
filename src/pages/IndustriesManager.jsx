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
  Tab,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ConfirmModal from '../components/ConfirmModal.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import SEOFields from '../components/SEOFields.jsx';

const initialFormState = {
  slug: '',
  breadcrumbParent: 'Industries',
  breadcrumbCurrent: '',
  heroEyebrow: 'Our Sectors',
  heroTitle: '',
  heroLead: '',
  heroImage: '',
  focusTitle: 'Focus Areas',
  focusDescription: '',
  focusPillars: '', // text-format: "Title : Description" per line
  caseStudiesRaw: '', // text-format: "Title : Result : Date : ImageUrl" per line
  whitePapersRaw: '', // text-format: "Topic : Title : PaperID" per line
  ctaEyebrow: '',
  ctaTitle: '',
  ctaDescription: '',
  ctaButtonText: '',
  ctaSecondaryButtonText: '',
  isVisible: true,
  orderIndex: 0,
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

const IndustriesManager = () => {
  const { industries, fetchIndustries, saveIndustry, deleteIndustry, toggleIndustryVisibility, loading } = useCMS();

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSlug, setDeleteSlug] = useState('');

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setActiveTab(0);
    setOpenForm(true);
  };

  const handleOpenEdit = (ind) => {
    setEditingId(ind._id);

    // Format Focus pillars array back to text
    const pillarsText = ind.focus?.pillars
      ? ind.focus.pillars.map(p => `${p.title} : ${p.description}`).join('\n')
      : '';

    // Format CaseStudies association array back to text
    const csText = ind.caseStudies
      ? ind.caseStudies.map(cs => `${cs.title} : ${cs.result} : ${cs.date} : ${cs.image}`).join('\n')
      : '';

    // Format WhitePapers association array back to text
    const wpText = ind.whitePapers
      ? ind.whitePapers.map(wp => `${wp.topic} : ${wp.title} : ${wp.id}`).join('\n')
      : '';

    setFormData({
      slug: ind.slug || '',
      breadcrumbParent: ind.breadcrumb?.parent || 'Industries',
      breadcrumbCurrent: ind.breadcrumb?.current || '',
      heroEyebrow: ind.hero?.eyebrow || 'Our Sectors',
      heroTitle: ind.hero?.title || '',
      heroLead: ind.hero?.lead || '',
      heroImage: ind.hero?.heroImage || '',
      focusTitle: ind.focus?.title || 'Focus Areas',
      focusDescription: ind.focus?.description || '',
      focusPillars: pillarsText,
      caseStudiesRaw: csText,
      whitePapersRaw: wpText,
      ctaEyebrow: ind.cta?.eyebrow || '',
      ctaTitle: ind.cta?.title || '',
      ctaDescription: ind.cta?.description || '',
      ctaButtonText: ind.cta?.buttonText || '',
      ctaSecondaryButtonText: ind.cta?.secondaryButtonText || '',
      isVisible: ind.isVisible,
      orderIndex: ind.orderIndex || 0,
      seo: ind.seo || initialFormState.seo
    });
    setActiveTab(0);
    setOpenForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.slug.trim() || !formData.heroTitle.trim()) return;

    // Parse pillars: "Title : Description"
    const pillarsList = formData.focusPillars
      ? formData.focusPillars.split('\n').map(line => {
          const parts = line.split(':');
          return { title: parts[0]?.trim() || '', description: parts[1]?.trim() || '' };
        }).filter(p => !!p.title)
      : [];

    // Parse case studies: "Title : Result : Date : ImageUrl"
    const csList = formData.caseStudiesRaw
      ? formData.caseStudiesRaw.split('\n').map(line => {
          const parts = line.split(':');
          return {
            title: parts[0]?.trim() || '',
            result: parts[1]?.trim() || '',
            date: parts[2]?.trim() || '',
            image: parts[3]?.trim() || '',
            industryTag: formData.breadcrumbCurrent || ''
          };
        }).filter(cs => !!cs.title)
      : [];

    // Parse white papers: "Topic : Title : PaperID"
    const wpList = formData.whitePapersRaw
      ? formData.whitePapersRaw.split('\n').map(line => {
          const parts = line.split(':');
          return {
            topic: parts[0]?.trim() || '',
            title: parts[1]?.trim() || '',
            id: parts[2]?.trim() || ''
          };
        }).filter(wp => !!wp.title)
      : [];

    const payload = {
      slug: formData.slug.trim().toLowerCase(),
      breadcrumb: {
        parent: formData.breadcrumbParent.trim(),
        current: formData.breadcrumbCurrent.trim() || formData.heroTitle.trim()
      },
      hero: {
        eyebrow: formData.heroEyebrow.trim(),
        title: formData.heroTitle.trim(),
        lead: formData.heroLead.trim(),
        heroImage: formData.heroImage.trim()
      },
      focus: {
        title: formData.focusTitle.trim(),
        description: formData.focusDescription.trim(),
        pillars: pillarsList
      },
      caseStudies: csList,
      whitePapers: wpList,
      cta: {
        eyebrow: formData.ctaEyebrow.trim(),
        title: formData.ctaTitle.trim(),
        description: formData.ctaDescription.trim(),
        buttonText: formData.ctaButtonText.trim(),
        secondaryButtonText: formData.ctaSecondaryButtonText.trim()
      },
      isVisible: formData.isVisible,
      orderIndex: formData.orderIndex,
      seo: formData.seo
    };

    if (editingId) {
      payload._id = editingId;
    }

    try {
      await saveIndustry(payload);
      setOpenForm(false);
    } catch (err) {
      alert('Error saving industry');
    }
  };

  const handleDeleteClick = (ind) => {
    setDeleteId(ind._id);
    setDeleteSlug(ind.slug);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteIndustry(deleteId);
      setDeleteOpen(false);
      alert('Industry and all associated cascade assets deleted successfully!');
    } catch (err) {
      alert('Failed to delete industry.');
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleIndustryVisibility(id);
    } catch (err) {
      alert('Failed to toggle visibility.');
    }
  };

  if (loading.industries && industries.length === 0) {
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
            Sectors & Industries
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Manage core market sectors, pillars of focus, and associations with cascade delete protections.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Create Sector
        </Button>
      </Box>

      <Card>
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Linked Content</TableCell>
                <TableCell align="center">Order Index</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {industries.map((ind) => (
                <TableRow key={ind._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{ind.title || ind.name || ind.hero?.title}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#818cf8', fontWeight: 600 }}>
                      {ind.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    📚 Case Studies: <strong>{ind.caseStudies?.length || 0}</strong> • White Papers:{' '}
                    <strong>{ind.whitePapers?.length || 0}</strong>
                  </TableCell>
                  <TableCell align="center">{ind.orderIndex}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={ind.isVisible}
                      onChange={() => handleToggleVisibility(ind._id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton color="primary" onClick={() => handleOpenEdit(ind)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(ind)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {industries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#475569' }}>
                    No sectors found. Click 'Create Sector' to begin.
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
          {editingId ? 'Edit Sector Details' : 'Create Sector / Industry'}
        </DialogTitle>

        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ px: 3, borderBottom: '1px solid #1e293b' }}>
          <Tab label="1. Hero & Basics" />
          <Tab label="2. Focus Pillars" />
          <Tab label="3. Associations" />
          <Tab label="4. CTA Panel" />
          <Tab label="5. SEO" />
        </Tabs>

        <form onSubmit={handleSave}>
          <DialogContent sx={{ minHeight: '400px' }}>
            
            {/* TAB 1: HERO & BASICS */}
            {activeTab === 0 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    label="Unique URL Slug"
                    required
                    placeholder="e.g. retail-consumer / healthcare-tech"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Sorting Index"
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hero Eyebrow Text"
                    value={formData.heroEyebrow}
                    onChange={(e) => setFormData({ ...formData, heroEyebrow: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hero Sector Title"
                    required
                    placeholder="e.g. Retail & Consumer Solutions"
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Hero Lead Description"
                    multiline
                    rows={3}
                    value={formData.heroLead}
                    onChange={(e) => setFormData({ ...formData, heroLead: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <ImageUploader
                    label="Hero Top Banner Image"
                    value={formData.heroImage}
                    onChange={(url) => setFormData({ ...formData, heroImage: url })}
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

            {/* TAB 2: FOCUS PILLARS */}
            {activeTab === 1 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Focus Panel Header"
                    value={formData.focusTitle}
                    onChange={(e) => setFormData({ ...formData, focusTitle: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Focus Panel Subtitle"
                    value={formData.focusDescription}
                    onChange={(e) => setFormData({ ...formData, focusDescription: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Focus Pillars (Format: Title : Description, one per line)"
                    multiline
                    rows={8}
                    placeholder="Omnichannel Warehousing : Real-time inventory mapping across multiple warehousing grids.&#10;Predictive Intelligence : Machine learning systems running at checkouts."
                    value={formData.focusPillars}
                    onChange={(e) => setFormData({ ...formData, focusPillars: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}

            {/* TAB 3: ASSOCIATIONS (Case Studies & Whitepapers) */}
            {activeTab === 2 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                    LINKED CASE STUDIES (Format: Title : Result : Date : ImageUrl, one per line)
                  </Typography>
                  <TextField
                    multiline
                    rows={5}
                    placeholder="Scaling Retail Insights : 22% Sales Boost : March 2025 : https://example.com/image.jpg"
                    value={formData.caseStudiesRaw}
                    onChange={(e) => setFormData({ ...formData, caseStudiesRaw: e.target.value })}
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1, borderColor: '#1e293b' }} />
                  <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold" sx={{ mt: 1 }}>
                    LINKED WHITE PAPERS (Format: Topic : Title : PaperID, one per line)
                  </Typography>
                  <TextField
                    multiline
                    rows={5}
                    placeholder="Database Engineering : Black Friday DB scaling secret blueprint : high-scale-databases"
                    value={formData.whitePapersRaw}
                    onChange={(e) => setFormData({ ...formData, whitePapersRaw: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}

            {/* TAB 4: CTA PANEL */}
            {activeTab === 3 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CTA Eyebrow"
                    value={formData.ctaEyebrow}
                    onChange={(e) => setFormData({ ...formData, ctaEyebrow: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CTA Header Title"
                    value={formData.ctaTitle}
                    onChange={(e) => setFormData({ ...formData, ctaTitle: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="CTA Subtext Description"
                    multiline
                    rows={3}
                    value={formData.ctaDescription}
                    onChange={(e) => setFormData({ ...formData, ctaDescription: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CTA Primary Button Text"
                    value={formData.ctaButtonText}
                    onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CTA Secondary Button Text"
                    value={formData.ctaSecondaryButtonText}
                    onChange={(e) => setFormData({ ...formData, ctaSecondaryButtonText: e.target.value })}
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
              {editingId ? 'Save Changes' : 'Create Sector'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal with Critical Cascade Warning */}
      <ConfirmModal
        open={deleteOpen}
        title={`Cascade Delete Sector "${deleteSlug}"?`}
        description={`Are you absolutely sure you want to delete this sector? This initiates a strict database-wide cascade purge.`}
        cascadeWarning={`Deleting this sector will automatically delete ALL Case Studies where the industry slug is "${deleteSlug}", AND delete ALL associated White Papers listed in this sector's White Papers list.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default IndustriesManager;
