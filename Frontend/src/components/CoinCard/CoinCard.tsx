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
      className="h-full transition-all duration-200 hover:shadow-lg cursor-pointer"
      sx={{
        position: 'relative',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent className="p-4 md:p-6">
        {/* Header with icon, name and watchlist button */}
        <Box className="flex items-start justify-between mb-3">
          <Box className="flex items-center space-x-3 min-w-0 flex-1">
            <Avatar
              src={coin.image}
              alt={coin.name}
              sx={{ width: { xs: 36, md: 40 }, height: { xs: 36, md: 40 } }}
              className="flex-shrink-0"
            />
            <Box className="min-w-0 flex-1">
              <Typography
                variant="h6"
                component="h3"
                className="font-semibold text-sm md:text-base leading-tight truncate"
              >
                {coin.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="uppercase text-xs md:text-sm font-medium"
              >
                {coin.symbol}
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={handleWatchlistToggle}
            size="small"
            className="flex-shrink-0 ml-2"
            aria-label={
              isInWatchlist
                ? t('dashboard.removeFromWatchlist')
                : t('dashboard.addToWatchlist')
            }
          >
            {isInWatchlist ? (
              <FavoriteIcon color="error" fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            )}
          </IconButton>
        </Box>

        {/* Price */}
        <Typography
          variant="h5"
          component="div"
          className="font-bold mb-2 text-lg md:text-xl"
        >
          {formatPrice(coin.current_price)}
        </Typography>

        {/* 24h Change */}
        <Box className="flex items-center">
          <Chip
            label={formatPercentage(coin.price_change_percentage_24h)}
            color={getPercentageColor(coin.price_change_percentage_24h)}
            size="small"
            sx={{
              fontWeight: 'medium',
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoinCard; 