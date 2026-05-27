import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FeedbackSnackbar from '../components/FeedbackSnackbar.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import api from '../utils/api.js';
import getErrorMessage from '../utils/errorMessage.js';

const asImageObject = (url) => ({ url, alt: '', placeholder: '' });
const sanitizePagePayload = (pageData) => ({
  heroImage: pageData?.heroImage || {},
  expectImage: pageData?.expectImage || {},
  seo: pageData?.seo || {}
});

const HowWeWorkManager = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, severity: 'success', message: '' });
  const showFeedback = (severity, message) => setFeedback({ open: true, severity, message });
  const closeFeedback = () => setFeedback((current) => ({ ...current, open: false }));

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/cms/how-we-work/page');
      setPage(res.data);
    } catch (err) {
      console.error('Error fetching How We Work page:', err);
      setPage({ heroImage: {}, expectImage: {} });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/api/cms/how-we-work/page', sanitizePagePayload(page));
      setPage(res.data);
      showFeedback('success', 'How We Work images updated successfully.');
    } catch (err) {
      console.error('Error saving How We Work page:', err);
      showFeedback('error', getErrorMessage(err, 'Failed to update How We Work images.'));
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (field, url) => {
    const image = asImageObject(url);
    setPage((current) => ({
      ...(current || {}),
      [field]: image
    }));

    setSaving(true);
    try {
      const res = await api.put('/api/cms/how-we-work/page', { [field]: image });
      setPage(res.data);
    } catch (err) {
      console.error('Error auto-saving How We Work image:', err);
      showFeedback('error', getErrorMessage(err, 'Image uploaded, but failed to save it to the page. Please click Save Images.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !page) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>
          How We Work Page
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Manage the hero image and the image in the final What to Expect section.
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ImageUploader
                label="Hero Section Image"
                value={page.heroImage?.url || ''}
                onChange={(url) => handleImageChange('heroImage', url)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageUploader
                label="What to Expect Section Image"
                value={page.expectImage?.url || ''}
                onChange={(url) => handleImageChange('expectImage', url)}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Images'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <FeedbackSnackbar feedback={feedback} onClose={closeFeedback} />
    </Box>
  );
};

export default HowWeWorkManager;
