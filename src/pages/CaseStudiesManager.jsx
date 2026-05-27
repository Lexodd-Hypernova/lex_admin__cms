import React, { useEffect, useState, useRef } from 'react';
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
import ImageUploader from '../components/ImageUploader.jsx';
import SEOFields from '../components/SEOFields.jsx';
import { getWizardMissingMessages, getWizardStats, WizardStatusPanel } from '../components/FormWizard.jsx';
import getErrorMessage from '../utils/errorMessage.js';
import { toDateInputValue } from '../utils/dateFormat.js';

const initialFormState = {
  id: '',
  slug: '',
  title: '',
  date: '',
  industry: '',
  industryTag: '',
  excerpt: '',
  filters: '',
  imageUrl: '',
  imageAlt: '',
  imagePlaceholder: '',
  breadcrumbParent: 'Case Studies',
  breadcrumbCurrent: '',
  heroDetailIndustry: '',
  heroDetailDate: '',
  heroDetailTitle: '',
  heroDetailLead: '',
  stats: '', // JSON-like string or list text e.g. "value:label"
  featureImage: '',
  secondaryImage: '',
  contentProblem: '',
  contentProblemTitle: '',
  contentProblemDescription: '',
  contentProblemAdditional: '',
  contentPullQuote: '',
  contentFindings: '',
  contentFindingsTitle: '',
  contentFindingsDescription: '',
  contentFindingsAdditional: '',
  contentSolution: '',
  contentSolutionTitle: '',
  contentSolutionDescription: '',
  contentSolutionAdditional: '',
  contentResult: '',
  contentResultTitle: '',
  contentResultDescription: '',
  sidebarClient: '',
  sidebarIndustry: '',
  sidebarEngagementType: '',
  sidebarDuration: '',
  sidebarScope: '',
  sidebarRelatedWhitePaper: '',
  sidebarRelatedWhitePaperSlug: '',
  related: [],
  isVisible: true,
  isFeatured: false,
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

const CaseStudiesManager = () => {
  const navigate = useNavigate();
  const {
    caseStudies, fetchCaseStudies, saveCaseStudy, deleteCaseStudy, toggleCaseStudyVisibility,
    whitePapers, fetchWhitePapers,
    industries, fetchIndustries,
    loading
  } = useCMS();

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCaseStudies();
    fetchWhitePapers();
    fetchIndustries();
  }, []);

  const selectedIndustry = industries.find((industry) => industry.slug === formData.industry);
  const selectedWhitePaper = whitePapers.find((paper) => paper.slug === formData.sidebarRelatedWhitePaperSlug);
  const otherCaseStudies = caseStudies.filter((study) => study._id !== editingId);
  const wizardSteps = [
    {
      title: 'Basic Info',
      fields: [
        required('title', 'Title is required', { label: 'Title' }),
        required('excerpt', 'Excerpt is required', { label: 'Excerpt' }),
        required('industry', 'Please select an industry', { label: 'Industry' }),
        required('slug', 'Slug is required', { label: 'Slug' }),
        required('date', 'Please select a date', { label: 'Date' }),
        required('imageUrl', 'Featured image is required', { type: 'image', label: 'Featured Image' }),
        required('isVisible', 'Please select visibility status', { type: 'boolean', label: 'Visibility' }),
        required('isFeatured', 'Please select featured status', { type: 'boolean', label: 'Featured Status' })
      ]
    },
    {
      title: 'Layout Details',
      fields: [
        required('heroDetailTitle', 'Hero title is required', { label: 'Hero Title' }),
        required('heroDetailLead', 'Hero lead is required', { label: 'Hero Lead' }),
        required('stats', 'At least one stat is required', { label: 'Stats', validate: (value) => lineCount(value) >= 1 ? '' : 'At least one stat is required' }),
        required('featureImage', 'Feature image is required', { type: 'image', label: 'Feature Image' }),
        required('secondaryImage', 'Secondary image is required', { type: 'image', label: 'Secondary Image' })
      ]
    },
    {
      title: 'Detailed Content',
      fields: [
        required('contentProblemTitle', 'Problem title is required'),
        required('contentProblemDescription', 'Problem description is required'),
        required('contentProblemAdditional', 'Problem additional info is required'),
        required('contentPullQuote', 'Pull quote is required'),
        required('contentFindingsTitle', 'Findings title is required'),
        required('contentFindingsDescription', 'Findings description is required'),
        required('contentFindingsAdditional', 'Findings additional info is required'),
        required('contentSolutionTitle', 'Solution title is required'),
        required('contentSolutionDescription', 'Solution description is required'),
        required('contentSolutionAdditional', 'Solution additional info is required'),
        required('contentResultTitle', 'Result title is required'),
        required('contentResultDescription', 'Result description is required')
      ]
    },
    {
      title: 'Sidebar Config',
      fields: [
        required('sidebarClient', 'Client name is required'),
        required('sidebarIndustry', 'Industry is required'),
        required('sidebarEngagementType', 'Engagement type is required'),
        required('sidebarDuration', 'Duration is required'),
        required('sidebarScope', 'Scope is required'),
        required('sidebarRelatedWhitePaperSlug', 'Please select a related white paper')
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

  const handleOpenEdit = (cs) => {
    setEditingId(cs._id);
    
    // Format stats array of value/label back to lines
    const statsText = cs.stats ? cs.stats.map(s => `${s.value}:${s.label}`).join('\n') : '';
    const sectionValue = (value, fallbackTitle) => typeof value === 'string'
      ? { title: fallbackTitle, description: value, additional: '' }
      : (value || { title: fallbackTitle, description: '', additional: '' });
    const problem = sectionValue(cs.content?.problem, 'The problem');
    const findings = sectionValue(cs.content?.findings, 'What we found');
    const solution = sectionValue(cs.content?.solution, 'What we built');
    const result = sectionValue(cs.content?.result, 'The result');

    setFormData({
      id: cs.id || '',
      slug: cs.slug || '',
      title: cs.title || '',
      date: toDateInputValue(cs.date),
      industry: cs.industry || '',
      industryTag: cs.industryTag || '',
      excerpt: cs.excerpt || '',
      filters: cs.filters ? cs.filters.join(', ') : '',
      imageUrl: cs.image?.url || '',
      imageAlt: cs.image?.alt || '',
      imagePlaceholder: cs.image?.placeholder || '',
      breadcrumbParent: cs.breadcrumb?.parent || 'Case Studies',
      breadcrumbCurrent: cs.breadcrumb?.current || '',
      heroDetailIndustry: cs.heroDetail?.industry || '',
      heroDetailDate: toDateInputValue(cs.heroDetail?.date),
      heroDetailTitle: cs.heroDetail?.title || '',
      heroDetailLead: cs.heroDetail?.lead || '',
      stats: statsText,
      featureImage: cs.images?.featureImage || '',
      secondaryImage: cs.images?.secondaryImage || '',
      contentProblem: cs.content?.problem || '',
      contentProblemTitle: problem.title || '',
      contentProblemDescription: problem.description || '',
      contentProblemAdditional: problem.additional || '',
      contentPullQuote: cs.content?.pullQuote || '',
      contentFindings: cs.content?.findings || '',
      contentFindingsTitle: findings.title || '',
      contentFindingsDescription: findings.description || '',
      contentFindingsAdditional: findings.additional || '',
      contentSolution: cs.content?.solution || '',
      contentSolutionTitle: solution.title || '',
      contentSolutionDescription: solution.description || '',
      contentSolutionAdditional: solution.additional || '',
      contentResult: cs.content?.result || '',
      contentResultTitle: result.title || '',
      contentResultDescription: result.description || '',
      sidebarClient: cs.sidebar?.client || '',
      sidebarIndustry: cs.sidebar?.industry || '',
      sidebarEngagementType: cs.sidebar?.engagementType || '',
      sidebarDuration: cs.sidebar?.duration || '',
      sidebarScope: cs.sidebar?.scope || '',
      sidebarRelatedWhitePaper: cs.sidebar?.relatedWhitePaper || '',
      sidebarRelatedWhitePaperSlug: cs.sidebar?.relatedWhitePaperSlug || '',
      related: cs.related || [],
      isVisible: cs.isVisible,
      isFeatured: cs.isFeatured || false,
      seo: cs.seo || initialFormState.seo
    });
    setActiveTab(0);
    setOpenForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!wizardStats.complete) {
      alert(`Complete these fields before publishing:\n\n${getWizardMissingMessages(wizardSteps, formData).join('\n')}`);
      return;
    }

    // Parse stats
    const statsList = formData.stats
      ? formData.stats.split('\n').map(line => {
          const parts = line.split(':');
          return { value: parts[0]?.trim() || '', label: parts[1]?.trim() || '' };
        }).filter(s => !!s.value)
      : [];

    // Construct MERN-compliant Case Study JSON object matching schema 100%
    const payload = {
      id: (formData.id || formData.slug).trim(),
      slug: formData.slug.trim(),
      title: formData.title.trim(),
      date: toDateInputValue(formData.date),
      industry: formData.industry,
      industryTag: formData.industryTag.trim() || selectedIndustry?.hero?.title || selectedIndustry?.title || selectedIndustry?.name || '',
      excerpt: formData.excerpt.trim(),
      filters: formData.filters ? formData.filters.split(',').map(f => f.trim()).filter(f => !!f) : [],
      image: {
        url: formData.imageUrl.trim(),
        alt: formData.imageAlt.trim(),
        placeholder: formData.imagePlaceholder.trim()
      },
      breadcrumb: {
        parent: formData.breadcrumbParent.trim(),
        current: formData.breadcrumbCurrent.trim()
      },
      heroDetail: {
        industry: formData.heroDetailIndustry.trim() || formData.industryTag.trim(),
        date: toDateInputValue(formData.heroDetailDate) || toDateInputValue(formData.date),
        title: formData.heroDetailTitle.trim() || formData.title.trim(),
        lead: formData.heroDetailLead.trim() || formData.excerpt.trim()
      },
      stats: statsList,
      images: {
        featureImage: formData.featureImage.trim(),
        secondaryImage: formData.secondaryImage.trim()
      },
      content: {
        problem: {
          title: formData.contentProblemTitle.trim(),
          description: formData.contentProblemDescription.trim(),
          additional: formData.contentProblemAdditional.trim()
        },
        pullQuote: formData.contentPullQuote.trim(),
        findings: {
          title: formData.contentFindingsTitle.trim(),
          description: formData.contentFindingsDescription.trim(),
          additional: formData.contentFindingsAdditional.trim()
        },
        solution: {
          title: formData.contentSolutionTitle.trim(),
          description: formData.contentSolutionDescription.trim(),
          additional: formData.contentSolutionAdditional.trim()
        },
        result: {
          title: formData.contentResultTitle.trim(),
          description: formData.contentResultDescription.trim()
        }
      },
      sidebar: {
        client: formData.sidebarClient.trim(),
        industry: formData.sidebarIndustry.trim(),
        engagementType: formData.sidebarEngagementType.trim(),
        duration: formData.sidebarDuration.trim(),
        scope: formData.sidebarScope.trim(),
        relatedWhitePaper: selectedWhitePaper?.title || formData.sidebarRelatedWhitePaper.trim(),
        relatedWhitePaperSlug: formData.sidebarRelatedWhitePaperSlug
      },
      related: formData.related,
      isVisible: formData.isVisible,
      isFeatured: formData.isFeatured,
      seo: formData.seo
    };

    if (editingId) {
      payload._id = editingId;
    }

    try {
      await saveCaseStudy(payload);
      setOpenForm(false);
    } catch (err) {
      alert(getErrorMessage(err, 'Error saving case study'));
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCaseStudy(deleteId);
      setDeleteOpen(false);
    } catch (err) {
      alert(getErrorMessage(err, 'Error deleting case study.'));
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleCaseStudyVisibility(id);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to toggle visibility.'));
    }
  };

  if (loading.caseStudies && caseStudies.length === 0) {
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
            Case Studies
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Manage rich project narratives, clients stats, filter tags, and visual grids.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Create Case Study
        </Button>
      </Box>

      <Card>
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Slug / ID</TableCell>
                <TableCell>Industry Tag</TableCell>
                <TableCell>Engagement Date</TableCell>
                <TableCell align="center">Featured</TableCell>
                <TableCell align="center">Visible</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {caseStudies.map((cs) => (
                <TableRow key={cs._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{cs.title}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#818cf8', fontWeight: 600 }}>
                      {cs.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>{cs.industryTag}</TableCell>
                  <TableCell>{cs.date}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={cs.isFeatured ? 'YES' : 'NO'}
                      size="small"
                      color={cs.isFeatured ? 'secondary' : 'default'}
                      sx={{ fontWeight: 'bold', fontSize: 10 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={cs.isVisible}
                      onChange={() => handleToggleVisibility(cs._id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton color="primary" onClick={() => handleOpenEdit(cs)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(cs._id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {caseStudies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#475569' }}>
                    No case studies found. Click 'Create Case Study' to write your first project story!
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
          {editingId ? 'Edit Case Study' : 'Create Case Study'}
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
            
            {/* TAB 1: BASIC INFO */}
            {activeTab === 0 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Unique String ID"
                    required
                    placeholder="e.g. retail-analytics-dashboard"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="URL Slug"
                    required
                    placeholder="e.g. retail-analytics-dashboard"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Case Study Title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Industry</InputLabel>
                    <Select
                      label="Industry"
                      value={formData.industry}
                      onChange={(e) => {
                        const industry = industries.find((item) => item.slug === e.target.value);
                        const industryName = industry?.hero?.title || industry?.title || industry?.name || '';
                        setFormData({
                          ...formData,
                          industry: e.target.value,
                          industryTag: formData.industryTag || industryName,
                          sidebarIndustry: formData.sidebarIndustry || industryName,
                          heroDetailIndustry: formData.heroDetailIndustry || industryName
                        });
                      }}
                    >
                      {industries.map((industry) => (
                        <MenuItem key={industry._id || industry.slug} value={industry.slug}>
                          {industry.hero?.title || industry.title || industry.name || industry.slug}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {industries.length === 0 && (
                    <Alert
                      severity="warning"
                      sx={{ mt: 2 }}
                      action={
                        <Button size="small" variant="contained" onClick={() => navigate('/industries')}>
                          Create Industry
                        </Button>
                      }
                    >
                      Create an industry first before adding case studies.
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Industry Display Tag"
                    placeholder="e.g. Retail & Consumer"
                    value={formData.industryTag}
                    onChange={(e) => setFormData({ ...formData, industryTag: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Engagement Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Filters Tags (Comma-separated)"
                    placeholder="React, Next.js, Node.js"
                    value={formData.filters}
                    onChange={(e) => setFormData({ ...formData, filters: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Short Excerpt"
                    multiline
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <ImageUploader
                    label="Featured Image"
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
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
                    label="Featured Case Study"
                  />
                </Grid>
              </Grid>
            )}

            {/* TAB 2: LAYOUT DETAILS (Images & Breadcrumbs) */}
            {activeTab === 1 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hero Title"
                    value={formData.heroDetailTitle}
                    onChange={(e) => setFormData({ ...formData, heroDetailTitle: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Stats list (value:label format, one per line)"
                    multiline
                    rows={3}
                    placeholder="22%:Sales Increase&#10;92%:Latency Reduction"
                    value={formData.stats}
                    onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Hero Lead"
                    multiline
                    rows={3}
                    placeholder="An enterprise analytics system resolving database bottlenecks..."
                    value={formData.heroDetailLead}
                    onChange={(e) => setFormData({ ...formData, heroDetailLead: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ImageUploader
                    label="Grid Cover Image"
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Image Alt Tag"
                    value={formData.imageAlt}
                    onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Image SVG Placeholder string (if any)"
                    value={formData.imagePlaceholder}
                    onChange={(e) => setFormData({ ...formData, imagePlaceholder: e.target.value })}
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

                <Grid item xs={12} sm={6}>
                  <ImageUploader
                    label="Feature Image"
                    value={formData.featureImage}
                    onChange={(url) => setFormData({ ...formData, featureImage: url })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ImageUploader
                    label="Secondary Layout Image"
                    value={formData.secondaryImage}
                    onChange={(url) => setFormData({ ...formData, secondaryImage: url })}
                  />
                </Grid>
              </Grid>
            )}

            {/* TAB 3: DETAILED CONTENT */}
            {activeTab === 2 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Stats list (value:label format, one per line)"
                    multiline
                    rows={3}
                    placeholder="22%:Sales Increase&#10;92%:Latency Reduction"
                    value={formData.stats}
                    onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hero Detail Lead Sentence"
                    multiline
                    rows={3}
                    placeholder="An enterprise analytics system resolving database bottlenecks..."
                    value={formData.heroDetailLead}
                    onChange={(e) => setFormData({ ...formData, heroDetailLead: e.target.value })}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}><TextField label="Problem Title" value={formData.contentProblemTitle} onChange={(e) => setFormData({ ...formData, contentProblemTitle: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12} sm={8}><TextField label="Problem Additional" value={formData.contentProblemAdditional} onChange={(e) => setFormData({ ...formData, contentProblemAdditional: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Problem Description" multiline rows={3} value={formData.contentProblemDescription} onChange={(e) => setFormData({ ...formData, contentProblemDescription: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Findings Title" value={formData.contentFindingsTitle} onChange={(e) => setFormData({ ...formData, contentFindingsTitle: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12} sm={8}><TextField label="Findings Additional" value={formData.contentFindingsAdditional} onChange={(e) => setFormData({ ...formData, contentFindingsAdditional: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Findings Description" multiline rows={3} value={formData.contentFindingsDescription} onChange={(e) => setFormData({ ...formData, contentFindingsDescription: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Solution Title" value={formData.contentSolutionTitle} onChange={(e) => setFormData({ ...formData, contentSolutionTitle: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12} sm={8}><TextField label="Solution Additional" value={formData.contentSolutionAdditional} onChange={(e) => setFormData({ ...formData, contentSolutionAdditional: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Solution Description" multiline rows={3} value={formData.contentSolutionDescription} onChange={(e) => setFormData({ ...formData, contentSolutionDescription: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Result Title" value={formData.contentResultTitle} onChange={(e) => setFormData({ ...formData, contentResultTitle: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12} sm={8}><TextField label="Result Description" multiline rows={2} value={formData.contentResultDescription} onChange={(e) => setFormData({ ...formData, contentResultDescription: e.target.value })} fullWidth /></Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Pull Quote / Highlight Quote"
                    multiline
                    rows={2}
                    value={formData.contentPullQuote}
                    onChange={(e) => setFormData({ ...formData, contentPullQuote: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}

            {/* TAB 4: SIDEBAR CONFIG */}
            {activeTab === 3 && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Client Name"
                    placeholder="e.g. Fashion Retailer Corp"
                    value={formData.sidebarClient}
                    onChange={(e) => setFormData({ ...formData, sidebarClient: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Engagement Industry"
                    placeholder="e.g. E-Commerce & Retail"
                    value={formData.sidebarIndustry}
                    onChange={(e) => setFormData({ ...formData, sidebarIndustry: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Engagement Type"
                    placeholder="e.g. Product Engineering"
                    value={formData.sidebarEngagementType}
                    onChange={(e) => setFormData({ ...formData, sidebarEngagementType: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Duration"
                    placeholder="e.g. 6 Months"
                    value={formData.sidebarDuration}
                    onChange={(e) => setFormData({ ...formData, sidebarDuration: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Service Scope"
                    placeholder="e.g. Architecture, Backend, Frontend"
                    value={formData.sidebarScope}
                    onChange={(e) => setFormData({ ...formData, sidebarScope: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Related White Paper</InputLabel>
                    <Select
                      label="Related White Paper"
                      value={formData.sidebarRelatedWhitePaperSlug}
                      onChange={(e) => setFormData({ ...formData, sidebarRelatedWhitePaperSlug: e.target.value })}
                    >
                      <MenuItem value="">None</MenuItem>
                      {whitePapers.map((paper) => (
                        <MenuItem key={paper._id || paper.slug} value={paper.slug}>
                          {paper.title}
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
                      Create a white paper first to link it here.
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Related Case Studies</InputLabel>
                    <Select
                      multiple
                      label="Related Case Studies"
                      value={formData.related}
                      onChange={(e) => setFormData({ ...formData, related: e.target.value })}
                    >
                      {otherCaseStudies.map((study) => (
                        <MenuItem key={study._id || study.slug} value={study.slug}>
                          {study.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {otherCaseStudies.length === 0 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Add another case study before linking related work.
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
              {editingId ? 'Save Changes' : 'Create Case Study'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteOpen}
        title="Delete Case Study?"
        description="Are you sure you want to permanently delete this case study narrative? Visual blocks and portfolio entries will be cleared."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default CaseStudiesManager;
