import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A51FC1', // Your accent color
      light: '#C53BE3',
      dark: '#8F1AA6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#A51FC1', // Using same accent for secondary
      light: '#C53BE3',
      dark: '#8F1AA6',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0B0B0D', // Your --bg-dark
      paper: '#141418',   // Your --surface / --s1
    },
    text: {
      primary: '#FFFFFF',   // Your --text-light / --tp
      secondary: '#D1D1D6', // Your --text-muted / --ts
      disabled: '#A3A3B0',  // Your --text-tertiary / --tt
    },
    divider: '#27272F', // Your --border
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    grey: {
      50: '#0B0B0D',
      100: '#141418',
      200: '#18181D',
      300: '#27272F',
      400: '#3A3A44',
      500: '#D1D1D6',
      600: '#A3A3B0',
      700: '#FFFFFF',
      800: '#FFFFFF',
      900: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Syne", "IBM Plex Sans", "Inter", sans-serif',
    h1: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h5: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"IBM Plex Sans", sans-serif',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: '"IBM Plex Sans", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"IBM Plex Sans", sans-serif',
      fontSize: '0.875rem',
    },
    body2: {
      fontFamily: '"IBM Plex Sans", sans-serif',
      fontSize: '0.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: '"Syne", sans-serif',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 30px 60px -15px rgba(0, 0, 0, 0.3)',
    '0 35px 70px -20px rgba(0, 0, 0, 0.35)',
    '0 40px 80px -25px rgba(0, 0, 0, 0.4)',
    '0 45px 90px -30px rgba(0, 0, 0, 0.45)',
    '0 50px 100px -35px rgba(0, 0, 0, 0.5)',
    '0 55px 110px -40px rgba(0, 0, 0, 0.55)',
    '0 60px 120px -45px rgba(0, 0, 0, 0.6)',
    '0 65px 130px -50px rgba(0, 0, 0, 0.65)',
    '0 70px 140px -55px rgba(0, 0, 0, 0.7)',
    '0 75px 150px -60px rgba(0, 0, 0, 0.75)',
    '0 80px 160px -65px rgba(0, 0, 0, 0.8)',
    '0 85px 170px -70px rgba(0, 0, 0, 0.85)',
    '0 90px 180px -75px rgba(0, 0, 0, 0.9)',
    '0 95px 190px -80px rgba(0, 0, 0, 0.95)',
    '0 100px 200px -85px rgba(0, 0, 0, 1)',
    '0 105px 210px -90px rgba(0, 0, 0, 1)',
    '0 110px 220px -95px rgba(0, 0, 0, 1)',
    '0 115px 230px -100px rgba(0, 0, 0, 1)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0B0B0D',
          fontFamily: '"IBM Plex Sans", sans-serif',
        },
        '#root': {
          backgroundColor: '#0B0B0D',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          padding: '8px 20px',
          transition: 'all 0.2s ease',
          fontWeight: 600,
          fontSize: '0.8125rem',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          backgroundColor: '#A51FC1',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#C53BE3',
            boxShadow: '0 2px 8px rgba(165, 31, 193, 0.3)',
          },
        },
        outlinedPrimary: {
          borderColor: '#A51FC1',
          '&:hover': {
            borderColor: '#C53BE3',
            backgroundColor: 'rgba(165, 31, 193, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#141418',
          borderRadius: '12px',
          border: '1px solid #27272F',
          boxShadow: 'none',
          transition: 'border-color 0.2s ease, transform 0.2s ease',
          '&:hover': {
            borderColor: '#3A3A44',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #27272F',
          padding: '16px 24px',
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 600,
          fontFamily: '"Syne", sans-serif',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#141418',
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: 'none',
          border: '1px solid #27272F',
        },
        elevation2: {
          boxShadow: 'none',
          border: '1px solid #27272F',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#141418',
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
          borderRadius: '12px',
          border: '1px solid #27272F',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #27272F',
          padding: '16px 24px',
          fontSize: '1.125rem',
          fontWeight: 600,
          fontFamily: '"Syne", sans-serif',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #27272F',
          padding: '16px 24px',
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
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #27272F',
          padding: '12px 16px',
        },
        head: {
          backgroundColor: '#141418',
          fontWeight: 600,
          color: '#D1D1D6',
          fontFamily: '"Syne", sans-serif',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
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
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: 'rgba(165, 31, 193, 0.12)',
          color: '#A51FC1',
        },
        colorSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          color: '#10B981',
        },
        colorError: {
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          color: '#EF4444',
        },
        colorWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          color: '#F59E0B',
        },
        colorInfo: {
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
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
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: '#141418',
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
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(165, 31, 193, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(165, 31, 193, 0.18)',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: '"Syne", sans-serif',
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
          borderRadius: '8px',
          border: '1px solid',
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          borderColor: 'rgba(16, 185, 129, 0.2)',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          borderColor: 'rgba(239, 68, 68, 0.2)',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          borderColor: 'rgba(245, 158, 11, 0.2)',
        },
        standardInfo: {
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          borderColor: 'rgba(59, 130, 246, 0.2)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#27272F',
          color: '#D1D1D6',
          fontSize: '0.75rem',
          borderRadius: '6px',
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
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        ol: {
          alignItems: 'center',
        },
        li: {
          color: '#A3A3B0',
          '&:last-child': {
            color: '#D1D1D6',
            fontWeight: 500,
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
          backgroundColor: 'rgba(11, 11, 13, 0.8)',
          backdropFilter: 'blur(4px)',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            minWidth: '300px',
          },
        },
      },
    },
  },
});

export default theme;