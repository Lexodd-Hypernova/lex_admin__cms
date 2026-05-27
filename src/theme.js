import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A51FC1',
      light: '#C53BE3',
      dark: '#8F1AA6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#A51FC1',
      light: '#C53BE3',
      dark: '#8F1AA6',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0B0B0D',
      paper: '#141418',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#D1D1D6',
      disabled: '#A3A3B0',
    },
    divider: '#27272F',
    error: {
      main: '#EF4444',
    },
    warning: {
      main: '#F59E0B',
    },
    info: {
      main: '#3B82F6',
    },
    success: {
      main: '#10B981',
    },
  },
  typography: {
    fontFamily: '"Inter", "IBM Plex Sans", sans-serif',
    h1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontFamily: '"Inter", sans-serif',
    },
  },
  shape: {
    borderRadius: 6,
  },
  shadows: ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0B0B0D',
          fontFamily: '"Inter", sans-serif',
        },
        'input[type="date"]::-webkit-calendar-picker-indicator': {
          cursor: 'pointer',
          filter: 'invert(1) brightness(1.8)',
          opacity: 0.75,
        },
        'input[type="date"]::-webkit-calendar-picker-indicator:hover': {
          opacity: 1,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          padding: '6px 16px',
          fontWeight: 500,
          fontSize: '0.8125rem',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#A51FC1',
          '&:hover': {
            backgroundColor: '#C53BE3',
          },
        },
        outlinedPrimary: {
          borderColor: '#A51FC1',
          '&:hover': {
            borderColor: '#C53BE3',
            backgroundColor: 'rgba(165, 31, 193, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#141418',
          borderRadius: '8px',
          border: '1px solid #27272F',
          boxShadow: 'none',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 20px',
          borderBottom: '1px solid #27272F',
        },
        title: {
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px',
          '&:last-child': {
            paddingBottom: '20px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#141418',
          backgroundImage: 'none',
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: 'none',
          border: '1px solid #27272F',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0B0B0D',
          borderBottom: '1px solid #27272F',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0B0B0D',
          borderRight: '1px solid #27272F',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#141418',
          borderRadius: '8px',
          border: '1px solid #27272F',
          boxShadow: 'none',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '16px 20px',
          borderBottom: '1px solid #27272F',
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '12px 20px',
          borderTop: '1px solid #27272F',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#0B0B0D',
            borderRadius: '6px',
            '& fieldset': {
              borderColor: '#27272F',
            },
            '&:hover fieldset': {
              borderColor: '#3A3A44',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#A51FC1',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#A3A3B0',
            '&.Mui-focused': {
              color: '#A51FC1',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #27272F',
          padding: '10px 16px',
        },
        head: {
          backgroundColor: '#141418',
          fontWeight: 600,
          color: '#D1D1D6',
          fontSize: '0.75rem',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 500,
          height: '24px',
        },
        colorPrimary: {
          backgroundColor: 'rgba(165, 31, 193, 0.1)',
          color: '#A51FC1',
        },
        colorSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#10B981',
        },
        colorError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#EF4444',
        },
        colorWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: '#F59E0B',
        },
        colorInfo: {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          color: '#3B82F6',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#27272F',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: '32px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(165, 31, 193, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(165, 31, 193, 0.12)',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: '40px',
          '&.Mui-selected': {
            color: '#A51FC1',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#A51FC1',
          height: 2,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          border: '1px solid',
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          borderColor: 'rgba(16, 185, 129, 0.15)',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          borderColor: 'rgba(239, 68, 68, 0.15)',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          borderColor: 'rgba(245, 158, 11, 0.15)',
        },
        standardInfo: {
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderColor: 'rgba(59, 130, 246, 0.15)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#27272F',
          color: '#D1D1D6',
          fontSize: '0.75rem',
          borderRadius: '4px',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#A51FC1',
            '& + .MuiSwitch-track': {
              backgroundColor: '#A51FC1',
            },
          },
        },
        track: {
          backgroundColor: '#3A3A44',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#3A3A44',
          '&.Mui-checked': {
            color: '#A51FC1',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#3A3A44',
          '&.Mui-checked': {
            color: '#A51FC1',
          },
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        li: {
          color: '#A3A3B0',
          fontSize: '0.75rem',
          '&:last-child': {
            color: '#D1D1D6',
          },
        },
        separator: {
          color: '#3A3A44',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        ul: {
          '& .MuiPaginationItem-root': {
            color: '#D1D1D6',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            '&.Mui-selected': {
              backgroundColor: '#A51FC1',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#C53BE3',
              },
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#A51FC1',
          width: '32px',
          height: '32px',
          fontSize: '14px',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: '#27272F',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            minWidth: '280px',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#0B0B0D',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#0B0B0D',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#27272F',
          },
        },
      },
    },
  },
});

export default theme;
