import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import { useTranslation } from 'react-i18next';
import ThemeToggleSwitch from "../ThemeToggle/ThemeToggle";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";

interface User {
  email: string;
  id: string;
}

export default function Header() {
  const { t } = useTranslation();
  
  // Mock authentication state - replace with actual auth context later
  const isAuthenticated = false;
  const user: User | null = null;

  const handleSignIn = () => {
    // TODO: Implement sign in functionality
    console.log('Sign in clicked');
  };

  const handleSignOut = () => {
    // TODO: Implement sign out functionality
    console.log('Sign out clicked');
  };

  return (
    <header>
      <AppBar position="sticky" elevation={1}>
        <Toolbar className="px-4 md:px-6 lg:px-8 min-h-[64px]">
          {/* Logo */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1 }}
            className="font-bold text-lg md:text-xl"
          >
            {t('header.appName')}
          </Typography>

          {/* Desktop Navigation */}
          <Box className="hidden md:flex items-center space-x-2">
            <ThemeToggleSwitch />
            <LanguageDropdown />
            
            {isAuthenticated ? (
              <Box className="flex items-center space-x-2 ml-4">
                <IconButton size="small">
                  <Avatar sx={{ width: 32, height: 32 }}>
                    U
                  </Avatar>
                </IconButton>
                <Button 
                  color="inherit" 
                  onClick={handleSignOut}
                  className="normal-case"
                  size="small"
                >
                  {t('header.signOut')}
                </Button>
              </Box>
            ) : (
              <Button
                color="inherit"
                startIcon={<LoginIcon />}
                onClick={handleSignIn}
                className="ml-4 normal-case border border-current"
                variant="outlined"
                size="small"
              >
                {t('header.signIn')}
              </Button>
            )}
          </Box>

          {/* Mobile Navigation */}
          <Box className="flex md:hidden items-center space-x-1">
            <ThemeToggleSwitch />
            <LanguageDropdown />
            {!isAuthenticated && (
              <IconButton 
                color="inherit" 
                onClick={handleSignIn}
                aria-label={t('header.signIn')}
                size="small"
              >
                <LoginIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </header>
  );
};