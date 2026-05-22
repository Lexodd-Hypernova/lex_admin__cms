import React, { createContext, useState, useContext } from 'react';
import api from '../utils/api.js';

const CMSContext = createContext(null);

export const CMSProvider = ({ children }) => {
  const [careerPage, setCareerPage] = useState(null);
  const [techStack, setTechStack] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [whitePapers, setWhitePapers] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  // Loading flags
  const [loading, setLoading] = useState({});

  const setItemLoading = (key, val) => {
    setLoading(prev => ({ ...prev, [key]: val }));
  };

  // ==========================================
  // DASHBOARD
  // ==========================================
  const fetchDashboardStats = async () => {
    setItemLoading('stats', true);
    try {
      const res = await api.get('/api/dashboard/stats');
      setDashboardStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setItemLoading('stats', false);
    }
  };

  // ==========================================
  // CAREER PAGE
  // ==========================================
  const fetchCareerPage = async () => {
    setItemLoading('career', true);
    try {
      const res = await api.get('/api/cms/career');
      setCareerPage(res.data);
    } catch (err) {
      console.error('Error fetching career page content:', err);
    } finally {
      setItemLoading('career', false);
    }
  };

  const saveCareerPage = async (data) => {
    try {
      const res = await api.put('/api/cms/career', data);
      setCareerPage(res.data);
      return res.data;
    } catch (err) {
      console.error('Error saving career page content:', err);
      throw err;
    }
  };

  const saveCareerPageSEO = async (seoData) => {
    try {
      const res = await api.put('/api/cms/careers/page/seo', seoData);
      setCareerPage(res.data);
      return res.data;
    } catch (err) {
      console.error('Error saving career page SEO:', err);
      throw err;
    }
  };

  // ==========================================
  // TECH STACK
  // ==========================================
  const fetchTechStack = async () => {
    setItemLoading('techStack', true);
    try {
      const res = await api.get('/api/cms/tech-stack');
      setTechStack(res.data);
    } catch (err) {
      console.error('Error fetching tech stack content:', err);
    } finally {
      setItemLoading('techStack', false);
    }
  };

  const saveTechStack = async (data) => {
    try {
      const res = await api.put('/api/cms/tech-stack', data);
      setTechStack(res.data);
      return res.data;
    } catch (err) {
      console.error('Error saving tech stack content:', err);
      throw err;
    }
  };

  const toggleTechStackVisibility = async () => {
    try {
      const res = await api.put('/api/cms/tech-stack/toggle-visibility');
      setTechStack(res.data);
      return res.data;
    } catch (err) {
      console.error('Error toggling tech stack visibility:', err);
      throw err;
    }
  };

  const saveTechStackSEO = async (seoData) => {
    try {
      const res = await api.put('/api/cms/tech-stack/seo', seoData);
      setTechStack(res.data);
      return res.data;
    } catch (err) {
      console.error('Error saving tech stack SEO:', err);
      throw err;
    }
  };

  // ==========================================
  // JOBS
  // ==========================================
  const fetchJobs = async () => {
    setItemLoading('jobs', true);
    try {
      const res = await api.get('/api/cms/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setItemLoading('jobs', false);
    }
  };

  const saveJob = async (jobData) => {
    try {
      if (jobData._id) {
        const res = await api.put(`/api/cms/jobs/${jobData._id}`, jobData);
        setJobs(prev => prev.map(j => j._id === jobData._id ? res.data : j));
        return res.data;
      } else {
        const res = await api.post('/api/cms/jobs', jobData);
        setJobs(prev => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      console.error('Error saving job:', err);
      throw err;
    }
  };

  const deleteJob = async (id) => {
    try {
      await api.delete(`/api/cms/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
    } catch (err) {
      console.error('Error deleting job:', err);
      throw err;
    }
  };

  const toggleJobVisibility = async (id) => {
    try {
      const res = await api.patch(`/api/cms/jobs/${id}/toggle`);
      setJobs(prev => prev.map(j => j._id === id ? { ...j, isVisible: res.data.isVisible } : j));
    } catch (err) {
      console.error('Error toggling job visibility:', err);
      throw err;
    }
  };

  // ==========================================
  // JOB APPLICATIONS
  // ==========================================
  const fetchApplications = async () => {
    setItemLoading('applications', true);
    try {
      const res = await api.get('/api/cms/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setItemLoading('applications', false);
    }
  };

  const updateApplicationStatus = async (id, status, notes) => {
    try {
      const res = await api.patch(`/api/cms/applications/${id}/status`, { status, notes });
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status: res.data.status, notes: res.data.notes, reviewedAt: res.data.reviewedAt } : app));
      return res.data;
    } catch (err) {
      console.error('Error updating application status:', err);
      throw err;
    }
  };

  const deleteApplication = async (id) => {
    try {
      await api.delete(`/api/cms/applications/${id}`);
      setApplications(prev => prev.filter(app => app._id !== id));
    } catch (err) {
      console.error('Error deleting application:', err);
      throw err;
    }
  };

  // ==========================================
  // CONTACTS
  // ==========================================
  const fetchContacts = async () => {
    setItemLoading('contacts', true);
    try {
      const res = await api.get('/api/cms/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    } finally {
      setItemLoading('contacts', false);
    }
  };

  const updateContactStatus = async (id, status, notes) => {
    try {
      const res = await api.patch(`/api/cms/contacts/${id}/status`, { status, notes });
      setContacts(prev => prev.map(c => c._id === id ? { ...c, status: res.data.status, notes: res.data.notes } : c));
      return res.data;
    } catch (err) {
      console.error('Error updating contact status:', err);
      throw err;
    }
  };

  const replyToContact = async (id, replyMessage) => {
    try {
      const res = await api.post(`/api/cms/contacts/${id}/reply`, { replyMessage });
      setContacts(prev => prev.map(c => c._id === id ? res.data.contact : c));
      return res.data;
    } catch (err) {
      console.error('Error replying to contact:', err);
      throw err;
    }
  };

  const deleteContact = async (id) => {
    try {
      await api.delete(`/api/cms/contacts/${id}`);
      setContacts(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
      throw err;
    }
  };

  // ==========================================
  // CASE STUDIES
  // ==========================================
  const fetchCaseStudies = async () => {
    setItemLoading('caseStudies', true);
    try {
      const res = await api.get('/api/cms/case-studies');
      setCaseStudies(res.data);
    } catch (err) {
      console.error('Error fetching case studies:', err);
    } finally {
      setItemLoading('caseStudies', false);
    }
  };

  const saveCaseStudy = async (csData) => {
    try {
      if (csData._id) {
        const res = await api.put(`/api/cms/case-studies/${csData._id}`, csData);
        setCaseStudies(prev => prev.map(c => c._id === csData._id ? res.data : c));
        return res.data;
      } else {
        const res = await api.post('/api/cms/case-studies', csData);
        setCaseStudies(prev => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      console.error('Error saving case study:', err);
      throw err;
    }
  };

  const deleteCaseStudy = async (id) => {
    try {
      await api.delete(`/api/cms/case-studies/${id}`);
      setCaseStudies(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error('Error deleting case study:', err);
      throw err;
    }
  };

  const toggleCaseStudyVisibility = async (id) => {
    try {
      const res = await api.patch(`/api/cms/case-studies/${id}/toggle`);
      setCaseStudies(prev => prev.map(c => c._id === id ? { ...c, isVisible: res.data.isVisible } : c));
    } catch (err) {
      console.error('Error toggling case study visibility:', err);
      throw err;
    }
  };

  // ==========================================
  // WHITE PAPERS
  // ==========================================
  const fetchWhitePapers = async () => {
    setItemLoading('whitePapers', true);
    try {
      const res = await api.get('/api/cms/white-papers');
      setWhitePapers(res.data);
    } catch (err) {
      console.error('Error fetching white papers:', err);
    } finally {
      setItemLoading('whitePapers', false);
    }
  };

  const saveWhitePaper = async (wpData) => {
    try {
      if (wpData._id) {
        const res = await api.put(`/api/cms/white-papers/${wpData._id}`, wpData);
        setWhitePapers(prev => prev.map(w => w._id === wpData._id ? res.data : w));
        return res.data;
      } else {
        const res = await api.post('/api/cms/white-papers', wpData);
        setWhitePapers(prev => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      console.error('Error saving white paper:', err);
      throw err;
    }
  };

  const deleteWhitePaper = async (id) => {
    try {
      await api.delete(`/api/cms/white-papers/${id}`);
      setWhitePapers(prev => prev.filter(w => w._id !== id));
    } catch (err) {
      console.error('Error deleting white paper:', err);
      throw err;
    }
  };

  const toggleWhitePaperVisibility = async (id) => {
    try {
      const res = await api.patch(`/api/cms/white-papers/${id}/toggle`);
      setWhitePapers(prev => prev.map(w => w._id === id ? { ...w, isVisible: res.data.isVisible } : w));
    } catch (err) {
      console.error('Error toggling white paper visibility:', err);
      throw err;
    }
  };

  // ==========================================
  // INDUSTRIES (With Cascade deletes!)
  // ==========================================
  const fetchIndustries = async () => {
    setItemLoading('industries', true);
    try {
      const res = await api.get('/api/cms/industries?showAll=true&full=true');
      setIndustries(res.data);
    } catch (err) {
      console.error('Error fetching industries:', err);
    } finally {
      setItemLoading('industries', false);
    }
  };

  const saveIndustry = async (indData) => {
    try {
      if (indData._id) {
        const res = await api.put(`/api/cms/industries/${indData._id}`, indData);
        setIndustries(prev => prev.map(i => i._id === indData._id ? res.data : i));
        return res.data;
      } else {
        const res = await api.post('/api/cms/industries', indData);
        setIndustries(prev => [...prev, res.data].sort((a,b) => a.orderIndex - b.orderIndex));
        return res.data;
      }
    } catch (err) {
      console.error('Error saving industry:', err);
      throw err;
    }
  };

  const deleteIndustry = async (id) => {
    try {
      const res = await api.delete(`/api/cms/industries/${id}`);
      // Remove deleted industry from state
      setIndustries(prev => prev.filter(i => i._id !== id));
      
      // Cascade delete is handled by backend. To keep local frontend state in sync without full reload,
      // let's fetch case studies and whitepapers again so they reflect the cascade deletions immediately!
      fetchCaseStudies();
      fetchWhitePapers();
      
      return res.data;
    } catch (err) {
      console.error('Error deleting industry:', err);
      throw err;
    }
  };

  const toggleIndustryVisibility = async (id) => {
    try {
      const res = await api.patch(`/api/cms/industries/${id}/toggle`);
      setIndustries(prev => prev.map(i => i._id === id ? { ...i, isVisible: res.data.isVisible } : i));
    } catch (err) {
      console.error('Error toggling industry visibility:', err);
      throw err;
    }
  };

  const saveContentSEO = async (pageType, id, seoData) => {
    try {
      const res = await api.put(`/api/cms/${pageType}/${id}/seo`, seoData);
      if (pageType === 'case-studies') {
        setCaseStudies(prev => prev.map(c => c._id === id ? res.data : c));
      }
      if (pageType === 'white-papers') {
        setWhitePapers(prev => prev.map(w => w._id === id ? res.data : w));
      }
      if (pageType === 'industries') {
        setIndustries(prev => prev.map(i => i._id === id ? res.data : i));
      }
      return res.data;
    } catch (err) {
      console.error('Error saving content SEO:', err);
      throw err;
    }
  };

  // ==========================================
  // FILE UPLOAD HELPERS
  // ==========================================
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.url;
    } catch (err) {
      console.error('Error uploading image:', err);
      const message = err.response?.data?.message || 'Image upload failed';
      throw new Error(message);
    }
  };

  return (
    <CMSContext.Provider value={{
      careerPage, fetchCareerPage, saveCareerPage, saveCareerPageSEO,
      techStack, fetchTechStack, saveTechStack, toggleTechStackVisibility, saveTechStackSEO,
      jobs, fetchJobs, saveJob, deleteJob, toggleJobVisibility,
      applications, fetchApplications, updateApplicationStatus, deleteApplication,
      contacts, fetchContacts, updateContactStatus, replyToContact, deleteContact,
      caseStudies, fetchCaseStudies, saveCaseStudy, deleteCaseStudy, toggleCaseStudyVisibility,
      whitePapers, fetchWhitePapers, saveWhitePaper, deleteWhitePaper, toggleWhitePaperVisibility,
      industries, fetchIndustries, saveIndustry, deleteIndustry, toggleIndustryVisibility,
      saveContentSEO,
      dashboardStats, fetchDashboardStats,
      uploadImage,
      loading
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
