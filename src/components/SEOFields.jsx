import React from 'react';
import { Grid, MenuItem, TextField } from '@mui/material';
import ImageUploader from './ImageUploader.jsx';

const robotsOptions = ['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow'];

const SEOFields = ({ value, onChange }) => {
  const seo = value || {};
  const setField = (field, fieldValue) => onChange({ ...seo, [field]: fieldValue });

  return (
    <Grid container spacing={3} sx={{ mt: 0.5 }}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Meta Title"
          helperText={`${seo.metaTitle?.length || 0}/60 characters`}
          value={seo.metaTitle || ''}
          onChange={(e) => setField('metaTitle', e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Canonical URL"
          value={seo.canonicalUrl || ''}
          onChange={(e) => setField('canonicalUrl', e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Meta Description"
          helperText={`${seo.metaDescription?.length || 0}/160 characters`}
          multiline
          rows={3}
          value={seo.metaDescription || ''}
          onChange={(e) => setField('metaDescription', e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Meta Keywords"
          helperText="Comma-separated keywords"
          value={Array.isArray(seo.metaKeywords) ? seo.metaKeywords.join(', ') : seo.metaKeywords || ''}
          onChange={(e) => setField('metaKeywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="OG Title"
          value={seo.ogTitle || ''}
          onChange={(e) => setField('ogTitle', e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Robots"
          value={seo.robots || 'index,follow'}
          onChange={(e) => setField('robots', e.target.value)}
          fullWidth
        >
          {robotsOptions.map(option => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="OG Description"
          multiline
          rows={3}
          value={seo.ogDescription || ''}
          onChange={(e) => setField('ogDescription', e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <ImageUploader
          label="OG Image"
          value={seo.ogImage?.url || ''}
          onChange={(url) => setField('ogImage', { ...(seo.ogImage || {}), url })}
        />
      </Grid>
    </Grid>
  );
};

export default SEOFields;
