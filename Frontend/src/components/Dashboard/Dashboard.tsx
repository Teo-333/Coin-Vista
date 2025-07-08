import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import CoinCard from '../CoinCard/CoinCard';
import cryptoService from '../../services/cryptoService';
import type { CryptoData } from '../../types/crypto';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [coins, setCoins] = useState<CryptoData[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Mock authentication state - replace with actual auth context later
  const [isAuthenticated] = useState(false);

  const featuredCoins = [
    'bitcoin',
    'ethereum', 
    'cardano',
    'solana',
    'polkadot',
    'chainlink'
  ];

  const fetchCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const coinsData = await cryptoService.getCoins({
        ids: featuredCoins.join(','),
        vs_currency: 'usd',
        price_change_percentage: '24h',
      });
      
      setCoins(coinsData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching coins:', err);
      setError(t('dashboard.error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    if (!isAuthenticated) return;
    
    try {
      const watchlistData = await cryptoService.getWatchlist();
      setWatchlist(watchlistData);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    }
  };

  const handleToggleWatchlist = async (coinId: string) => {
    if (!isAuthenticated) return;

    try {
      const result = await cryptoService.toggleWatchlist(coinId);
      
      if (result.action === 'added') {
        setWatchlist(prev => [...prev, coinId]);
      } else {
        setWatchlist(prev => prev.filter(id => id !== coinId));
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err);
    }
  };

  const handleRefresh = () => {
    fetchCoins();
    if (isAuthenticated) {
      fetchWatchlist();
    }
  };

  useEffect(() => {
    fetchCoins();
    if (isAuthenticated) {
      fetchWatchlist();
    }

    // Set up auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchCoins();
    }, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const formatLastUpdated = (date: Date): string => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Container maxWidth="xl" className="px-4 py-6 md:py-8">
      {/* Header Section */}
      <Box className="mb-6 md:mb-8">
        <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-2xl md:text-3xl lg:text-4xl"
          >
            {t('dashboard.title')}
          </Typography>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            size="small"
            className="self-start sm:self-auto"
          >
            {t('dashboard.retry')}
          </Button>
        </Box>

        {lastUpdated && (
          <Typography
            variant="body2"
            color="text.secondary"
            className="mb-4"
          >
            {t('dashboard.lastUpdated', { 
              time: formatLastUpdated(lastUpdated) 
            })}
          </Typography>
        )}
      </Box>

      {/* Error State */}
      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={handleRefresh}>
              {t('dashboard.retry')}
            </Button>
          }
          className="mb-6"
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && coins.length === 0 && (
        <Box className="flex flex-col items-center justify-center py-12">
          <CircularProgress size={48} className="mb-4" />
          <Typography variant="body1" color="text.secondary">
            {t('dashboard.loading')}
          </Typography>
        </Box>
      )}

      {/* Coins Grid */}
      {!loading && coins.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {coins.map((coin) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              isInWatchlist={watchlist.includes(coin.id)}
              onToggleWatchlist={handleToggleWatchlist}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}

      {/* No Data State */}
      {!loading && coins.length === 0 && !error && (
        <Box className="flex flex-col items-center justify-center py-12">
          <Typography variant="h6" color="text.secondary" className="mb-4">
            {t('dashboard.noData')}
          </Typography>
          <Button
            variant="contained"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
          >
            {t('dashboard.retry')}
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard; 