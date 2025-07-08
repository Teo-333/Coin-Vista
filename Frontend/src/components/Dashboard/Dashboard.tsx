import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Paper,
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Paper 
          elevation={0} 
          sx={{ 
            bgcolor: 'background.paper', 
            p: 4, 
            mb: 4, 
            borderRadius: 2,
            border: 1,
            borderColor: 'divider'
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'flex-start' },
              justifyContent: 'space-between',
              gap: 3,
              mb: 3
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ 
                color: 'text.primary',
                fontWeight: 700,
                fontSize: { xs: '1.75rem', md: '2rem' }
              }}
            >
              {t('dashboard.title')}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
                size="medium"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  mb: 1
                }}
              >
                {t('dashboard.retry')}
              </Button>
              
              {lastUpdated && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.75rem',
                    textAlign: { xs: 'left', sm: 'right' }
                  }}
                >
                  {t('dashboard.lastUpdated', { 
                    time: formatLastUpdated(lastUpdated) 
                  })}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" onClick={handleRefresh}>
                {t('dashboard.retry')}
              </Button>
            }
            sx={{ mb: 4, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {loading && coins.length === 0 && (
          <Paper 
            elevation={0} 
            sx={{ 
              bgcolor: 'background.paper', 
              border: 1, 
              borderColor: 'divider',
              borderRadius: 2,
              p: 8,
              textAlign: 'center'
            }}
          >
            <CircularProgress size={48} sx={{ mb: 3 }} />
            <Typography variant="h6" color="text.secondary">
              {t('dashboard.loading')}
            </Typography>
          </Paper>
        )}

        {!loading && coins.length > 0 && (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gap: 3
            }}
          >
            {coins.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                isInWatchlist={watchlist.includes(coin.id)}
                onToggleWatchlist={handleToggleWatchlist}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </Box>
        )}

        {!loading && coins.length === 0 && !error && (
          <Paper 
            elevation={0} 
            sx={{ 
              bgcolor: 'background.paper', 
              border: 1, 
              borderColor: 'divider',
              borderRadius: 2,
              p: 8,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              {t('dashboard.noData')}
            </Typography>
            <Button
              variant="contained"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 4,
                py: 1.5
              }}
            >
              {t('dashboard.retry')}
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard; 