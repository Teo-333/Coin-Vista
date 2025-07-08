import api from './api';
import type { CryptoData, CryptoHistoryData, WatchlistItem } from '../types/crypto';

export const cryptoService = {
  // Get crypto market data
  async getCoins(params?: {
    ids?: string;
    vs_currency?: string;
    price_change_percentage?: string;
  }): Promise<CryptoData[]> {
    const response = await api.get('/api/coins', { params });
    return response.data;
  },

  // Get historical data for a specific coin
  async getCoinHistory(
    coinId: string,
    params?: {
      days?: string;
      interval?: string;
    }
  ): Promise<CryptoHistoryData> {
    const response = await api.get(`/api/coins/${coinId}/history`, { params });
    return response.data;
  },

  // Get OHLC data for a specific coin
  async getCoinOHLC(
    coinId: string,
    params?: {
      vs_currency?: string;
      days?: string;
    }
  ): Promise<number[][]> {
    const response = await api.get(`/api/coins/${coinId}/ohlc`, { params });
    return response.data;
  },

  // Get batch historical data for multiple coins
  async getBatchHistory(
    coinIds: string[],
    params?: {
      days?: string;
      interval?: string;
    }
  ): Promise<any[]> {
    const idsParam = coinIds.join(',');
    const response = await api.get('/api/coins/history', {
      params: { ids: idsParam, ...params },
    });
    return response.data;
  },

  // Watchlist management
  async getWatchlist(): Promise<string[]> {
    const response = await api.get('/watchlist');
    return response.data;
  },

  async toggleWatchlist(coinId: string): Promise<{ action: 'added' | 'removed' }> {
    const response = await api.post('/watchlist', { coinId });
    return response.data;
  },
};

export default cryptoService; 