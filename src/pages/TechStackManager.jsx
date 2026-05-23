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
  Switch,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ImageUploader from '../components/ImageUploader.jsx';
import SEOFields from '../components/SEOFields.jsx';

const emptyImage = { url: '', alt: '', placeholder: '' };

const defaultTechStack = {
  isVisible: true,
  isActive: true,
  hero: { eyebrow: '', title: '', lead: '', heroImage: emptyImage, isVisible: true },
  introduction: { title: '', description: '', features: [], isVisible: true },
  categories: [],
  principles: { title: '', description: '', isVisible: true, items: [] },
  cta: { title: '', description: '', buttonText: '', secondaryButtonText: '', backgroundImage: emptyImage, isVisible: true },
  seo: { metaTitle: '', metaDescription: '', metaKeywords: [], ogTitle: '', ogDescription: '', ogImage: {}, canonicalUrl: '', robots: 'index,follow' }
};

const imageValue = (image) => (typeof image === 'string' ? image : image?.url || '');
const imageObject = (url, existing = {}) => ({ ...(typeof existing === 'object' ? existing : {}), url });
const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const visibleValue = (value) => value !== false;

const VisibilityBadge = ({ isVisible }) => (
  <Chip
    size="small"
    label={visibleValue(isVisible) ? 'Visible' : 'Hidden'}
    color={visibleValue(isVisible) ? 'success' : 'default'}
    variant={visibleValue(isVisible) ? 'filled' : 'outlined'}
  />
);

const moveItem = (items, fromIndex, toIndex) => {
  if (toIndex < 0 || toIndex >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next.map((entry, index) => ({ ...entry, orderIndex: index }));
};

const normalizeStack = (stack) => {
  const source = stack || defaultTechStack;
  return {
    ...defaultTechStack,
    ...source,
    hero: { ...defaultTechStack.hero, ...(source.hero || {}), heroImage: source.hero?.heroImage || emptyImage },
    introduction: { ...defaultTechStack.introduction, ...(source.introduction || {}) },
    categories: (source.categories || []).map((category, categoryIndex) => ({
      _id: category._id,
      id: category.id || slugify(category.name || `category-${categoryIndex + 1}`),
      name: category.name || '',
      description: category.description || '',
      logo: category.logo || emptyImage,
      isVisible: category.isVisible !== false,
      orderIndex: category.orderIndex ?? categoryIndex,
      tools: (category.tools || []).map((tool, toolIndex) => ({
        _id: tool._id,
        name: tool.name || '',
        description: tool.description || tool.benefit || '',
        useCase: tool.useCase || '',
        isVisible: tool.isVisible !== false,
        orderIndex: tool.orderIndex ?? toolIndex
      }))
    })).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)),
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
      })).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    },
    cta: { ...defaultTechStack.cta, ...(source.cta || {}), backgroundImage: source.cta?.backgroundImage || emptyImage },
    seo: source.seo || defaultTechStack.seo
  };
};

