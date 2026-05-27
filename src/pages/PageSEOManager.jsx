import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import api from '../utils/api.js';
import FeedbackSnackbar from '../components/FeedbackSnackbar.jsx';
import SEOFields from '../components/SEOFields.jsx';
import getErrorMessage from '../utils/errorMessage.js';

const pages = [
  { value: 'home', label: 'Home Page' },
  { value: 'how-we-work', label: 'How We Work Page' },
  { value: 'case-studies', label: 'Case Studies Main Page' },
  { value: 'white-papers', label: 'White Papers Main Page' },
  { value: 'industries', label: 'Industries Main Page' }
];

const emptySeo = {
  metaTitle: '',
  metaDescription: '',
  metaKeywords: [],
  ogTitle: '',
  ogDescription: '',
  ogImage: {},
  canonicalUrl: '',
  robots: 'index,follow'
};

const PageSEOManager = () => {
  const [page, setPage] = useState('home');
  const [seo, setSeo] = useState(emptySeo);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, severity: 'success', message: '' });
  const showFeedback = (severity, message) => setFeedback({ open: true, severity, message });
  const closeFeedback = () => setFeedback((current) => ({ ...current, open: false }));

  useEffect(() => {
    fetchSEO(page);
  }, [page]);

  const fetchSEO = async (pageKey) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/cms/pages/${pageKey}/seo`);
      setSeo(res.data || emptySeo);
    } catch (err) {
      console.error('Error fetching page SEO:', err);
      setSeo(emptySeo);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/api/cms/pages/${page}/seo`, seo);
      setSeo(res.data || emptySeo);
      showFeedback('success', 'Page SEO updated successfully.');
    } catch (err) {
      console.error('Error saving page SEO:', err);
      showFeedback('error', getErrorMessage(err, 'Failed to update page SEO.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>
          Static Page SEO
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Manage meta tags for static and listing pages.
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <TextField
            select
            label="Page"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            sx={{ mb: 3, maxWidth: 360 }}
            fullWidth
          >
            {pages.map((item) => (
              <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
          </TextField>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <SEOFields value={seo} onChange={setSeo} />
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save SEO'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <FeedbackSnackbar feedback={feedback} onClose={closeFeedback} />
    </Box>
  );
};

export default PageSEOManager;
