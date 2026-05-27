import React, { useEffect, useState } from 'react';
import { useCMS } from '../context/CMSContext.jsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FormWizard from '../components/FormWizard.jsx';
import { WizardImageUploader, WizardSEOFields, WizardTextField } from '../components/WizardFields.jsx';
import { getNestedValue } from '../components/FormWizard.jsx';
import getErrorMessage from '../utils/errorMessage.js';

const image = { url: '', alt: '', placeholder: '' };
const defaultTechStack = {
  isVisible: true,
  isActive: true,
  hero: { eyebrow: '', title: '', lead: '', heroImage: image, isVisible: true },
  introduction: { title: '', description: '', features: [], isVisible: true },
  categories: [],
  principles: { title: '', description: '', isVisible: true, items: [] },
  cta: { title: '', description: '', buttonText: '', secondaryButtonText: '', backgroundImage: image, isVisible: true },
  seo: { metaTitle: '', metaDescription: '', metaKeywords: [], ogTitle: '', ogDescription: '', ogImage: {}, canonicalUrl: '', robots: 'index,follow' }
};

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const required = (path, message, extra = {}) => ({ path, message, ...extra });
const imageRequired = (path, message) => required(path, message, { type: 'image' });
const countRequired = (path, count, label) => required(path, `${label} must contain exactly ${count} items`, {
  validate: (value) => Array.isArray(value) && value.length === count ? '' : `${label} must contain exactly ${count} items`
});
const seoFields = [
  required('seo.metaTitle', 'Meta title is required'),
  required('seo.metaDescription', 'Meta description is required'),
  required('seo.metaKeywords', 'At least one keyword is required', { type: 'array', min: 1 }),
  required('seo.ogTitle', 'OG title is required'),
  required('seo.ogDescription', 'OG description is required'),
  imageRequired('seo.ogImage', 'OG image is required')
];

const normalizeStack = (stack) => {
  const source = stack || defaultTechStack;
  return {
    ...defaultTechStack,
    ...source,
    hero: { ...defaultTechStack.hero, ...(source.hero || {}), heroImage: source.hero?.heroImage || image },
    introduction: { ...defaultTechStack.introduction, ...(source.introduction || {}) },
    categories: (source.categories || []).map((category, categoryIndex) => ({
      _id: category._id,
      id: category.id || slugify(category.name || `category-${categoryIndex + 1}`),
      name: category.name || '',
      description: category.description || '',
      logo: category.logo || image,
      isVisible: category.isVisible !== false,
      orderIndex: category.orderIndex ?? categoryIndex,
      tools: (category.tools || []).map((tool, toolIndex) => ({
        _id: tool._id,
        name: tool.name || '',
        description: tool.description || '',
        useCase: tool.useCase || '',
        isVisible: tool.isVisible !== false,
        orderIndex: tool.orderIndex ?? toolIndex
      }))
    })),
    principles: {
      ...defaultTechStack.principles,
      ...(source.principles || {}),
      items: (source.principles?.items || []).map((item, index) => ({
        _id: item._id,
        number: item.number || String(index + 1).padStart(2, '0'),
        title: item.title || '',
        description: item.description || '',
        isVisible: item.isVisible !== false,
        orderIndex: item.orderIndex ?? index
      }))
    },
    cta: { ...defaultTechStack.cta, ...(source.cta || {}), backgroundImage: source.cta?.backgroundImage || image },
    seo: source.seo || defaultTechStack.seo
  };
};

const ensureListSize = (items, size, factory) => {
  const next = [...(items || [])];
  while (next.length < size) next.push(factory(next.length));
  return next.slice(0, size).map((item, index) => ({ ...item, orderIndex: index }));
};

