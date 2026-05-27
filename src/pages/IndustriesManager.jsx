import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ConfirmModal from '../components/ConfirmModal.jsx';
import FeedbackSnackbar from '../components/FeedbackSnackbar.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import SEOFields from '../components/SEOFields.jsx';
import { getWizardMissingMessages, getWizardStats, WizardStatusPanel } from '../components/FormWizard.jsx';
import getErrorMessage from '../utils/errorMessage.js';

const initialFormState = {
  slug: '',
  breadcrumbParent: 'Industries',
  breadcrumbCurrent: '',
  heroEyebrow: 'Our Sectors',
  heroTitle: '',
  heroLead: '',
  heroImage: '',
  heroImageAlt: '',
  focusTitle: 'Focus Areas',
  focusDescription: '',
  focusPillars: '', // text-format: "Title : Description" per line
  caseStudies: [],
  whitePapers: [],
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

const required = (path, message, extra = {}) => ({ path, message, ...extra });
const lineCount = (value) => String(value || '').split('\n').map((line) => line.trim()).filter(Boolean).length;
const seoFields = [
  required('seo.metaTitle', 'Meta title is required'),
  required('seo.metaDescription', 'Meta description is required'),
  required('seo.metaKeywords', 'At least one keyword is required', { type: 'array', min: 1 }),
  required('seo.ogTitle', 'OG title is required'),
  required('seo.ogDescription', 'OG description is required'),
  required('seo.ogImage', 'OG image is required', { type: 'image' })
];

const IndustriesManager = () => {
  const navigate = useNavigate();
  const {
    industries, fetchIndustries, saveIndustry, deleteIndustry, toggleIndustryVisibility,
    caseStudies, fetchCaseStudies,
    whitePapers, fetchWhitePapers,
    loading
  } = useCMS();

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSlug, setDeleteSlug] = useState('');
  const [feedback, setFeedback] = useState({ open: false, severity: 'success', message: '' });
  const showFeedback = (severity, message) => setFeedback({ open: true, severity, message });
  const closeFeedback = () => setFeedback((current) => ({ ...current, open: false }));

  useEffect(() => {
    fetchIndustries();
    fetchCaseStudies();
    fetchWhitePapers();
  }, []);
  const wizardSteps = [
    {
      title: 'Basic Info',
      fields: [
        required('slug', 'Name/slug is required'),
        required('heroTitle', 'Title is required'),
        required('heroLead', 'Lead is required'),
        required('heroEyebrow', 'Eyebrow is required'),
        required('heroImage', 'Hero image is required', { type: 'image' }),
        required('heroImageAlt', 'Hero image alt text is required'),
        required('isVisible', 'Please select visibility status', { type: 'boolean' }),
        required('orderIndex', 'Order index is required')
      ]
    },
    {
      title: 'Focus Areas',
      fields: [
        required('focusTitle', 'Focus title is required'),
        required('focusDescription', 'Focus description is required'),
        required('focusPillars', 'Exactly 4 pillars are required', { validate: (value) => lineCount(value) === 4 ? '' : 'Exactly 4 pillars are required' })
      ]
    },
    {
      title: 'Associated Content',
      fields: [
        required('caseStudies', 'At least two linked case studies are required', { type: 'array', min: 2 }),
        required('whitePapers', 'At least one linked white paper is required', { type: 'array', min: 1 })
      ]
    },
    {
      title: 'CTA & SEO',
      fields: [
        required('ctaTitle', 'CTA title is required'),
        required('ctaDescription', 'CTA description is required'),
        required('ctaButtonText', 'CTA button text is required'),
        required('ctaSecondaryButtonText', 'CTA secondary button text is required'),
        ...seoFields
      ]
    }
  ];
  const wizardStats = getWizardStats(wizardSteps, formData);

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

    setFormData({
      slug: ind.slug || '',
      breadcrumbParent: ind.breadcrumb?.parent || 'Industries',
      breadcrumbCurrent: ind.breadcrumb?.current || '',
      heroEyebrow: ind.hero?.eyebrow || 'Our Sectors',
      heroTitle: ind.hero?.title || '',
      heroLead: ind.hero?.lead || '',
      heroImage: typeof ind.hero?.heroImage === 'string' ? ind.hero.heroImage : ind.hero?.heroImage?.url || '',
      heroImageAlt: typeof ind.hero?.heroImage === 'object' ? ind.hero?.heroImage?.alt || '' : '',
      focusTitle: ind.focus?.title || 'Focus Areas',
      focusDescription: ind.focus?.description || '',
      focusPillars: pillarsText,
      caseStudies: (ind.caseStudies || []).map(cs => cs.slug).filter(Boolean),
      whitePapers: (ind.whitePapers || []).map(wp => wp.slug).filter(Boolean),
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
    if (!wizardStats.complete) {
      showFeedback('warning', `Complete these fields before publishing:\n\n${getWizardMissingMessages(wizardSteps, formData).join('\n')}`);
      return;
    }

    // Parse pillars: "Title : Description"
    const pillarsList = formData.focusPillars
      ? formData.focusPillars.split('\n').map(line => {
          const parts = line.split(':');
          return { title: parts[0]?.trim() || '', description: parts[1]?.trim() || '' };
        }).filter(p => !!p.title)
      : [];

    const csList = formData.caseStudies
      .map((slug) => caseStudies.find((study) => study.slug === slug))
      .filter(Boolean)
      .map((study) => ({
        caseStudyId: study._id,
        slug: study.slug,
        title: study.title,
        result: study.excerpt || '',
        image: study.image?.url || '',
        industryTag: study.industryTag || formData.breadcrumbCurrent || '',
        isVisible: study.isVisible !== false
      }));

    const wpList = formData.whitePapers
      .map((slug) => whitePapers.find((paper) => paper.slug === slug))
      .filter(Boolean)
      .map((paper) => ({
        whitePaperId: paper._id,
        slug: paper.slug,
        topic: paper.topic || '',
        title: paper.title,
        id: paper.id || '',
        isVisible: paper.isVisible !== false
      }));

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
        heroImage: {
          url: formData.heroImage.trim(),
          alt: formData.heroImageAlt.trim(),
          placeholder: ''
        }
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
      showFeedback('success', editingId ? 'Industry updated successfully.' : 'Industry created successfully.');
    } catch (err) {
      showFeedback('error', getErrorMessage(err, 'Error saving industry'));
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
      showFeedback('success', 'Industry and all associated cascade assets deleted successfully.');
    } catch (err) {
      showFeedback('error', getErrorMessage(err, 'Failed to delete industry.'));
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleIndustryVisibility(id);
      showFeedback('success', 'Industry visibility updated successfully.');
    } catch (err) {
      showFeedback('error', getErrorMessage(err, 'Failed to toggle visibility.'));
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
                {/* <TableCell align="center">Status</TableCell> */}
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
                  {/* <TableCell align="center">
                    <Switch
                      checked={ind.isVisible}
                      onChange={() => handleToggleVisibility(ind._id)}
                      color="primary"
                    />
                  </TableCell> */}
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
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ color: '#94a3b8', mb: 2 }}>
                      No industries created yet.
                    </Typography>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreate}>
                      Create Your First Industry
                    </Button>
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

        <Box sx={{ px: 3, pb: 2 }}>
          <WizardStatusPanel steps={wizardSteps} formData={formData} />
        </Box>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ px: 3, borderBottom: '1px solid #1e293b' }}>
          {wizardSteps.map((step, index) => (
            <Tab
              key={step.title}
              label={`${index + 1}. ${step.title} ${wizardStats.stepStats[index].complete ? '✓' : `! ${wizardStats.stepStats[index].missing}`}`}
            />
          ))}
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
                <Grid item xs={12}>
                  <TextField
                    label="Hero Top Banner Image Alt Text"
                    value={formData.heroImageAlt}
                    onChange={(e) => setFormData({ ...formData, heroImageAlt: e.target.value })}
                    fullWidth
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
                {/* <Grid item xs={12}>
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
                </Grid> */}
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
                    Linked Case Studies
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Case Studies</InputLabel>
                    <Select
                      multiple
                      label="Case Studies"
                      value={formData.caseStudies}
                      onChange={(e) => setFormData({ ...formData, caseStudies: e.target.value })}
                    >
                      {caseStudies.map((study) => (
                        <MenuItem key={study._id || study.slug} value={study.slug}>
                          {study.title} ({study.industry || 'No industry'})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {caseStudies.length === 0 && (
                    <Alert
                      severity="info"
                      sx={{ mt: 2 }}
                      action={
                        <Button size="small" variant="contained" onClick={() => navigate('/case-studies')}>
                          Create Case Study
                        </Button>
                      }
                    >
                      Create a case study first to link it to this industry.
                    </Alert>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold" sx={{ mt: 1 }}>
                    Linked White Papers
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>White Papers</InputLabel>
                    <Select
                      multiple
                      label="White Papers"
                      value={formData.whitePapers}
                      onChange={(e) => setFormData({ ...formData, whitePapers: e.target.value })}
                    >
                      {whitePapers.map((paper) => (
                        <MenuItem key={paper._id || paper.slug} value={paper.slug}>
                          {paper.title} ({paper.topic || 'No topic'})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {whitePapers.length === 0 && (
                    <Alert
                      severity="info"
                      sx={{ mt: 2 }}
                      action={
                        <Button size="small" variant="contained" onClick={() => navigate('/white-papers')}>
                          Create White Paper
                        </Button>
                      }
                    >
                      Create a white paper first to link it to this industry.
                    </Alert>
                  )}
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

            {activeTab === 3 && (
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
            <Button onClick={() => setActiveTab(Math.max(0, activeTab - 1))} disabled={activeTab === 0}>
              Previous
            </Button>
            <Button onClick={() => setActiveTab(Math.min(wizardSteps.length - 1, activeTab + 1))} disabled={activeTab === wizardSteps.length - 1}>
              Next
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={!wizardStats.complete} title={wizardStats.complete ? 'All fields complete! Ready to publish' : `Complete all ${wizardStats.missing} missing fields across all steps to publish`}>
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
      <FeedbackSnackbar feedback={feedback} onClose={closeFeedback} />
    </Box>
  );
};

export default IndustriesManager;
