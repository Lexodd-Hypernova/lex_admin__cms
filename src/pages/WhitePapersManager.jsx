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
  Alert,
  Pagination
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
import { toDateInputValue } from '../utils/dateFormat.js';

const initialFormState = {
  id: '',
  slug: '',
  topic: '',
  date: '',
  readTime: '',
  title: '',
  excerpt: '',
  coverImage: '',
  coverImageAlt: '',
  filters: '',
  breadcrumbParent: 'Whitepapers',
  breadcrumbCurrent: '',
  heroTitle: '',
  heroDescription: '',
  downloadPdfUrl: '',
  frameworkDiagram: '',
  frameworkDiagramAlt: '',
  abstract: '',
  pullQuote: '',
  contentProblem: '',
  contentProblemTitle: '',
  contentProblemDescription: '',
  contentProblemAdditional: '',
  contentFramework: '',
  contentFrameworkTitle: '',
  contentFrameworkDescription: '',
  contentFrameworkAdditional: '',
  sidebarPublished: '',
  sidebarRelatedCaseStudySlug: '',
  sidebarAlsoInSeries: [],
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

const required = (path, message, extra = {}) => ({ path, message, ...extra });
const lineCount = (value) => String(value || '').split('\n').map((line) => line.trim()).filter(Boolean).length;
const seoFields = [
  required('seo.metaTitle', 'Meta title is required'),
  required('seo.metaDescription', 'Meta description is required'),
  required('seo.metaKeywords', 'At least one keyword is required', { type: 'array', min: 1 }),
  required('seo.ogTitle', 'OG title is required'),
  required('seo.ogDescription', 'OG description is required'),
  required('seo.ogImage', 'OG image is required', { type: 'image' }),
  required('seo.canonicalUrl', 'Canonical URL is required'),
  required('seo.robots', 'Please select robots setting')
];

const WhitePapersManager = () => {
  const navigate = useNavigate();
  const {
    whitePapers, fetchWhitePapers, saveWhitePaper, deleteWhitePaper, toggleWhitePaperVisibility,
    caseStudies, fetchCaseStudies,
    loading
  } = useCMS();

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [feedback, setFeedback] = useState({ open: false, severity: 'success', message: '' });
  const showFeedback = (severity, message) => setFeedback({ open: true, severity, message });
  const closeFeedback = () => setFeedback((current) => ({ ...current, open: false }));

  useEffect(() => {
    fetchWhitePapers();
    fetchCaseStudies();
  }, []);

  useEffect(() => {
    if (page > 1 && page > Math.ceil(whitePapers.length / 6)) {
      setPage(1);
    }
  }, [whitePapers.length, page]);

  const selectedCaseStudy = caseStudies.find((study) => study.slug === formData.sidebarRelatedCaseStudySlug);
  const otherWhitePapers = whitePapers.filter((paper) => paper._id !== editingId);
  const pageSize = 6;
  const pageCount = Math.ceil(whitePapers.length / pageSize);
  const paginatedWhitePapers = whitePapers.slice((page - 1) * pageSize, page * pageSize);
  const wizardSteps = [
    {
      title: 'Basic Info',
      fields: [
        required('title', 'Title is required'),
        required('excerpt', 'Excerpt is required'),
        required('topic', 'Topic is required'),
        required('date', 'Please select a date'),
        required('readTime', 'Read time is required'),
        required('coverImage', 'Cover image is required', { type: 'image' }),
        required('coverImageAlt', 'Cover image alt text is required'),
        required('isVisible', 'Please select visibility status', { type: 'boolean' }),
        required('slug', 'Slug is required')
      ]
    },
    {
      title: 'Layout & Download',
      fields: [
        required('downloadPdfUrl', 'PDF file is required', { type: 'image' }),
        required('frameworkDiagram', 'Content image is required', { type: 'image' }),
        required('frameworkDiagramAlt', 'Content image alt text is required')
      ]
    },
    {
      title: 'Content',
      fields: [
        required('heroDescription', 'Hero lead is required'),
        required('abstract', 'Abstract is required'),
        required('pullQuote', 'Pull quote is required'),
        required('contentProblemTitle', 'Problem title is required'),
        required('contentProblemDescription', 'Problem description is required'),
        required('contentProblemAdditional', 'Problem additional info is required'),
        required('contentFrameworkTitle', 'Framework title is required'),
        required('contentFrameworkDescription', 'Framework description is required'),
        required('contentFrameworkAdditional', 'Framework additional info is required')
      ]
    },
    {
      title: 'Sidebar Config',
      fields: [
        required('sidebarRelatedCaseStudySlug', 'Please select a related case study'),
        required('sidebarAlsoInSeries', 'At least one series item is required', { type: 'array', min: 1 })
      ]
    },
    { title: 'SEO', fields: seoFields }
  ];
  const wizardStats = getWizardStats(wizardSteps, formData);

  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setActiveTab(0);
    setOpenForm(true);
  };

  const handleOpenEdit = (wp) => {
    setEditingId(wp._id);
    const sectionValue = (value, fallbackTitle) => typeof value === 'string'
      ? { title: fallbackTitle, description: value, additional: '' }
      : (value || { title: fallbackTitle, description: '', additional: '' });
    const problem = sectionValue(wp.content?.problem, 'The core problem');
    const framework = sectionValue(wp.content?.framework, 'Framework');
    setFormData({
      id: wp.id || '',
      slug: wp.slug || '',
      topic: wp.topic || '',
      date: toDateInputValue(wp.date),
      readTime: wp.readTime || '',
      title: wp.title || '',
      excerpt: wp.excerpt || '',
      coverImage: typeof wp.coverImage === 'string' ? wp.coverImage : wp.coverImage?.url || '',
      coverImageAlt: typeof wp.coverImage === 'object' ? wp.coverImage?.alt || '' : '',
      filters: wp.filters ? wp.filters.join(', ') : '',
      breadcrumbParent: wp.breadcrumb?.parent || 'Whitepapers',
      breadcrumbCurrent: wp.breadcrumb?.current || '',
      heroTitle: wp.hero?.title || '',
      heroDescription: wp.hero?.description || '',
      downloadPdfUrl: wp.download?.pdfUrl || '',
      frameworkDiagram: typeof wp.images?.frameworkDiagram === 'string' ? wp.images.frameworkDiagram : wp.images?.frameworkDiagram?.url || '',
      frameworkDiagramAlt: typeof wp.images?.frameworkDiagram === 'object' ? wp.images.frameworkDiagram?.alt || '' : '',
      abstract: wp.abstract || '',
      pullQuote: wp.pullQuote || '',
      contentProblem: wp.content?.problem || '',
      contentProblemTitle: problem.title || '',
      contentProblemDescription: problem.description || '',
      contentProblemAdditional: problem.additional || '',
      contentFramework: wp.content?.framework || '',
      contentFrameworkTitle: framework.title || '',
      contentFrameworkDescription: framework.description || '',
      contentFrameworkAdditional: framework.additional || '',
      sidebarPublished: toDateInputValue(wp.sidebar?.published || wp.date),
      sidebarRelatedCaseStudySlug: wp.sidebar?.relatedCaseStudySlug || '',
      sidebarAlsoInSeries: Array.isArray(wp.sidebar?.alsoInSeries) ? wp.sidebar.alsoInSeries : [],
      isVisible: wp.isVisible,
      seo: wp.seo || initialFormState.seo
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

    const payload = {
      id: (formData.id || formData.slug).trim(),
      slug: formData.slug.trim(),
      topic: formData.topic.trim(),
      date: toDateInputValue(formData.date),
      readTime: formData.readTime.trim(),
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim(),
      coverImage: {
        url: formData.coverImage.trim(),
        alt: formData.coverImageAlt.trim(),
        placeholder: ''
      },
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
        pdfUrl: formData.downloadPdfUrl.trim()
      },
      images: {
        frameworkDiagram: {
          url: formData.frameworkDiagram.trim(),
          alt: formData.frameworkDiagramAlt.trim(),
          placeholder: ''
        }
      },
      abstract: formData.abstract.trim(),
      pullQuote: formData.pullQuote.trim(),
      content: {
        problem: {
          title: formData.contentProblemTitle.trim(),
          description: formData.contentProblemDescription.trim(),
          additional: formData.contentProblemAdditional.trim()
        },
        framework: {
          title: formData.contentFrameworkTitle.trim(),
          description: formData.contentFrameworkDescription.trim(),
          additional: formData.contentFrameworkAdditional.trim()
        }
      },
      sidebar: {
        published: toDateInputValue(formData.sidebarPublished) || toDateInputValue(formData.date),
        relatedCaseStudy: selectedCaseStudy?.title || '',
        relatedCaseStudySlug: formData.sidebarRelatedCaseStudySlug,
        alsoInSeries: formData.sidebarAlsoInSeries
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
      showFeedback('success', editingId ? 'White paper updated successfully.' : 'White paper published successfully.');
    } catch (err) {
      showFeedback('error', getErrorMessage(err, 'Error saving white paper'));
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
      showFeedback('success', 'White paper deleted successfully.');
    } catch (err) {
      showFeedback('error', getErrorMessage(err, 'Error deleting white paper.'));
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleWhitePaperVisibility(id);
      showFeedback('success', 'White paper visibility updated successfully.');
    } catch (err) {
      showFeedback('error', getErrorMessage(err, 'Failed to toggle visibility status.'));
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
              {paginatedWhitePapers.map((wp) => (
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
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

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
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    InputLabelProps={{ shrink: true }}
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
                  <ImageUploader
                    label="Cover Image"
                    value={formData.coverImage}
                    onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Cover Image Alt Text"
                    value={formData.coverImageAlt}
                    onChange={(e) => setFormData({ ...formData, coverImageAlt: e.target.value })}
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
                    label="Content Image"
                    value={formData.frameworkDiagram}
                    onChange={(url) => setFormData({ ...formData, frameworkDiagram: url })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Content Image Alt Text"
                    value={formData.frameworkDiagramAlt}
                    onChange={(e) => setFormData({ ...formData, frameworkDiagramAlt: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <ImageUploader
                    label="PDF File"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    field="cv"
                    maxSize={10 * 1024 * 1024}
                    value={formData.downloadPdfUrl}
                    onChange={(url) => setFormData({ ...formData, downloadPdfUrl: url })}
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
                <Grid item xs={12} sm={4}><TextField label="Problem Title" value={formData.contentProblemTitle} onChange={(e) => setFormData({ ...formData, contentProblemTitle: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12} sm={8}><TextField label="Problem Additional" value={formData.contentProblemAdditional} onChange={(e) => setFormData({ ...formData, contentProblemAdditional: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Problem Description" multiline rows={3} value={formData.contentProblemDescription} onChange={(e) => setFormData({ ...formData, contentProblemDescription: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Framework Title" value={formData.contentFrameworkTitle} onChange={(e) => setFormData({ ...formData, contentFrameworkTitle: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12} sm={8}><TextField label="Framework Additional" value={formData.contentFrameworkAdditional} onChange={(e) => setFormData({ ...formData, contentFrameworkAdditional: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Framework Description" multiline rows={4} value={formData.contentFrameworkDescription} onChange={(e) => setFormData({ ...formData, contentFrameworkDescription: e.target.value })} fullWidth /></Grid>
              </Grid>
            )}

            {/* TAB 4: DOWNLOAD & METADATA */}
            {activeTab === 3 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Publish Date Info"
                    type="date"
                    value={formData.sidebarPublished}
                    onChange={(e) => setFormData({ ...formData, sidebarPublished: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Related Case Study</InputLabel>
                    <Select
                      label="Related Case Study"
                      value={formData.sidebarRelatedCaseStudySlug}
                      onChange={(e) => setFormData({ ...formData, sidebarRelatedCaseStudySlug: e.target.value })}
                    >
                      <MenuItem value="">None</MenuItem>
                      {caseStudies.map((study) => (
                        <MenuItem key={study._id || study.slug} value={study.slug}>
                          {study.title}
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
                      Create a case study first to link it here.
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Also in this series</InputLabel>
                    <Select
                      multiple
                      label="Also in this series"
                      value={formData.sidebarAlsoInSeries}
                      onChange={(e) => setFormData({ ...formData, sidebarAlsoInSeries: e.target.value })}
                    >
                      {otherWhitePapers.map((paper) => (
                        <MenuItem key={paper._id || paper.slug} value={paper.title}>
                          {paper.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {otherWhitePapers.length === 0 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Add another white paper before linking a series.
                    </Alert>
                  )}
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
            <Button onClick={() => setActiveTab(Math.max(0, activeTab - 1))} disabled={activeTab === 0}>
              Previous
            </Button>
            <Button onClick={() => setActiveTab(Math.min(wizardSteps.length - 1, activeTab + 1))} disabled={activeTab === wizardSteps.length - 1}>
              Next
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={!wizardStats.complete} title={wizardStats.complete ? 'All fields complete! Ready to publish' : `Complete all ${wizardStats.missing} missing fields across all steps to publish`}>
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
      <FeedbackSnackbar feedback={feedback} onClose={closeFeedback} />
    </Box>
  );
};

export default WhitePapersManager;