const TechStackManager = () => {
  const { techStack, fetchTechStack, saveTechStack, loading } = useCMS();
  const [formData, setFormData] = useState(defaultTechStack);

  useEffect(() => {
    fetchTechStack();
  }, []);

  useEffect(() => {
    if (techStack) setFormData(normalizeStack(techStack));
  }, [techStack]);

  const setArrayItem = (path, index, updates) => {
    setFormData((prev) => {
      const items = [...getNestedValue(prev, path)];
      items[index] = { ...items[index], ...updates };
      const keys = path.split('.');
      const next = { ...prev };
      let cursor = next;
      keys.forEach((key, keyIndex) => {
        if (keyIndex === keys.length - 1) cursor[key] = items;
        else {
          cursor[key] = { ...cursor[key] };
          cursor = cursor[key];
        }
      });
      return next;
    });
  };

  const addExactDefaults = () => {
    setFormData((prev) => ({
      ...prev,
      introduction: {
        ...prev.introduction,
        features: ensureListSize(prev.introduction.features, 4, () => '')
      },
      categories: ensureListSize(prev.categories, 5, (categoryIndex) => ({
        id: `category-${categoryIndex + 1}`,
        name: '',
        description: '',
        logo: image,
        isVisible: true,
        tools: ensureListSize([], 4, (toolIndex) => ({ name: '', description: '', useCase: '', isVisible: true, orderIndex: toolIndex }))
      })).map((category) => ({
        ...category,
        tools: ensureListSize(category.tools, 4, (toolIndex) => ({ name: '', description: '', useCase: '', isVisible: true, orderIndex: toolIndex }))
      })),
      principles: {
        ...prev.principles,
        items: ensureListSize(prev.principles.items, 4, (index) => ({ number: String(index + 1).padStart(2, '0'), title: '', description: '', isVisible: true }))
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      await saveTechStack(formData);
      alert('Tech Stack configuration updated successfully!');
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to update Tech Stack settings.'));
    }
  };

  const featureFields = (formData.introduction.features || []).map((_, index) => required(`introduction.features.${index}`, `Feature ${index + 1} is required`));
  const categoryFields = (formData.categories || []).flatMap((category, categoryIndex) => [
    required(`categories.${categoryIndex}.name`, `Category ${categoryIndex + 1} name is required`),
    required(`categories.${categoryIndex}.description`, `Category ${categoryIndex + 1} description is required`),
    imageRequired(`categories.${categoryIndex}.logo`, `Category ${categoryIndex + 1} logo is required`),
    ...((category.tools || []).flatMap((_, toolIndex) => [
      required(`categories.${categoryIndex}.tools.${toolIndex}.name`, `Tool ${toolIndex + 1} name is required`),
      required(`categories.${categoryIndex}.tools.${toolIndex}.description`, `Tool ${toolIndex + 1} description is required`),
      required(`categories.${categoryIndex}.tools.${toolIndex}.useCase`, `Tool ${toolIndex + 1} use case is required`)
    ]))
  ]);
  const principleFields = (formData.principles.items || []).flatMap((_, index) => [
    required(`principles.items.${index}.title`, `Principle ${index + 1} title is required`),
    required(`principles.items.${index}.description`, `Principle ${index + 1} description is required`)
  ]);

  const steps = [
    {
      title: 'Hero & Intro',
      fields: [
        required('hero.eyebrow', 'Hero eyebrow is required'),
        required('hero.title', 'Hero title is required'),
        required('hero.lead', 'Hero lead is required'),
        imageRequired('hero.heroImage', 'Hero image is required'),
        required('introduction.title', 'Introduction title is required'),
        required('introduction.description', 'Introduction description is required'),
        countRequired('introduction.features', 4, 'Features'),
        ...featureFields
      ],
      render: () => (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}><WizardTextField path="hero.eyebrow" label="Hero Eyebrow" /></Grid>
          <Grid item xs={12} sm={8}><WizardTextField path="hero.title" label="Hero Title" /></Grid>
          <Grid item xs={12}><WizardTextField path="hero.lead" label="Hero Lead" multiline rows={3} /></Grid>
          <Grid item xs={12}><WizardImageUploader path="hero.heroImage" label="Hero Image" /></Grid>
          <Grid item xs={12} sm={6}><WizardTextField path="introduction.title" label="Introduction Title" /></Grid>
          <Grid item xs={12} sm={6}><WizardTextField path="introduction.description" label="Introduction Description" /></Grid>
          <Grid item xs={12}>
            <Button startIcon={<AddIcon />} onClick={addExactDefaults}>Prepare exact dynamic fields</Button>
          </Grid>
          {(formData.introduction.features || []).map((_, index) => (
            <Grid item xs={12} sm={6} key={index}><WizardTextField path={`introduction.features.${index}`} label={`Feature ${index + 1}`} /></Grid>
          ))}
        </Grid>
      )
    },
    {
      title: 'Categories & Tools',
      fields: [countRequired('categories', 5, 'Categories'), ...categoryFields],
      render: () => (
        <Grid container spacing={3}>
          <Grid item xs={12}><Button startIcon={<AddIcon />} onClick={addExactDefaults}>Prepare 5 categories and 4 tools each</Button></Grid>
          {(formData.categories || []).map((category, categoryIndex) => (
            <Grid item xs={12} key={categoryIndex}>
              <Card variant="outlined" sx={{ p: 2, borderColor: '#1e293b' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Category {categoryIndex + 1}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><WizardTextField path={`categories.${categoryIndex}.name`} label="Category Name" onValueChange={(value) => setArrayItem('categories', categoryIndex, { id: category.id || slugify(value) })} /></Grid>
                  <Grid item xs={12} sm={6}><WizardTextField path={`categories.${categoryIndex}.description`} label="Category Description" /></Grid>
                  <Grid item xs={12}><WizardImageUploader path={`categories.${categoryIndex}.logo`} label="Category Logo" /></Grid>
                  {(category.tools || []).map((_, toolIndex) => (
                    <Grid item xs={12} key={toolIndex}>
                      <Box sx={{ p: 2, border: '1px solid #1e293b', borderRadius: 1 }}>
                        <Typography sx={{ mb: 2, fontWeight: 800 }}>Tool {toolIndex + 1}</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}><WizardTextField path={`categories.${categoryIndex}.tools.${toolIndex}.name`} label="Tool Name" /></Grid>
                          <Grid item xs={12} sm={4}><WizardTextField path={`categories.${categoryIndex}.tools.${toolIndex}.description`} label="Tool Description" /></Grid>
                          <Grid item xs={12} sm={4}><WizardTextField path={`categories.${categoryIndex}.tools.${toolIndex}.useCase`} label="Tool Use Case" /></Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      )
    },
    {
      title: 'Principles',
      fields: [
        required('principles.title', 'Principles title is required'),
        required('principles.description', 'Principles description is required'),
        countRequired('principles.items', 4, 'Principles items'),
        ...principleFields
      ],
      render: () => (
        <Grid container spacing={3}>
          <Grid item xs={12}><Button startIcon={<AddIcon />} onClick={addExactDefaults}>Prepare 4 principles</Button></Grid>
          <Grid item xs={12} sm={6}><WizardTextField path="principles.title" label="Principles Title" /></Grid>
          <Grid item xs={12} sm={6}><WizardTextField path="principles.description" label="Principles Description" /></Grid>
          {(formData.principles.items || []).map((_, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <WizardTextField path={`principles.items.${index}.title`} label={`Principle ${index + 1} Title`} />
              <Box sx={{ mt: 2 }}><WizardTextField path={`principles.items.${index}.description`} label={`Principle ${index + 1} Description`} multiline rows={2} /></Box>
            </Grid>
          ))}
        </Grid>
      )
    },
    {
      title: 'CTA & SEO',
      fields: [
        required('cta.title', 'CTA title is required'),
        required('cta.description', 'CTA description is required'),
        required('cta.buttonText', 'CTA button text is required'),
        required('cta.secondaryButtonText', 'CTA secondary button text is required'),
        imageRequired('cta.backgroundImage', 'CTA background image is required'),
        ...seoFields
      ],
      render: () => (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}><WizardTextField path="cta.title" label="CTA Title" /></Grid>
          <Grid item xs={12} sm={6}><WizardTextField path="cta.description" label="CTA Description" /></Grid>
          <Grid item xs={12} sm={6}><WizardTextField path="cta.buttonText" label="CTA Button Text" /></Grid>
          <Grid item xs={12} sm={6}><WizardTextField path="cta.secondaryButtonText" label="CTA Secondary Button Text" /></Grid>
          <Grid item xs={12}><WizardImageUploader path="cta.backgroundImage" label="CTA Background Image" /></Grid>
          <Grid item xs={12}><WizardSEOFields includeCanonical={false} includeRobots={false} /></Grid>
        </Grid>
      )
    }
  ];

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
          Manage page sections, category logos, tools, visibility, and ordering.
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <FormWizard
            steps={steps}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            publishLabel="Publish Tech Stack"
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default TechStackManager;
