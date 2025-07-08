import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Box,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useTranslation } from 'react-i18next';
import type { CryptoData } from '../../types/crypto';

interface CoinCardProps {
  coin: CryptoData;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (coinId: string) => void;
  isAuthenticated?: boolean;
}

const CoinCard: React.FC<CoinCardProps> = ({
  coin,
  isInWatchlist = false,
  onToggleWatchlist,
  isAuthenticated = false,
}) => {
  const { t } = useTranslation();
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  const formatPrice = (price: number): string => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    }
    return `$${price.toFixed(6)}`;
  };

  const formatPercentage = (percentage: number): string => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const getPercentageColor = (percentage: number): 'success' | 'error' => {
    return percentage >= 0 ? 'success' : 'error';
  };

  const handleWatchlistToggle = () => {
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      return;
    }
    
    if (onToggleWatchlist) {
      onToggleWatchlist(coin.id);
    }
  };

  const handleCloseAlert = () => {
    setShowAuthAlert(false);
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: 1,
          borderColor: 'divider',
          borderRadius: 3,
          bgcolor: 'background.paper',
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 2,
            borderColor: 'primary.main',
          },
        }}
      >
        <CardContent sx={{ p: 3, pb: 3, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
              <Avatar
                src={coin.image}
                alt={coin.name}
                sx={{ width: 48, height: 48 }}
              />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '1.1rem',
                    mb: 0.5,
                    color: 'text.primary'
                  }}
                  noWrap
                >
                  {coin.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  {coin.symbol}
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={handleWatchlistToggle}
              size="small"
              sx={{
                ml: 1,
                '&:hover': {
                  bgcolor: isInWatchlist ? 'error.light' : 'action.hover',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
              aria-label={
                isInWatchlist
                  ? t('dashboard.removeFromWatchlist')
                  : t('dashboard.addToWatchlist')
              }
            >
              {isInWatchlist ? (
                <FavoriteIcon sx={{ color: 'error.main', fontSize: '1.2rem' }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
              )}
            </IconButton>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: '1.5rem',
                mb: 1
              }}
            >
              {formatPrice(coin.current_price)}
            </Typography>
          </Box>

          <Box>
            <Chip
              label={formatPercentage(coin.price_change_percentage_24h)}
              color={getPercentageColor(coin.price_change_percentage_24h)}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 28,
                borderRadius: 2,
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={showAuthAlert}
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
    </>
  );
};

export default CoinCard; 