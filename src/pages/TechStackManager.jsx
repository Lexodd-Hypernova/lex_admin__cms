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
  Tab,
  FormControlLabel,
  Switch
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ImageUploader from '../components/ImageUploader.jsx';
import SEOFields from '../components/SEOFields.jsx';

const TechStackManager = () => {
  const { techStack, fetchTechStack, saveTechStack, toggleTechStackVisibility, loading } = useCMS();
  const [activeTab, setActiveTab] = useState(0);

  // Form states
  const [hero, setHero] = useState({ eyebrow: '', title: '', lead: '', heroImage: '', statsRaw: '' });
  const [principles, setPrinciples] = useState({ title: '', description: '', itemsRaw: '' });
  const [cta, setCta] = useState({ title: '', description: '', buttonText: '', secondaryButtonText: '' });
  const [isActive, setIsActive] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
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

  // Categories editing (Three fixed MERN categories seeded in database)
  const [catFrontend, setCatFrontend] = useState({ description: '', toolsRaw: '' });
  const [catBackend, setCatBackend] = useState({ description: '', toolsRaw: '' });
  const [catDatabase, setCatDatabase] = useState({ description: '', toolsRaw: '' });

  useEffect(() => {
    fetchTechStack();
  }, []);

  useEffect(() => {
    if (techStack) {
      // Stats raw string: value:label per line
      const statsStr = techStack.hero?.stats
        ? techStack.hero.stats.map(s => `${s.value}:${s.label}`).join('\n')
        : '';

      // Principles items raw string: title:description per line
      const itemsStr = techStack.principles?.items
        ? techStack.principles.items.map(it => `${it.title}:${it.description}`).join('\n')
        : '';

      setHero({
        eyebrow: techStack.hero?.eyebrow || '',
        title: techStack.hero?.title || '',
        lead: techStack.hero?.lead || '',
        heroImage: techStack.hero?.heroImage || '',
        statsRaw: statsStr
      });

      setPrinciples({
        title: techStack.principles?.title || '',
        description: techStack.principles?.description || '',
        itemsRaw: itemsStr
      });

      setCta({
        title: techStack.cta?.title || '',
        description: techStack.cta?.description || '',
        buttonText: techStack.cta?.buttonText || '',
        secondaryButtonText: techStack.cta?.secondaryButtonText || ''
      });

      setIsActive(techStack.isActive);
      setIsVisible(techStack.isVisible !== false);
      setSeo(techStack.seo || seo);

      // Categories setup
      const front = techStack.categories?.find(c => c.id === 'frontend');
      const back = techStack.categories?.find(c => c.id === 'backend');
      const db = techStack.categories?.find(c => c.id === 'database');

      if (front) {
        setCatFrontend({
          description: front.description || '',
          toolsRaw: front.tools ? front.tools.map(t => `${t.name} : ${t.logo} : ${t.level}`).join('\n') : ''
        });
      }
      if (back) {
        setCatBackend({
          description: back.description || '',
          toolsRaw: back.tools ? back.tools.map(t => `${t.name} : ${t.logo} : ${t.level}`).join('\n') : ''
        });
      }
      if (db) {
        setCatDatabase({
          description: db.description || '',
          toolsRaw: db.tools ? db.tools.map(t => `${t.name} : ${t.logo} : ${t.level}`).join('\n') : ''
        });
      }
    }
  }, [techStack]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse stats
    const statsList = hero.statsRaw
      ? hero.statsRaw.split('\n').map(line => {
          const parts = line.split(':');
          return { value: parts[0]?.trim() || '', label: parts[1]?.trim() || '' };
        }).filter(s => !!s.value)
      : [];

    // Parse principles items
    const principlesList = principles.itemsRaw
      ? principles.itemsRaw.split('\n').map(line => {
          const parts = line.split(':');
          return { title: parts[0]?.trim() || '', description: parts[1]?.trim() || '' };
        }).filter(p => !!p.title)
      : [];

    // Helper to parse tools: "Name : Logo : Level"
    const parseTools = (rawText, catName) => {
      return rawText
        ? rawText.split('\n').map(line => {
            const parts = line.split(':');
            return {
              name: parts[0]?.trim() || '',
              logo: parts[1]?.trim() || '',
              category: catName,
              level: parts[2]?.trim() || 'Core'
            };
          }).filter(t => !!t.name)
        : [];
    };

    const categoriesList = [
      {
        id: 'frontend',
        name: 'Frontend Technologies',
        icon: 'Laptop',
        description: catFrontend.description,
        tools: parseTools(catFrontend.toolsRaw, 'Frontend')
      },
      {
        id: 'backend',
        name: 'Backend & APIs',
        icon: 'Storage',
        description: catBackend.description,
        tools: parseTools(catBackend.toolsRaw, 'Backend')
      },
      {
        id: 'database',
        name: 'Databases & Cache',
        icon: 'Database',
        description: catDatabase.description,
        tools: parseTools(catDatabase.toolsRaw, 'Database')
      }
    ];

    const payload = {
      hero: {
        eyebrow: hero.eyebrow,
        title: hero.title,
        lead: hero.lead,
        heroImage: hero.heroImage,
        stats: statsList
      },
      categories: categoriesList,
      principles: {
        title: principles.title,
        description: principles.description,
        items: principlesList
      },
      cta: {
        title: cta.title,
        description: cta.description,
        buttonText: cta.buttonText,
        secondaryButtonText: cta.secondaryButtonText
      },
      isActive: isActive,
      isVisible: isVisible,
      seo
    };

    try {
      await saveTechStack(payload);
      alert('Tech Stack configurations updated successfully!');
    } catch (err) {
      alert('Failed to update Tech Stack settings.');
    }
  };

  const handleTogglePageVisibility = async () => {
    try {
      const updated = await toggleTechStackVisibility();
      setIsVisible(updated.isVisible !== false);
    } catch (err) {
      alert('Failed to toggle Tech Stack page visibility.');
    }
  };

  if (loading.techStack || !techStack) {
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
          Tech Stack Configurator
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Configure categories of framework tools, stats, architectural principles, and CTAs.
        </Typography>
      </Box>

      <Card>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ px: 3, borderBottom: '1px solid #1e293b' }}>
          <Tab label="1. Hero & Principles" />
          <Tab label="2. Categories & Tools" />
          <Tab label="3. CTA & Visibility" />
          <Tab label="4. SEO" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          <CardContent sx={{ minHeight: 300, p: 4 }}>
            
            {/* TAB 1: HERO & PRINCIPLES */}
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hero Eyebrow Text"
                    value={hero.eyebrow}
                    onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hero Main Title"
                    value={hero.title}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Hero Lead Description"
                    multiline
                    rows={2}
                    value={hero.lead}
                    onChange={(e) => setHero({ ...hero, lead: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ImageUploader
                    label="Hero Banner Image"
                    value={hero.heroImage}
                    onChange={(url) => setHero({ ...hero, heroImage: url })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hero Stats (Format: value:label, one per line)"
                    multiline
                    rows={3}
                    placeholder="100%:Cloud Native&#10;99.99%:Uptime SLA"
                    value={hero.statsRaw}
                    onChange={(e) => setHero({ ...hero, statsRaw: e.target.value })}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sx={{ my: 1 }}><Divider sx={{ borderColor: '#1e293b' }} /></Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Principles Header"
                    value={principles.title}
                    onChange={(e) => setPrinciples({ ...principles, title: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Principles Description Sentence"
                    value={principles.description}
                    onChange={(e) => setPrinciples({ ...principles, description: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Engineering Principles List (Format: title : description, one per line)"
                    multiline
                    rows={4}
                    placeholder="Keep it Simple : We prefer readable, simple architectures over over-engineering.&#10;Test Rigorously : 90%+ coverage rates."
                    value={principles.itemsRaw}
                    onChange={(e) => setPrinciples({ ...principles, itemsRaw: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}

            {/* TAB 2: CATEGORIES & TOOLS */}
            {activeTab === 1 && (
              <Grid container spacing={4}>
                {/* Frontend Category */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                    💻 CATEGORY: FRONTEND
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Frontend Description"
                        multiline
                        rows={6}
                        value={catFrontend.description}
                        onChange={(e) => setCatFrontend({ ...catFrontend, description: e.target.value })}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        label="Tools list (Format: Tool Name : Logo URL : Level, one per line)"
                        multiline
                        rows={6}
                        placeholder="React : https://cdn.worldvectorlogo.com/logos/react-2.svg : Core&#10;Next.js : https://cdn.worldvectorlogo.com/logos/nextjs-2.svg : Expert"
                        value={catFrontend.toolsRaw}
                        onChange={(e) => setCatFrontend({ ...catFrontend, toolsRaw: e.target.value })}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}><Divider sx={{ borderColor: '#1e293b' }} /></Grid>

                {/* Backend Category */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                    ⚙️ CATEGORY: BACKEND & APIS
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Backend Description"
                        multiline
                        rows={6}
                        value={catBackend.description}
                        onChange={(e) => setCatBackend({ ...catBackend, description: e.target.value })}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        label="Tools list (Format: Tool Name : Logo URL : Level, one per line)"
                        multiline
                        rows={6}
                        placeholder="Node.js : https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg : Expert&#10;Express : https://cdn.worldvectorlogo.com/logos/expressjs-1.svg : Core"
                        value={catBackend.toolsRaw}
                        onChange={(e) => setCatBackend({ ...catBackend, toolsRaw: e.target.value })}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}><Divider sx={{ borderColor: '#1e293b' }} /></Grid>

                {/* Database Category */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                    📁 CATEGORY: DATABASES & CACHE
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Database Description"
                        multiline
                        rows={6}
                        value={catDatabase.description}
                        onChange={(e) => setCatDatabase({ ...catDatabase, description: e.target.value })}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        label="Tools list (Format: Tool Name : Logo URL : Level, one per line)"
                        multiline
                        rows={6}
                        placeholder="MongoDB : https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg : Core&#10;Redis : https://cdn.worldvectorlogo.com/logos/redis.svg : Expert"
                        value={catDatabase.toolsRaw}
                        onChange={(e) => setCatDatabase({ ...catDatabase, toolsRaw: e.target.value })}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {/* TAB 3: CTA & VISIBILITY */}
            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CTA Main Header"
                    value={cta.title}
                    onChange={(e) => setCta({ ...cta, title: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CTA Description Subtext"
                    value={cta.description}
                    onChange={(e) => setCta({ ...cta, description: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CTA Primary Button Text"
                    value={cta.buttonText}
                    onChange={(e) => setCta({ ...cta, buttonText: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CTA Secondary Button Text"
                    value={cta.secondaryButtonText}
                    onChange={(e) => setCta({ ...cta, secondaryButtonText: e.target.value })}
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Tech Stack Section Enabled (isActive)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isVisible}
                        onChange={handleTogglePageVisibility}
                        color="secondary"
                      />
                    }
                    label="Tech Stack Page Visible on Website"
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 3 && (
              <SEOFields value={seo} onChange={setSeo} />
            )}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="secondary" startIcon={<SaveIcon />} size="large">
                Save Stack Configurations
              </Button>
            </Box>
          </CardContent>
        </form>
      </Card>
    </Box>
  );
};

export default TechStackManager;
