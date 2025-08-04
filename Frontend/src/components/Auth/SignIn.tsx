import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordMinLength');
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
    
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error: unknown) {
      console.error('Login error:', error);
      if ((error as { response?: { status?: number } })?.response?.status === 401) {
        setApiError(t('auth.loginError'));
      } else {
        setApiError(t('auth.genericError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
              }}
            >
              {t('auth.signInTitle')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
            >
              {t('auth.signInSubtitle')}
            </Typography>
          </Box>

          {apiError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth.email')}
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label={t('auth.password')}
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.5,
                mb: 3,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  {t('auth.signingIn')}
                </Box>
              ) : (
                t('auth.signInButton')
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('auth.noAccount')}{' '}
                <Link
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {t('auth.signUp')}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignIn; 