import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PublishIcon from '@mui/icons-material/Publish';

const WizardContext = createContext(null);

const empty = (value) => {
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'boolean') return false;
  if (value === 0) return false;
  if (value == null) return true;
  if (typeof value === 'object') return !value.url;
  return String(value).trim() === '';
};

export const getNestedValue = (source, path) => {
  if (!path) return source;
  return path.split('.').reduce((value, key) => value?.[key], source);
};

export const setNestedValue = (source, path, value) => {
  const keys = path.split('.');
  const clone = Array.isArray(source) ? [...source] : { ...source };
  let cursor = clone;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }

    const nextKey = keys[index + 1];
    const shouldBeArray = /^\d+$/.test(nextKey);
    cursor[key] = Array.isArray(cursor[key])
      ? [...cursor[key]]
      : shouldBeArray
        ? [...(cursor[key] || [])]
        : { ...(cursor[key] || {}) };
    cursor = cursor[key];
  });

  return clone;
};

export const validateRequiredField = (field, value) => {
  if (field.validate) return field.validate(value);
  if (field.type === 'boolean') return typeof value === 'boolean' ? '' : field.message;
  if (field.type === 'array') return Array.isArray(value) && value.length >= (field.min || 1) ? '' : field.message;
  if (field.type === 'lines') {
    const lines = String(value || '').split('\n').map((line) => line.trim()).filter(Boolean);
    return lines.length >= (field.min || 1) ? '' : field.message;
  }
  if (field.type === 'image') {
    const url = typeof value === 'string' ? value : value?.url;
    return empty(url) ? field.message : '';
  }
  return empty(value) ? field.message : '';
};

const flattenFields = (steps) => steps.flatMap((step, stepIndex) => (
  (step.fields || []).map((field) => ({ ...field, stepIndex }))
));

export const getWizardStats = (steps, formData) => {
  const fields = flattenFields(steps);
  const stepStats = steps.map((step) => {
    const stepFields = step.fields || [];
    const filled = stepFields.filter((field) => !validateRequiredField(field, getNestedValue(formData, field.path))).length;
    return { total: stepFields.length, filled, missing: stepFields.length - filled, complete: stepFields.length > 0 && filled === stepFields.length };
  });
  const filled = fields.filter((field) => !validateRequiredField(field, getNestedValue(formData, field.path))).length;
  return { fields, stepStats, filled, total: fields.length, missing: fields.length - filled, complete: fields.length > 0 && filled === fields.length };
};

export const getWizardMissingMessages = (steps, formData) => {
  return flattenFields(steps)
    .map((field) => {
      const error = validateRequiredField(field, getNestedValue(formData, field.path));
      return error ? `${field.label || field.path}: ${error}` : '';
    })
    .filter(Boolean);
};

export const useWizardForm = (formData, setFormData) => {
  const [errors, setErrors] = useState({});

  const setFieldValue = (path, value) => {
    setFormData((prev) => setNestedValue(prev, path, value));
    setErrors((prev) => ({ ...prev, [path]: '' }));
  };

  const blurField = (field) => {
    const error = validateRequiredField(field, getNestedValue(formData, field.path));
    setErrors((prev) => ({ ...prev, [field.path]: error }));
  };

  return { errors, setErrors, setFieldValue, blurField };
};

export const useWizardContext = () => {
  const context = useContext(WizardContext);
  if (!context) throw new Error('Wizard fields must be rendered inside FormWizard');
  return context;
};

const StatusChip = ({ complete, missing, visited }) => {
  if (complete) {
    return <Chip size="small" label="Complete" sx={{ bgcolor: 'rgba(34,197,94,0.14)', color: '#86efac', fontWeight: 700 }} />;
  }
  if (!visited) {
    return <Chip size="small" label="Pending" sx={{ bgcolor: 'rgba(148,163,184,0.12)', color: '#cbd5e1', fontWeight: 700 }} />;
  }
  return <Chip size="small" label={`${missing} missing`} sx={{ bgcolor: 'rgba(245,158,11,0.14)', color: '#fbbf24', fontWeight: 700 }} />;
};

