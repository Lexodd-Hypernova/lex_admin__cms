import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import ImageUploader from './ImageUploader.jsx';
import { getNestedValue, useWizardContext } from './FormWizard.jsx';

const helper = (error, fallback = ' ') => error || fallback;
const robotsOptions = ['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow'];

export const WizardTextField = ({ path, helperText = ' ', onValueChange, ...props }) => {
  const { formData, errors, setFieldValue, blurField, fieldsByPath } = useWizardContext();
  const field = fieldsByPath[path] || { path, message: `${props.label || 'Field'} is required` };
  const value = getNestedValue(formData, path) ?? '';

  return (
    <TextField
      {...props}
      required
      value={value}
      error={!!errors[path]}
      helperText={helper(errors[path], helperText)}
      onChange={(event) => {
        const next = props.type === 'number' ? Number(event.target.value) : event.target.value;
        setFieldValue(path, next);
        onValueChange?.(next, event);
      }}
      onBlur={() => blurField(field)}
      fullWidth
    />
  );
};

export const WizardSelect = ({ path, label, children, onValueChange, ...props }) => {
  const { formData, errors, setFieldValue, blurField, fieldsByPath } = useWizardContext();
  const field = fieldsByPath[path] || { path, message: `Please select ${label}` };
  const value = getNestedValue(formData, path) ?? (props.multiple ? [] : '');

  return (
    <FormControl fullWidth required error={!!errors[path]}>
      <InputLabel>{label}</InputLabel>
      <Select
        {...props}
        label={label}
        value={value}
        onChange={(event) => {
          setFieldValue(path, event.target.value);
          onValueChange?.(event.target.value, event);
        }}
        onBlur={() => blurField(field)}
      >
        {children}
      </Select>
      <FormHelperText>{helper(errors[path])}</FormHelperText>
    </FormControl>
  );
};

export const WizardSwitch = ({ path, label, color = 'primary' }) => {
  const { formData, setFieldValue } = useWizardContext();
  return (
    <FormControlLabel
      control={
        <Switch
          checked={getNestedValue(formData, path) !== false}
          onChange={(event) => setFieldValue(path, event.target.checked)}
          color={color}
        />
      }
      label={label}
    />
  );
};

export const WizardImageUploader = ({ path, label, ...props }) => {
  const { formData, errors, setFieldValue, blurField, fieldsByPath } = useWizardContext();
  const field = fieldsByPath[path] || { path, message: `${label} is required`, type: 'image' };
  const value = getNestedValue(formData, path);
  const url = typeof value === 'string' ? value : value?.url || '';

  return (
    <Box onBlur={() => blurField(field)}>
      <ImageUploader
        {...props}
        label={label}
        value={url}
        onChange={(nextUrl) => {
          const nextValue = typeof value === 'object' && value !== null ? { ...value, url: nextUrl } : nextUrl;
          setFieldValue(path, nextValue);
        }}
      />
      <Typography variant="caption" color={errors[path] ? 'error' : 'transparent'} sx={{ display: 'block', mt: 0.75, minHeight: 20 }}>
        {errors[path] || ' '}
      </Typography>
    </Box>
  );
};

export const menuItems = (items, getValue, getLabel) => items.map((item) => (
  <MenuItem key={getValue(item)} value={getValue(item)}>
    {getLabel(item)}
  </MenuItem>
));

export const WizardSEOFields = ({ basePath = 'seo', includeCanonical = true, includeRobots = true }) => (
  <>
    <GridShim>
      <WizardTextField path={`${basePath}.metaTitle`} label="Meta Title" />
      {includeCanonical && <WizardTextField path={`${basePath}.canonicalUrl`} label="Canonical URL" />}
      <Full><WizardTextField path={`${basePath}.metaDescription`} label="Meta Description" multiline rows={3} /></Full>
      <Full><WizardKeywordsField path={`${basePath}.metaKeywords`} label="Meta Keywords" /></Full>
      <WizardTextField path={`${basePath}.ogTitle`} label="OG Title" />
      {includeRobots && (
        <WizardSelect path={`${basePath}.robots`} label="Robots">
          {robotsOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
        </WizardSelect>
      )}
      <Full><WizardTextField path={`${basePath}.ogDescription`} label="OG Description" multiline rows={3} /></Full>
      <Full><WizardImageUploader path={`${basePath}.ogImage`} label="OG Image" /></Full>
    </GridShim>
  </>
);

const WizardKeywordsField = ({ path, label }) => {
  const { formData, errors, setFieldValue, blurField, fieldsByPath } = useWizardContext();
  const field = fieldsByPath[path] || { path, message: 'At least one keyword is required', type: 'array', min: 1 };
  const value = getNestedValue(formData, path);

  return (
    <TextField
      label={label}
      required
      value={Array.isArray(value) ? value.join(', ') : value || ''}
      onChange={(event) => setFieldValue(path, event.target.value.split(',').map((item) => item.trim()).filter(Boolean))}
      onBlur={() => blurField(field)}
      error={!!errors[path]}
      helperText={helper(errors[path], 'Comma-separated keywords')}
      fullWidth
    />
  );
};

const GridShim = ({ children }) => {
  const normalized = React.Children.toArray(children).filter(Boolean);
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
      {normalized}
    </Box>
  );
};

const Full = ({ children }) => <Box sx={{ gridColumn: '1 / -1' }}>{children}</Box>;
