import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Box,
  Chip,
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
    if (onToggleWatchlist && isAuthenticated) {
      onToggleWatchlist(coin.id);
    }
  };

  return (
    <Card
      className="h-full transition-all duration-200 hover:shadow-lg"
      sx={{
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent className="p-6">
        {/* Header with icon, name and watchlist button */}
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center space-x-3">
            <Avatar
              src={coin.image}
              alt={coin.name}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography
                variant="h6"
                component="h3"
                className="font-semibold text-base leading-tight"
              >
                {coin.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="uppercase text-sm"
              >
                {coin.symbol}
              </Typography>
            </Box>
          </Box>

          {isAuthenticated && (
            <IconButton
              onClick={handleWatchlistToggle}
              size="small"
              aria-label={
                isInWatchlist
                  ? t('dashboard.removeFromWatchlist')
                  : t('dashboard.addToWatchlist')
              }
            >
              {isInWatchlist ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          )}
        </Box>

        {/* Price */}
        <Typography
          variant="h5"
          component="div"
          className="font-bold mb-2"
        >
          {formatPrice(coin.current_price)}
        </Typography>

        {/* 24h Change */}
        <Chip
          label={formatPercentage(coin.price_change_percentage_24h)}
          color={getPercentageColor(coin.price_change_percentage_24h)}
          size="small"
          className="font-medium"
        />

        {/* Additional Info */}
        <Box className="mt-4 space-y-2">
          <Box className="flex justify-between items-center">
            <Typography variant="body2" color="text.secondary">
              {t('dashboard.marketCap')}
            </Typography>
            <Typography variant="body2" className="font-medium">
              ${coin.market_cap?.toLocaleString() || 'N/A'}
            </Typography>
          </Box>
          
          <Box className="flex justify-between items-center">
            <Typography variant="body2" color="text.secondary">
              {t('dashboard.volume')}
            </Typography>
            <Typography variant="body2" className="font-medium">
              ${coin.total_volume?.toLocaleString() || 'N/A'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoinCard; 