import React, { useEffect, useState } from 'react';
import { useCMS } from '../context/CMSContext.jsx';
import {
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ImageUploader from '../components/ImageUploader.jsx';
import SEOFields from '../components/SEOFields.jsx';

const CareerPageManager = () => {
  const { careerPage, fetchCareerPage, saveCareerPage, loading } = useCMS();
  const [activeTab, setActiveTab] = useState(0);

  // Sub-states for Form editing
  const [hero, setHero] = useState({ eyebrow: '', title: '', lead: '', statsRaw: '', heroImage: '' });
  const [values, setValues] = useState({ title: '', description: '', additional: '', cultureImage: '', itemsRaw: '' });
  const [cta, setCta] = useState({ eyebrow: '', title: '', description: '', buttonText: '', workspaceImage: '' });
  const [seo, setSeo] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: {},
    canonicalUrl: '',
    robots: 'index,follow'
  });

  useEffect(() => {
    fetchCareerPage();
  }, []);

  // Update edit forms when data arrives
  useEffect(() => {
    if (careerPage) {
      // Stats raw string: value:label per line
      const statsStr = careerPage.hero?.stats
        ? careerPage.hero.stats.map(s => `${s.value}:${s.label}`).join('\n')
        : '';

      // Items raw string: title:description:icon per line
      const itemsStr = careerPage.values?.items
        ? careerPage.values.items.map(it => `${it.title}:${it.description}:${it.icon}`).join('\n')
        : '';

      setHero({
        eyebrow: careerPage.hero?.eyebrow || '',
        title: careerPage.hero?.title || '',
        lead: careerPage.hero?.lead || '',
        statsRaw: statsStr,
        heroImage: careerPage.hero?.heroImage || ''
      });

      setValues({
        title: careerPage.values?.title || '',
        description: careerPage.values?.description || '',
        additional: careerPage.values?.additional || '',
        cultureImage: careerPage.values?.cultureImage || '',
        itemsRaw: itemsStr
      });

      setCta({
        eyebrow: careerPage.cta?.eyebrow || '',
        title: careerPage.cta?.title || '',
        description: careerPage.cta?.description || '',
        buttonText: careerPage.cta?.buttonText || '',
        workspaceImage: careerPage.cta?.workspaceImage || ''
      });

      setSeo(careerPage.seo || seo);
    }
  }, [careerPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse stats
    const statsList = hero.statsRaw
      ? hero.statsRaw.split('\n').map(line => {
          const parts = line.split(':');
          return { value: parts[0]?.trim() || '', label: parts[1]?.trim() || '' };
        }).filter(s => !!s.value)
      : [];

    // Parse items
    const itemsList = values.itemsRaw
      ? values.itemsRaw.split('\n').map(line => {
          const parts = line.split(':');
          return {
            title: parts[0]?.trim() || '',
            description: parts[1]?.trim() || '',
            icon: parts[2]?.trim() || 'Star'
          };
        }).filter(it => !!it.title)
      : [];

    const payload = {
      hero: {
        eyebrow: hero.eyebrow,
        title: hero.title,
        lead: hero.lead,
        stats: statsList,
        heroImage: hero.heroImage
      },
      values: {
        title: values.title,
        description: values.description,
        additional: values.additional,
        cultureImage: values.cultureImage,
        items: itemsList
      },
      cta: {
        eyebrow: cta.eyebrow,
        title: cta.title,
        description: cta.description,
        buttonText: cta.buttonText,
        workspaceImage: cta.workspaceImage
      },
      seo
    };

    try {
      await saveCareerPage(payload);
      alert('Career page details updated successfully!');
    } catch (err) {
      alert('Failed to update Career Page.');
    }
  };

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
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ px: 3, borderBottom: '1px solid #1e293b' }}>
          <Tab label="1. Hero Banner" />
          <Tab label="2. Our Values & Culture" />
          <Tab label="3. CTA Section" />
          <Tab label="4. SEO" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          <CardContent sx={{ minHeight: 300, p: 4 }}>
            
            {/* HERO BANNER SECTION */}
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hero Eyebrow text"
                    value={hero.eyebrow}
                    onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hero Title"
                    value={hero.title}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Hero Lead Paragraph"
                    multiline
                    rows={3}
                    value={hero.lead}
                    onChange={(e) => setHero({ ...hero, lead: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ImageUploader
                    label="Hero Background Image"
                    value={hero.heroImage}
                    onChange={(url) => setHero({ ...hero, heroImage: url })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hero Stats (Format: value:label, one per line)"
                    multiline
                    rows={3}
                    placeholder="50+:Global Creators&#10;98%:Retention Rate"
                    value={hero.statsRaw}
                    onChange={(e) => setHero({ ...hero, statsRaw: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}

            {/* VALUES SECTION */}
            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Values Panel Title"
                    value={values.title}
                    onChange={(e) => setValues({ ...values, title: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ImageUploader
                    label="Culture Image"
                    value={values.cultureImage}
                    onChange={(url) => setValues({ ...values, cultureImage: url })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Values Panel Description"
                    multiline
                    rows={2}
                    value={values.description}
                    onChange={(e) => setValues({ ...values, description: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Culture Highlights (Additional description)"
                    multiline
                    rows={2}
                    value={values.additional}
                    onChange={(e) => setValues({ ...values, additional: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Values Items (Format: title : description : icon, one per line)"
                    multiline
                    rows={6}
                    placeholder="Autonomy First : We trust you to organize your own day : Autonomy&#10;Craftsmanship : Quality is our highest metric : Code"
                    value={values.itemsRaw}
                    onChange={(e) => setValues({ ...values, itemsRaw: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}

            {/* CTA SECTION */}
            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CTA Eyebrow"
                    value={cta.eyebrow}
                    onChange={(e) => setCta({ ...cta, eyebrow: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CTA Section Title"
                    value={cta.title}
                    onChange={(e) => setCta({ ...cta, title: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="CTA Description Paragraph"
                    multiline
                    rows={3}
                    value={cta.description}
                    onChange={(e) => setCta({ ...cta, description: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CTA Button Text"
                    value={cta.buttonText}
                    onChange={(e) => setCta({ ...cta, buttonText: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ImageUploader
                    label="Workspace / Team Photo"
                    value={cta.workspaceImage}
                    onChange={(url) => setCta({ ...cta, workspaceImage: url })}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 3 && (
              <SEOFields value={seo} onChange={setSeo} />
            )}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button type="submit" variant="contained" color="secondary" startIcon={<SaveIcon />} size="large">
                Publish Career Page Changes
              </Button>
            </Box>
          </CardContent>
        </form>
      </Card>
    </Box>
  );
};

export default CareerPageManager;
