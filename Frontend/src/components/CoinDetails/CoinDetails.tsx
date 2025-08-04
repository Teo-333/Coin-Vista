import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress, Paper } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTranslation } from 'react-i18next';
import cryptoService from '../../services/cryptoService';
import type { CryptoData, CryptoHistoryData } from '../../types/crypto';

const CoinDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [coin, setCoin] = useState<CryptoData | null>(null);
  const [history, setHistory] = useState<CryptoHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const [coinData] = await cryptoService.getCoins({
          ids: id,
          vs_currency: 'usd',
          price_change_percentage: '24h',
        });
        const historyData = await cryptoService.getCoinHistory(id, { days: '7' });
        setCoin(coinData);
        setHistory(historyData);
      } catch (err) {
        console.error(err);
        setError(t('dashboard.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, t]);

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !coin || !history) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="error">{error || t('dashboard.error')}</Typography>
      </Box>
    );
  }

  const chartOptions: Highcharts.Options = {
    title: { text: `${coin.name} Price` },
    xAxis: { type: 'datetime' },
    series: [
      {
        type: 'line',
        name: coin.name,
        data: history.prices.map(([timestamp, price]) => [timestamp, price]),
      },
    ],
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <img src={coin.image} alt={coin.name} width={48} height={48} style={{ marginRight: 16 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            ${coin.current_price.toLocaleString()}
          </Typography>
          <Typography color={coin.price_change_percentage_24h >= 0 ? 'success.main' : 'error.main'}>
            {coin.price_change_percentage_24h.toFixed(2)}%
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Paper>
      </Container>
    </Box>
  );
};

export default CoinDetails;

