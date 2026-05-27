import React, { useEffect, useState } from 'react';
import { useCMS } from '../context/CMSContext.jsx';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress
} from '@mui/material';
import FormWizard from '../components/FormWizard.jsx';
import { WizardImageUploader, WizardSEOFields, WizardTextField } from '../components/WizardFields.jsx';
import getErrorMessage from '../utils/errorMessage.js';

const defaultSeo = {
  metaTitle: '',
  metaDescription: '',
  metaKeywords: [],
  ogTitle: '',
  ogDescription: '',
  ogImage: {},
  canonicalUrl: '',
  robots: 'index,follow'
};

const defaultForm = {
  hero: { eyebrow: '', title: '', lead: '', openRoles: '', activeLocations: '', teamSize: '', heroImage: '' },
  values: { title: '', description: '', additional: '', cultureImage: '', itemsRaw: '' },
  cta: { eyebrow: '', title: '', description: '', buttonText: '', workspaceImage: '' },
  seo: defaultSeo
};

const lineCount = (value) => String(value || '').split('\n').map((line) => line.trim()).filter(Boolean).length;
const required = (path, message, extra = {}) => ({ path, message, ...extra });
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

const CareerPageManager = () => {
  const { careerPage, fetchCareerPage, saveCareerPage, loading } = useCMS();
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchCareerPage();
  }, []);

  useEffect(() => {
    if (!careerPage) return;
    const stats = careerPage.hero?.stats || [];
    const valuesItems = careerPage.values?.items || [];

    setFormData({
      hero: {
        eyebrow: careerPage.hero?.eyebrow || '',
        title: careerPage.hero?.title || '',
        lead: careerPage.hero?.lead || '',
        openRoles: stats[0]?.value || '',
        activeLocations: stats[1]?.value || '',
        teamSize: stats[2]?.value || '',
        heroImage: careerPage.hero?.heroImage || ''
      },
      values: {
        title: careerPage.values?.title || '',
        description: careerPage.values?.description || '',
        additional: careerPage.values?.additional || '',
        cultureImage: careerPage.values?.cultureImage || '',
        itemsRaw: valuesItems.map((item) => `${item.title}:${item.description}`).join('\n')
      },
      cta: {
        eyebrow: careerPage.cta?.eyebrow || '',
        title: careerPage.cta?.title || '',
        description: careerPage.cta?.description || '',
        buttonText: careerPage.cta?.buttonText || '',
        workspaceImage: careerPage.cta?.workspaceImage || ''
      },
      seo: careerPage.seo || defaultSeo
    });
  }, [careerPage]);

  const handleSubmit = async () => {
    const items = formData.values.itemsRaw.split('\n').map((line) => {
      const [title, description] = line.split(':');
      return { title: title?.trim() || '', description: description?.trim() || '', icon: 'Star' };
    }).filter((item) => item.title && item.description);

    const payload = {
      hero: {
        eyebrow: formData.hero.eyebrow,
        title: formData.hero.title,
        lead: formData.hero.lead,
        stats: [
          { value: formData.hero.openRoles, label: 'Open Roles' },
          { value: formData.hero.activeLocations, label: 'Active Locations' },
          { value: formData.hero.teamSize, label: 'Team Size' }
        ],
        heroImage: formData.hero.heroImage
      },
      values: {
        title: formData.values.title,
        description: formData.values.description,
        additional: formData.values.additional,
        cultureImage: formData.values.cultureImage,
        items
      },
      cta: formData.cta,
      seo: formData.seo
    };

    try {
      await saveCareerPage(payload);
      alert('Career page details updated successfully!');
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to update Career Page.'));
    }
  };

  const steps = [
    {
      title: 'Hero Section',
      fields: [
        required('hero.eyebrow', 'Eyebrow is required'),
        required('hero.title', 'Title is required'),
        required('hero.lead', 'Lead is required'),
        required('hero.openRoles', 'Open roles stat is required'),
        required('hero.activeLocations', 'Active locations stat is required'),
        required('hero.teamSize', 'Team size stat is required'),
        required('hero.heroImage', 'Hero image is required', { type: 'image' })
      ],
      render: () => (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}><WizardTextField path="hero.eyebrow" label="Eyebrow" /></Grid>
          <Grid item xs={12} sm={6}><WizardTextField path="hero.title" label="Title" /></Grid>
          <Grid item xs={12}><WizardTextField path="hero.lead" label="Lead" multiline rows={3} /></Grid>
          <Grid item xs={12} sm={4}><WizardTextField path="hero.openRoles" label="Stats.openRoles" /></Grid>
          <Grid item xs={12} sm={4}><WizardTextField path="hero.activeLocations" label="Stats.activeLocations" /></Grid>
          <Grid item xs={12} sm={4}><WizardTextField path="hero.teamSize" label="Stats.teamSize" /></Grid>
          <Grid item xs={12}><WizardImageUploader path="hero.heroImage" label="Hero Image" /></Grid>
        </Grid>
      )
    },
    {
      title: 'Values Section',
      fields: [
        required('values.title', 'Values title is required'),
        required('values.description', 'Values description is required'),
        required('values.additional', 'Values additional info is required'),
        required('values.cultureImage', 'Culture image is required', { type: 'image' }),
        required('values.itemsRaw', 'Exactly 3 values with title and description are required', {
          validate: (value) => lineCount(value) === 3 ? '' : 'Exactly 3 values with title and description are required'
        })
      ],
      render: () => (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}><WizardTextField path="values.title" label="Values Title" /></Grid>
          <Grid item xs={12} sm={6}><WizardImageUploader path="values.cultureImage" label="Culture Image" /></Grid>
          <Grid item xs={12}><WizardTextField path="values.description" label="Values Description" multiline rows={2} /></Grid>
          <Grid item xs={12}><WizardTextField path="values.additional" label="Values Additional" multiline rows={2} /></Grid>
          <Grid item xs={12}><WizardTextField path="values.itemsRaw" label="Values Items, exactly 3 lines (Title:Description)" multiline rows={6} /></Grid>
        </Grid>
      )
    },
    {
      title: 'CTA Section',
      fields: [
        required('cta.eyebrow', 'CTA eyebrow is required'),
        required('cta.title', 'CTA title is required'),
        required('cta.description', 'CTA description is required'),
        required('cta.buttonText', 'CTA button text is required'),
        required('cta.workspaceImage', 'Workspace image is required', { type: 'image' })
      ],
      render: () => (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}><WizardTextField path="cta.eyebrow" label="CTA Eyebrow" /></Grid>
          <Grid item xs={12} sm={6}><WizardTextField path="cta.title" label="CTA Title" /></Grid>
          <Grid item xs={12}><WizardTextField path="cta.description" label="CTA Description" multiline rows={3} /></Grid>
          <Grid item xs={12} sm={6}><WizardTextField path="cta.buttonText" label="CTA Button Text" /></Grid>
          <Grid item xs={12} sm={6}><WizardImageUploader path="cta.workspaceImage" label="Workspace Image" /></Grid>
        </Grid>
      )
    },
    {
      title: 'SEO',
      fields: seoFields,
      render: () => <WizardSEOFields />
    }
  ];

  if (loading.career || !careerPage) {
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
          Manage Career Page Content
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Configure headers, culture lists, stats cards, and workspace images for the public website.
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <FormWizard
            steps={steps}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            publishLabel="Publish Career Page"
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default CareerPageManager;
