import React, { useEffect, useState, useRef } from 'react';
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
  contentPullQuote: '',
  contentFindings: '',
  contentSolution: '',
  contentResult: '',
  sidebarClient: '',
  sidebarIndustry: '',
  sidebarEngagementType: '',
  sidebarDuration: '',
  sidebarScope: '',
  sidebarRelatedWhitePaper: '',
  related: '',
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

const CaseStudiesManager = () => {
  const { caseStudies, fetchCaseStudies, saveCaseStudy, deleteCaseStudy, toggleCaseStudyVisibility, loading } = useCMS();

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

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

    setFormData({
      id: cs.id || '',
      slug: cs.slug || '',
      title: cs.title || '',
      date: cs.date || '',
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
      heroDetailDate: cs.heroDetail?.date || '',
      heroDetailTitle: cs.heroDetail?.title || '',
      heroDetailLead: cs.heroDetail?.lead || '',
      stats: statsText,
      featureImage: cs.images?.featureImage || '',
      secondaryImage: cs.images?.secondaryImage || '',
      contentProblem: cs.content?.problem || '',
      contentPullQuote: cs.content?.pullQuote || '',
      contentFindings: cs.content?.findings || '',
      contentSolution: cs.content?.solution || '',
      contentResult: cs.content?.result || '',
      sidebarClient: cs.sidebar?.client || '',
      sidebarIndustry: cs.sidebar?.industry || '',
      sidebarEngagementType: cs.sidebar?.engagementType || '',
      sidebarDuration: cs.sidebar?.duration || '',
      sidebarScope: cs.sidebar?.scope || '',
      sidebarRelatedWhitePaper: cs.sidebar?.relatedWhitePaper || '',
      related: cs.related ? cs.related.join(', ') : '',
      isVisible: cs.isVisible,
      isFeatured: cs.isFeatured || false,
      seo: cs.seo || initialFormState.seo
    });
    setActiveTab(0);
    setOpenForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.id.trim() || !formData.slug.trim()) return;

    // Parse stats
    const statsList = formData.stats
      ? formData.stats.split('\n').map(line => {
          const parts = line.split(':');
          return { value: parts[0]?.trim() || '', label: parts[1]?.trim() || '' };
        }).filter(s => !!s.value)
      : [];

    // Construct MERN-compliant Case Study JSON object matching schema 100%
    const payload = {
      id: formData.id.trim(),
      slug: formData.slug.trim(),
      title: formData.title.trim(),
      date: formData.date.trim(),
      industry: formData.industry.trim(),
      industryTag: formData.industryTag.trim(),
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
        date: formData.heroDetailDate.trim() || formData.date.trim(),
        title: formData.heroDetailTitle.trim() || formData.title.trim(),
        lead: formData.heroDetailLead.trim() || formData.excerpt.trim()
      },
      stats: statsList,
      images: {
        featureImage: formData.featureImage.trim(),
        secondaryImage: formData.secondaryImage.trim()
      },
      content: {
        problem: formData.contentProblem.trim(),
        pullQuote: formData.contentPullQuote.trim(),
        findings: formData.contentFindings.trim(),
        solution: formData.contentSolution.trim(),
        result: formData.contentResult.trim()
      },
      sidebar: {
        client: formData.sidebarClient.trim(),
        industry: formData.sidebarIndustry.trim(),
        engagementType: formData.sidebarEngagementType.trim(),
        duration: formData.sidebarDuration.trim(),
        scope: formData.sidebarScope.trim(),
        relatedWhitePaper: formData.sidebarRelatedWhitePaper.trim()
      },
      related: formData.related ? formData.related.split(',').map(r => r.trim()).filter(r => !!r) : [],
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
      alert('Error saving case study');
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
      alert('Error deleting case study.');
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleCaseStudyVisibility(id);
    } catch (err) {
      alert('Failed to toggle visibility.');
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

        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ px: 3, borderBottom: '1px solid #1e293b' }}>
          <Tab label="1. Basic Info" />
          <Tab label="2. Layout Details" />
          <Tab label="3. Detailed Content" />
          <Tab label="4. Sidebar Config" />
          <Tab label="5. SEO" />
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
                  <TextField
                    label="Sector Industry slug (Matches Industry)"
                    placeholder="e.g. retail-consumer / healthcare-tech"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    fullWidth
                  />
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
                    label="Engagement Date/Quarter"
                    placeholder="e.g. Q1 2026 / March 2026"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

                <Grid item xs={12}>
                  <TextField
                    label="1. The Problem"
                    multiline
                    rows={3}
                    value={formData.contentProblem}
                    onChange={(e) => setFormData({ ...formData, contentProblem: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="2. Findings / Research"
                    multiline
                    rows={3}
                    value={formData.contentFindings}
                    onChange={(e) => setFormData({ ...formData, contentFindings: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="3. Solution / Execution"
                    multiline
                    rows={3}
                    value={formData.contentSolution}
                    onChange={(e) => setFormData({ ...formData, contentSolution: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="4. Deliverables & Results"
                    multiline
                    rows={3}
                    value={formData.contentResult}
                    onChange={(e) => setFormData({ ...formData, contentResult: e.target.value })}
                    fullWidth
                  />
                </Grid>
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
                  <TextField
                    label="Related White Paper ID (if any)"
                    placeholder="e.g. high-scale-databases"
                    value={formData.sidebarRelatedWhitePaper}
                    onChange={(e) => setFormData({ ...formData, sidebarRelatedWhitePaper: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Related Case Study IDs (Comma-separated)"
                    placeholder="fintech-security-hardening"
                    value={formData.related}
                    onChange={(e) => setFormData({ ...formData, related: e.target.value })}
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
