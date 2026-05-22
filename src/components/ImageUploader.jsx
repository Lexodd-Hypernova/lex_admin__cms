import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, LinearProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../utils/api.js';

const humanFileSize = (size) => {
  if (!size) return '';
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(1) * 1 + ['B', 'kB', 'MB', 'GB'][i];
};

const isPreviewableImage = (fileOrUrl) => {
  if (!fileOrUrl) return false;
  if (typeof fileOrUrl === 'string') {
    return /\.(jpe?g|png|webp)(\?.*)?$/i.test(fileOrUrl);
  }
  return typeof fileOrUrl.type === 'string' && fileOrUrl.type.startsWith('image/');
};

const getDisplayUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('/')) return `${api.defaults.baseURL}${url}`;
  return url;
};

const ImageUploader = ({ value, onChange, label = 'Upload Image', accept = 'image/jpeg,image/png,image/webp', maxSize = 5 * 1024 * 1024, field = 'image' }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedKey, setUploadedKey] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    // if external value changes, clear stored key
    if (!value) setUploadedKey(null);
  }, [value]);

  const handleFile = (f) => {
    setError('');
    if (!f) return;
    if (f.size > maxSize) {
      setError(`File is too large. Maximum allowed is ${humanFileSize(maxSize)}`);
      return;
    }
    const allowed = accept.split(',');
    if (!allowed.includes(f.type)) {
      setError('Unsupported file type');
      return;
    }
    setFile(f);
    setShowConfirm(true);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleChoose = (e) => {
    const f = e.target.files && e.target.files[0];
    handleFile(f);
  };

  const startUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError('');
    try {
      const endpoint = field === 'cv' ? '/api/upload/cv' : '/api/upload/image';
      const formData = new FormData();
      formData.append(field, file);
      const uploadRes = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      });
      const { url, key } = uploadRes.data;
      setUploadedKey(key || null);
      setProgress(100);
      setUploading(false);
      setShowConfirm(false);
      setFile(null);
      setPreview(null);
      onChange(url, key);
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || err.message || 'Upload failed');
    }
  };

  const handleDelete = async () => {
    setError('');
    try {
      // try to extract key from uploadedKey or from value url
      const key = uploadedKey || (() => {
        if (!value) return null;
        try {
          const url = new URL(value);
          return url.pathname.replace(/^\/uploads\//, '').replace(/^\//, '');
        } catch (e) {
          return null;
        }
      })();
      if (key) await api.delete('/api/upload/image', { data: { key } });
      setUploadedKey(null);
      onChange('');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>

      <Box
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
      >
        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
          Choose File
          <input ref={inputRef} hidden accept={accept} type="file" onChange={handleChoose} />
        </Button>
        {value && !preview && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isPreviewableImage(value) ? (
              <img src={getDisplayUrl(value)} alt="uploaded" style={{ height: 56, width: 56, objectFit: 'cover', borderRadius: 6 }} />
            ) : (
              <Box sx={{ width: 56, height: 56, display: 'grid', placeItems: 'center', borderRadius: 2, backgroundColor: '#1f2937' }}>
                <Typography variant="caption" sx={{ color: '#cbd5e1' }}>FILE</Typography>
              </Box>
            )}
            <Typography variant="body2">Stored</Typography>
            <IconButton onClick={handleDelete} color="error" size="small"><DeleteIcon /></IconButton>
            <IconButton onClick={() => inputRef.current?.click()} size="small"><RefreshIcon /></IconButton>
          </Box>
        )}

        {preview && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isPreviewableImage(file) ? (
              <img src={preview} alt="preview" style={{ height: 56, width: 56, objectFit: 'cover', borderRadius: 6 }} />
            ) : (
              <Box sx={{ width: 56, height: 56, display: 'grid', placeItems: 'center', borderRadius: 2, backgroundColor: '#1f2937' }}>
                <Typography variant="caption" sx={{ color: '#cbd5e1' }}>FILE</Typography>
              </Box>
            )}
            <Box>
              <Typography variant="body2">{file?.name}</Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>{humanFileSize(file?.size)}</Typography>
            </Box>
            <Button size="small" onClick={() => setShowConfirm(true)}>Confirm</Button>
            <IconButton onClick={() => { setFile(null); setPreview(null); }} size="small"><DeleteIcon /></IconButton>
          </Box>
        )}

      </Box>

      {uploading && <Box sx={{ mt: 1 }}><LinearProgress variant="determinate" value={progress} /></Box>}
      {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}

      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogTitle>Confirm Upload</DialogTitle>
        <DialogContent>
          {preview && isPreviewableImage(file) && <img src={preview} alt="confirm" style={{ maxWidth: '100%', borderRadius: 6 }} />}
          {file && <Typography sx={{ mt: 1 }}>{file.name} — {humanFileSize(file.size)}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button onClick={startUpload} variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageUploader;