const TechStackManager = () => {
  const { techStack, fetchTechStack, saveTechStack, loading } = useCMS();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState(defaultTechStack);

  useEffect(() => {
    fetchTechStack();
  }, []);

  useEffect(() => {
    if (techStack) setFormData(normalizeStack(techStack));
  }, [techStack]);

  const setField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const setSection = (section, value) => setFormData((prev) => ({ ...prev, [section]: { ...prev[section], ...value } }));

  const updateCategory = (categoryIndex, updates) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((category, index) => (
        index === categoryIndex
          ? { ...category, ...updates, id: updates.name && !category.id ? slugify(updates.name) : category.id }
          : category
      ))
    }));
  };

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        { id: `category-${prev.categories.length + 1}`, name: 'New Category', description: '', logo: emptyImage, isVisible: true, orderIndex: prev.categories.length, tools: [] }
      ]
    }));
  };

  const deleteCategory = (categoryIndex) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, index) => index !== categoryIndex).map((category, index) => ({ ...category, orderIndex: index }))
    }));
  };

  const moveCategory = (categoryIndex, direction) => {
    setFormData((prev) => ({ ...prev, categories: moveItem(prev.categories, categoryIndex, categoryIndex + direction) }));
  };

  const updateTool = (categoryIndex, toolIndex, updates) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((category, index) => {
        if (index !== categoryIndex) return category;
        return {
          ...category,
          tools: category.tools.map((tool, tIndex) => (tIndex === toolIndex ? { ...tool, ...updates } : tool))
        };
      })
    }));
  };

  const addTool = (categoryIndex) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((category, index) => {
        if (index !== categoryIndex) return category;
        return {
          ...category,
          tools: [...category.tools, { name: 'New Tool', description: '', useCase: '', isVisible: true, orderIndex: category.tools.length }]
        };
      })
    }));
  };

  const deleteTool = (categoryIndex, toolIndex) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((category, index) => {
        if (index !== categoryIndex) return category;
        return { ...category, tools: category.tools.filter((_, tIndex) => tIndex !== toolIndex).map((tool, nextIndex) => ({ ...tool, orderIndex: nextIndex })) };
      })
    }));
  };

  const moveTool = (categoryIndex, toolIndex, direction) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((category, index) => (
        index === categoryIndex ? { ...category, tools: moveItem(category.tools, toolIndex, toolIndex + direction) } : category
      ))
    }));
  };

  const updatePrinciple = (principleIndex, updates) => {
    setFormData((prev) => ({
      ...prev,
      principles: {
        ...prev.principles,
        items: prev.principles.items.map((item, index) => (index === principleIndex ? { ...item, ...updates } : item))
      }
    }));
  };

  const addPrinciple = () => {
    setFormData((prev) => ({
      ...prev,
      principles: {
        ...prev.principles,
        items: [...prev.principles.items, { number: String(prev.principles.items.length + 1).padStart(2, '0'), title: '', description: '', isVisible: true, orderIndex: prev.principles.items.length }]
      }
    }));
  };

  const deletePrinciple = (principleIndex) => {
    setFormData((prev) => ({
      ...prev,
      principles: {
        ...prev.principles,
        items: prev.principles.items.filter((_, index) => index !== principleIndex).map((item, index) => ({ ...item, orderIndex: index }))
      }
    }));
  };

  const movePrinciple = (principleIndex, direction) => {
    setFormData((prev) => ({
      ...prev,
      principles: { ...prev.principles, items: moveItem(prev.principles.items, principleIndex, principleIndex + direction) }
    }));
  };

  const handleCategoryDrop = (event, toIndex) => {
    const fromIndex = Number(event.dataTransfer.getData('categoryIndex'));
    if (!Number.isInteger(fromIndex)) return;
    setFormData((prev) => ({ ...prev, categories: moveItem(prev.categories, fromIndex, toIndex) }));
  };

  const handleToolDrop = (event, categoryIndex, toIndex) => {
    const source = event.dataTransfer.getData('toolIndex').split(':').map(Number);
    const [fromCategoryIndex, fromToolIndex] = source;
    if (fromCategoryIndex !== categoryIndex || !Number.isInteger(fromToolIndex)) return;
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((category, index) => (
        index === categoryIndex ? { ...category, tools: moveItem(category.tools, fromToolIndex, toIndex) } : category
      ))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveTechStack(formData);
      alert('Tech Stack configuration updated successfully!');
    } catch (err) {
      alert('Failed to update Tech Stack settings.');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>
            Tech Stack Configurator
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Manage page sections, category logos, tools, visibility, and ordering.
          </Typography>
        </Box>
        <FormControlLabel
          control={<Switch checked={formData.isVisible !== false} onChange={(e) => setField('isVisible', e.target.checked)} color="secondary" />}
          label="Page Visible"
        />
      </Box>

      <Card>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ px: 3, borderBottom: '1px solid #1e293b' }}>
          <Tab label="1. Sections" />
          <Tab label="2. Categories & Tools" />
          <Tab label="3. Principles & CTA" />
          <Tab label="4. SEO" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          <CardContent sx={{ minHeight: 300, p: 4 }}>
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch checked={formData.hero.isVisible !== false} onChange={(e) => setSection('hero', { isVisible: e.target.checked })} />}
                    label="Show Hero Section"
                  />
                </Grid>
                {formData.hero.isVisible !== false && (
                  <>
                    <Grid item xs={12} sm={4}><TextField label="Hero Eyebrow" value={formData.hero.eyebrow} onChange={(e) => setSection('hero', { eyebrow: e.target.value })} fullWidth /></Grid>
                    <Grid item xs={12} sm={8}><TextField label="Hero Title" value={formData.hero.title} onChange={(e) => setSection('hero', { title: e.target.value })} fullWidth /></Grid>
                    <Grid item xs={12}><TextField label="Hero Lead" multiline rows={3} value={formData.hero.lead} onChange={(e) => setSection('hero', { lead: e.target.value })} fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><ImageUploader label="Hero Image" value={imageValue(formData.hero.heroImage)} onChange={(url) => setSection('hero', { heroImage: imageObject(url, formData.hero.heroImage) })} /></Grid>
                  </>
                )}

                <Grid item xs={12}><Divider sx={{ borderColor: '#1e293b' }} /></Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch checked={formData.introduction.isVisible !== false} onChange={(e) => setSection('introduction', { isVisible: e.target.checked })} />}
                    label="Show Introduction Section"
                  />
                </Grid>
                {formData.introduction.isVisible !== false && (
                  <>
                    <Grid item xs={12} sm={6}><TextField label="Introduction Title" value={formData.introduction.title} onChange={(e) => setSection('introduction', { title: e.target.value })} fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Introduction Description" value={formData.introduction.description} onChange={(e) => setSection('introduction', { description: e.target.value })} fullWidth /></Grid>
                    <Grid item xs={12}><TextField label="Features (one per line)" multiline rows={5} value={(formData.introduction.features || []).join('\n')} onChange={(e) => setSection('introduction', { features: e.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })} fullWidth /></Grid>
                  </>
                )}
              </Grid>
            )}

            {activeTab === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {formData.categories.map((category, categoryIndex) => (
                  <Accordion
                    key={category._id || category.id || categoryIndex}
                    defaultExpanded={categoryIndex === 0}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData('categoryIndex', String(categoryIndex))}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleCategoryDrop(event, categoryIndex)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <VisibilityBadge isVisible={category.isVisible} />
                        <Typography sx={{ fontWeight: 700, flex: 1 }}>{category.name || 'Untitled Category'}</Typography>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); moveCategory(categoryIndex, -1); }} disabled={categoryIndex === 0}><ArrowUpwardIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); moveCategory(categoryIndex, 1); }} disabled={categoryIndex === formData.categories.length - 1}><ArrowDownwardIcon fontSize="small" /></IconButton>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControlLabel control={<Switch checked={category.isVisible !== false} onChange={(e) => updateCategory(categoryIndex, { isVisible: e.target.checked })} />} label="Category Visible" />
                        </Grid>
                        <Grid item xs={12} sm={6}><TextField label="Category Name" value={category.name} onChange={(e) => updateCategory(categoryIndex, { name: e.target.value, id: category.id || slugify(e.target.value) })} fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Category ID" value={category.id} onChange={(e) => updateCategory(categoryIndex, { id: slugify(e.target.value) })} fullWidth /></Grid>
                        <Grid item xs={12}><TextField label="Description" multiline rows={3} value={category.description} onChange={(e) => updateCategory(categoryIndex, { description: e.target.value })} fullWidth /></Grid>
                        <Grid item xs={12}><ImageUploader label="Category Logo" value={imageValue(category.logo)} onChange={(url) => updateCategory(categoryIndex, { logo: imageObject(url, category.logo) })} /></Grid>

                        <Grid item xs={12}><Divider sx={{ borderColor: '#1e293b', my: 1 }} /></Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">Tools</Typography>
                          <Button startIcon={<AddIcon />} onClick={() => addTool(categoryIndex)}>Add Tool</Button>
                        </Grid>
                        {category.tools.map((tool, toolIndex) => (
                          <Grid item xs={12} key={tool._id || toolIndex}>
                            <Card
                              variant="outlined"
                              draggable
                              onDragStart={(event) => event.dataTransfer.setData('toolIndex', `${categoryIndex}:${toolIndex}`)}
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={(event) => handleToolDrop(event, categoryIndex, toolIndex)}
                              sx={{ p: 2, borderColor: '#1e293b', cursor: 'grab' }}
                            >
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <Switch checked={tool.isVisible !== false} onChange={(e) => updateTool(categoryIndex, toolIndex, { isVisible: e.target.checked })} />
                                  <VisibilityBadge isVisible={tool.isVisible} />
                                </Grid>
                                <Grid item xs={12} md={5}><TextField label="Tool Name" value={tool.name} onChange={(e) => updateTool(categoryIndex, toolIndex, { name: e.target.value })} fullWidth /></Grid>
                                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                  <IconButton onClick={() => moveTool(categoryIndex, toolIndex, -1)} disabled={toolIndex === 0}><ArrowUpwardIcon /></IconButton>
                                  <IconButton onClick={() => moveTool(categoryIndex, toolIndex, 1)} disabled={toolIndex === category.tools.length - 1}><ArrowDownwardIcon /></IconButton>
                                  <IconButton color="error" onClick={() => deleteTool(categoryIndex, toolIndex)}><DeleteOutlineIcon /></IconButton>
                                </Grid>
                                <Grid item xs={12}><TextField label="Description" multiline rows={2} value={tool.description} onChange={(e) => updateTool(categoryIndex, toolIndex, { description: e.target.value })} fullWidth /></Grid>
                                <Grid item xs={12}><TextField label="Use Case" multiline rows={2} value={tool.useCase} onChange={(e) => updateTool(categoryIndex, toolIndex, { useCase: e.target.value })} fullWidth /></Grid>
                              </Grid>
                            </Card>
                          </Grid>
                        ))}
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={() => deleteCategory(categoryIndex)}>Delete Category</Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
                <Button variant="outlined" startIcon={<AddIcon />} onClick={addCategory}>Add Category</Button>
              </Box>
            )}

            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch checked={formData.principles.isVisible !== false} onChange={(e) => setSection('principles', { isVisible: e.target.checked })} />} label="Show Principles Section" />
                </Grid>
                {formData.principles.isVisible !== false && (
                  <>
                    <Grid item xs={12} sm={6}><TextField label="Principles Title" value={formData.principles.title} onChange={(e) => setSection('principles', { title: e.target.value })} fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Principles Description" value={formData.principles.description} onChange={(e) => setSection('principles', { description: e.target.value })} fullWidth /></Grid>
                    <Grid item xs={12}><Button startIcon={<AddIcon />} onClick={addPrinciple}>Add Principle</Button></Grid>
                    {formData.principles.items.map((item, index) => (
                      <Grid item xs={12} key={item._id || index}>
                        <Card variant="outlined" sx={{ p: 2, borderColor: '#1e293b' }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={2}><Switch checked={item.isVisible !== false} onChange={(e) => updatePrinciple(index, { isVisible: e.target.checked })} /> <VisibilityBadge isVisible={item.isVisible} /></Grid>
                            <Grid item xs={12} md={2}><TextField label="Number" value={item.number} onChange={(e) => updatePrinciple(index, { number: e.target.value })} fullWidth /></Grid>
                            <Grid item xs={12} md={5}><TextField label="Title" value={item.title} onChange={(e) => updatePrinciple(index, { title: e.target.value })} fullWidth /></Grid>
                            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <IconButton onClick={() => movePrinciple(index, -1)} disabled={index === 0}><ArrowUpwardIcon /></IconButton>
                              <IconButton onClick={() => movePrinciple(index, 1)} disabled={index === formData.principles.items.length - 1}><ArrowDownwardIcon /></IconButton>
                              <IconButton color="error" onClick={() => deletePrinciple(index)}><DeleteOutlineIcon /></IconButton>
                            </Grid>
                            <Grid item xs={12}><TextField label="Description" multiline rows={2} value={item.description} onChange={(e) => updatePrinciple(index, { description: e.target.value })} fullWidth /></Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    ))}
                  </>
                )}

                <Grid item xs={12}><Divider sx={{ borderColor: '#1e293b' }} /></Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch checked={formData.cta.isVisible !== false} onChange={(e) => setSection('cta', { isVisible: e.target.checked })} />} label="Show CTA Section" />
                </Grid>
                {formData.cta.isVisible !== false && (
                  <>
                    <Grid item xs={12} sm={6}><TextField label="CTA Title" value={formData.cta.title} onChange={(e) => setSection('cta', { title: e.target.value })} fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="CTA Description" value={formData.cta.description} onChange={(e) => setSection('cta', { description: e.target.value })} fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Primary Button Text" value={formData.cta.buttonText} onChange={(e) => setSection('cta', { buttonText: e.target.value })} fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Secondary Button Text" value={formData.cta.secondaryButtonText} onChange={(e) => setSection('cta', { secondaryButtonText: e.target.value })} fullWidth /></Grid>
                    <Grid item xs={12}><ImageUploader label="CTA Background Image" value={imageValue(formData.cta.backgroundImage)} onChange={(url) => setSection('cta', { backgroundImage: imageObject(url, formData.cta.backgroundImage) })} /></Grid>
                  </>
                )}
              </Grid>
            )}

            {activeTab === 3 && (
              <SEOFields value={formData.seo} onChange={(seo) => setField('seo', seo)} />
            )}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="secondary" startIcon={<SaveIcon />} size="large">
                Save Stack Configuration
              </Button>
            </Box>
          </CardContent>
        </form>
      </Card>
    </Box>
  );
};

export default TechStackManager;