const StepIndicator = ({ steps, currentStep, setCurrentStep, stepStats, visitedSteps }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: `repeat(${steps.length}, 1fr)` }, gap: 1.5 }}>
    {steps.map((step, index) => {
      const stats = stepStats[index];
      const active = currentStep === index;
      return (
        <Button
          key={step.title}
          onClick={() => setCurrentStep(index)}
          sx={{
            p: 1.5,
            minHeight: 92,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            border: `1px solid ${active ? '#818cf8' : '#1e293b'}`,
            bgcolor: active ? 'rgba(129,140,248,0.12)' : 'rgba(15,23,42,0.52)',
            color: '#e2e8f0',
            textAlign: 'left'
          }}
        >
          <Stack spacing={1} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor: stats.complete ? '#22c55e' : active ? '#6366f1' : '#334155',
                color: '#fff',
                fontWeight: 800
              }}>
                {stats.complete ? '✓' : index + 1}
              </Box>
              <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>{step.title}</Typography>
            </Box>
            <StatusChip complete={stats.complete} missing={stats.missing} visited={visitedSteps[index]} />
          </Stack>
        </Button>
      );
    })}
  </Box>
);

const ProgressSummary = ({ steps, stepStats, filled, total }) => {
  const percent = total ? Math.round((filled / total) * 100) : 0;
  return (
    <Box sx={{ p: 2, border: '1px solid #1e293b', bgcolor: 'rgba(15,23,42,0.5)', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1 }}>
        <Typography sx={{ fontWeight: 800 }}>Overall Progress: {percent}% complete</Typography>
        <Typography sx={{ color: '#cbd5e1' }}>({filled} of {total} fields filled)</Typography>
      </Box>
      <LinearProgress variant="determinate" value={percent} sx={{ height: 9, borderRadius: 5, bgcolor: '#1e293b', '& .MuiLinearProgress-bar': { bgcolor: percent === 100 ? '#22c55e' : '#818cf8' } }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1, mt: 2 }}>
        {steps.map((step, index) => (
          <Typography key={step.title} variant="body2" sx={{ color: '#cbd5e1' }}>
            {step.title}: {stepStats[index].complete ? '✓' : stepStats[index].missing ? '!' : '○'} {stepStats[index].filled}/{stepStats[index].total} fields complete
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export const WizardStatusPanel = ({ steps, formData }) => {
  const { stepStats, filled, total } = getWizardStats(steps, formData);
  return <ProgressSummary steps={steps} stepStats={stepStats} filled={filled} total={total} />;
};

const FormWizard = ({ steps, formData, setFormData, onSubmit, publishLabel = 'Publish' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState({ 0: true });
  const wizardForm = useWizardForm(formData, setFormData);
  const fields = useMemo(() => flattenFields(steps), [steps]);
  const { stepStats, filled, missing, complete: publishEnabled } = getWizardStats(steps, formData);
  const current = steps[currentStep];

  const jumpTo = (index) => {
    setCurrentStep(index);
    setVisitedSteps((prev) => ({ ...prev, [index]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!publishEnabled) return;
    onSubmit(event);
  };

  const context = {
    formData,
    errors: wizardForm.errors,
    setFieldValue: wizardForm.setFieldValue,
    blurField: wizardForm.blurField,
    fieldsByPath: Object.fromEntries(fields.map((field) => [field.path, field]))
  };

  return (
    <WizardContext.Provider value={context}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={jumpTo}
            stepStats={stepStats}
            visitedSteps={visitedSteps}
          />
          <ProgressSummary steps={steps} stepStats={stepStats} filled={filled} total={fields.length} />
          <Box sx={{ minHeight: 360 }}>
            {current.render()}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, pt: 1 }}>
            <Button startIcon={<NavigateBeforeIcon />} onClick={() => jumpTo(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button variant="contained" endIcon={<NavigateNextIcon />} onClick={() => jumpTo(Math.min(steps.length - 1, currentStep + 1))}>
                Next
              </Button>
            ) : (
              <Tooltip title={publishEnabled ? 'All fields complete! Ready to publish' : `Complete all ${missing} missing fields across all steps to publish`}>
                <span>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<PublishIcon />}
                    disabled={!publishEnabled}
                    sx={{ opacity: publishEnabled ? 1 : 0.5 }}
                  >
                    {publishLabel}
                  </Button>
                </span>
              </Tooltip>
            )}
          </Box>
        </Stack>
      </Box>
    </WizardContext.Provider>
  );
};

export default FormWizard;
