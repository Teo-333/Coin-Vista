import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import cryptoService from '../../services/cryptoService';
import authService from '../../services/authService';
import CoinCard from '../CoinCard/CoinCard';
import type { CryptoData } from '../../types/crypto';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [watchlistCoins, setWatchlistCoins] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordMessage, setResetPasswordMessage] = useState('');
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  const fetchWatchlistData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get watchlist coin IDs
      const watchlistData = await cryptoService.getWatchlist();
      
      if (watchlistData.length > 0) {
        // Get coin data for watchlist items
        const coinsData = await cryptoService.getCoins({
          ids: watchlistData.join(','),
          vs_currency: 'usd',
          price_change_percentage: '24h',
        });
        setWatchlistCoins(coinsData);
      } else {
        setWatchlistCoins([]);
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWatchlist = async (coinId: string) => {
    try {
      const result = await cryptoService.toggleWatchlist(coinId);
      
      if (result.action === 'removed') {
        setWatchlistCoins(prev => prev.filter(coin => coin.id !== coinId));
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      setResetPasswordMessage('No email found. Please sign in again.');
      setShowResetSuccess(true);
      return;
    }
    
    try {
      setResetPasswordLoading(true);
      setResetPasswordMessage('');
      
      console.log('Sending password reset email to:', user.email);
      
      const response = await authService.forgotPassword(user.email);
      console.log('Reset password response:', response);
      
      setResetPasswordMessage(
        `Password reset link has been sent to ${user.email}. Please check your email and follow the instructions to reset your password.`
      );
      setShowResetSuccess(true);
    } catch (err: unknown) {
      console.error('Error sending reset password email:', err);
      
      let errorMessage = 'Failed to send reset password email. ';
      
      const error = err as { response?: { status?: number; data?: { error?: string } }; message?: string };
      
      if (error.response?.status === 400) {
        errorMessage += 'Invalid email address.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. Please try again later.';
      } else if (error.response?.data?.error) {
        errorMessage += error.response.data.error;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please check your internet connection and try again.';
      }
      
      setResetPasswordMessage(errorMessage);
      setShowResetSuccess(true);
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleCloseResetMessage = () => {
    setShowResetSuccess(false);
    setResetPasswordMessage('');
  };

  useEffect(() => {
    if (user) {
      fetchWatchlistData();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: 1,
            borderColor: 'divider',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 600,
              }}
            >
              {user.email.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Profile
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {user.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  {t('header.signOut')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleResetPassword}
                  disabled={resetPasswordLoading}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  {resetPasswordLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      Sending...
                    </Box>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 3,
            }}
          >
            My Watchlist ({watchlistCoins.length})
          </Typography>
          
          {loading ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
              }}
            >
              <CircularProgress size={48} sx={{ mb: 3 }} />
              <Typography variant="body1" color="text.secondary">
                Loading your watchlist...
              </Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          ) : watchlistCoins.length > 0 ? (
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)'
                },
                gap: 3
              }}
            >
              {watchlistCoins.map((coin) => (
                <CoinCard
                  key={coin.id}
                  coin={coin}
                  isInWatchlist={true}
                  onToggleWatchlist={handleToggleWatchlist}
                  isAuthenticated={true}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
              }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Your watchlist is empty
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Add coins to your watchlist from the dashboard
              </Typography>
            </Box>
          )}
        </Paper>

        <Snackbar
          open={showResetSuccess}
          autoHideDuration={8000}
          onClose={handleCloseResetMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseResetMessage} 
            severity={resetPasswordMessage.includes('successfully') ? 'success' : 'error'} 
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {resetPasswordMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Profile; 