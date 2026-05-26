import React, { useEffect } from 'react';
import { useCMS } from '../context/CMSContext.jsx';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Paper,
  Divider,
  Button
} from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#f43f5e', '#a855f7'];

const DashboardHome = () => {
  const { dashboardStats, fetchDashboardStats, loading } = useCMS();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading.stats || !dashboardStats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Contacts',
      value: dashboardStats.totalContacts,
      subtext: `${dashboardStats.newContacts} new / unread`,
      icon: <MailOutlineIcon sx={{ color: '#6366f1', fontSize: 32 }} />,
      bgColor: 'rgba(99, 102, 241, 0.1)',
      borderColor: 'rgba(99, 102, 241, 0.2)',
      path: '/contacts'
    },
    {
      title: 'Job Applications',
      value: dashboardStats.totalApplications,
      subtext: `${dashboardStats.pendingApplications} pending review`,
      icon: <AssignmentIndIcon sx={{ color: '#10b981', fontSize: 32 }} />,
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.2)',
      path: '/applications'
    },
    {
      title: 'Job Postings',
      value: `${dashboardStats.publishedJobs} / ${dashboardStats.totalJobs}`,
      subtext: 'Active / Total in Careers',
      icon: <WorkOutlineIcon sx={{ color: '#f59e0b', fontSize: 32 }} />,
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.2)',
      path: '/jobs'
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Welcome Banner */}
      <Box>
        <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, gutterBottom: true }}>
          Analytics Overview
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Real-time metrics, form submissions, and active CMS listings.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card
              onClick={() => navigate(card.path)}
              sx={{
                cursor: 'pointer',
                borderColor: card.borderColor,
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: 'primary.light',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)'
                }
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600, mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', mb: 0.5 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                    {card.subtext}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: '12px', bgcolor: card.bgColor }}>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts section */}
      <Grid container spacing={3}>
        {/* Applications by Status */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: 380 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: '"Outfit", sans-serif' }}>
                Applications Status Breakdown
              </Typography>
              {dashboardStats.applicationsByStatus.length > 0 ? (
                <Box sx={{ height: 260, display: 'flex', alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardStats.applicationsByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dashboardStats.applicationsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f1424', border: '1px solid #1e293b', borderRadius: '8px' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: '#475569' }}>No application data recorded.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Contacts by Industry */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: 380 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: '"Outfit", sans-serif' }}>
                Contact Forms by Sector
              </Typography>
              {dashboardStats.contactsByIndustry.length > 0 ? (
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardStats.contactsByIndustry}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f1424', border: '1px solid #1e293b', borderRadius: '8px' }}
                        cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                      />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                        {dashboardStats.contactsByIndustry.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: '#475569' }}>No contact inquiries received.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent submissions list */}
      <Grid container spacing={3}>
        {/* Recent Inquiries */}
        <Grid item xs={12} md={6}>
          <Card sx={{ minHeight: 400 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
                  Recent Inquiries
                </Typography>
                <Button endIcon={<ChevronRightIcon />} onClick={() => navigate('/contacts')} color="primary" size="small">
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {dashboardStats.recentContacts.length > 0 ? (
                <List disablePadding>
                  {dashboardStats.recentContacts.map((contact, index) => (
                    <Paper
                      key={contact._id}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        mb: index !== dashboardStats.recentContacts.length - 1 ? 1.5 : 0,
                        backgroundColor: '#070a13',
                        border: '1px solid #1e293b',
                        borderRadius: '10px'
                      }}
                    >
                      <ListItem disablePadding secondaryAction={
                        <Chip
                          label={contact.status}
                          size="small"
                          color={
                            contact.status === 'new' ? 'warning' :
                            contact.status === 'replied' ? 'success' : 'default'
                          }
                          sx={{ fontWeight: 'bold', fontSize: 10 }}
                        />
                      }>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                            {contact.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                              {contact.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {contact.company || 'Private'} • {contact.industry}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography sx={{ color: '#475569' }}>No recent inquiries.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Applications */}
        <Grid item xs={12} md={6}>
          <Card sx={{ minHeight: 400 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
                  Recent Applications
                </Typography>
                <Button endIcon={<ChevronRightIcon />} onClick={() => navigate('/applications')} color="primary" size="small">
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {dashboardStats.recentApplications.length > 0 ? (
                <List disablePadding>
                  {dashboardStats.recentApplications.map((app, index) => (
                    <Paper
                      key={app._id}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        mb: index !== dashboardStats.recentApplications.length - 1 ? 1.5 : 0,
                        backgroundColor: '#070a13',
                        border: '1px solid #1e293b',
                        borderRadius: '10px'
                      }}
                    >
                      <ListItem disablePadding secondaryAction={
                        <Chip
                          label={app.status}
                          size="small"
                          color={
                            app.status === 'pending' ? 'warning' :
                            app.status === 'hired' ? 'success' :
                            app.status === 'rejected' ? 'error' : 'info'
                          }
                          sx={{ fontWeight: 'bold', fontSize: 10 }}
                        />
                      }>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                            {app.firstName.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                              {app.firstName} {app.lastName}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Applying for: <span style={{ color: '#818cf8', fontWeight: 600 }}>{app.jobTitle}</span>
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography sx={{ color: '#475569' }}>No applications received yet.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
