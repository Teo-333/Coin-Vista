import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Avatar,
  Alert,
  Snackbar,
} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggleSwitch from "../ThemeToggle/ThemeToggle";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";
  
const BitcoinLogo = () => (
  <svg
  width="28"
  height="28"
  viewBox="0 0 256 256"
  fill="currentColor"
  style={{ marginRight: 8 }}
  xmlns="http://www.w3.org/2000/svg"
>
  <circle
    cx="128"
    cy="128"
    r="128"
    fill="#f7931a"
  />

  <text
    x="50%"
    y="50%"
    textAnchor="middle"
    dominantBaseline="middle"
    fontFamily="Arial, Helvetica, sans-serif"
    fontSize="160"
    fontWeight="bold"
    fill="#ffffff"
  >
    ₿
  </text>
</svg>
);

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showSignInAlert, setShowSignInAlert] = useState(false);

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignOut = () => {
    logout();
  };

  const handleWatchlistClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      setShowSignInAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowSignInAlert(false);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3, lg: 4 }, minHeight: 64 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexGrow: 1 
          }}
        >
          <BitcoinLogo />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              color: 'text.primary',
              fontWeight: 700,
              fontSize: { xs: '1.125rem', md: '1.25rem' }
            }}
          >
            {t('header.appName')}
          </Typography>
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}
        >
          <ThemeToggleSwitch />
          <LanguageDropdown />
          
          <IconButton
            onClick={handleWatchlistClick}
            size="small"
            sx={{
              color: 'text.primary',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              ml: 1,
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.main'
              }
            }}
            aria-label="Watchlist"
          >
            <FavoriteIcon fontSize="small" />
          </IconButton>
          
          {isAuthenticated ? (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                ml: 1 
              }}
            >
              <IconButton size="small">
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user?.email.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Button 
                sx={{ 
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
                onClick={handleSignOut}
                size="small"
              >
                {t('header.signOut')}
              </Button>
            </Box>
          ) : (
            <Button
              sx={{ 
                color: 'text.primary',
                borderColor: 'text.primary',
                ml: 1,
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
              startIcon={<LoginIcon />}
              onClick={handleSignIn}
              variant="outlined"
              size="small"
            >
              <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {t('header.signIn')}
              </Box>
            </Button>
          )}
        </Box>

        <Snackbar
          open={showSignInAlert}
          autoHideDuration={4000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseAlert} 
            severity="info" 
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {t('alerts.signInRequired')}
          </Alert>
        </Snackbar>
      </Toolbar>
    </AppBar>
  );
};