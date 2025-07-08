import type { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function getCoins(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ids, vs_currency = 'usd', price_change_percentage } = req.query;
    
    const params: any = {
      vs_currency,
      order: 'market_cap_desc',
      per_page: 100,
      page: 1,
      sparkline: false
    };
    
    if (ids) {
      params.ids = ids;
    }
    
    if (price_change_percentage) {
      params.price_change_percentage = price_change_percentage;
    }
    
    const response = await axios.get(`${COINGECKO_BASE_URL}/coins/markets`, { params });
    res.json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json({
        status: 'error',
        message: error.response.data?.error || 'External API error'
      });
    } else {
      next(error);
    }
  }
}

export async function getCoinHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { days = '7', interval } = req.query;
    
    const params: any = {
      vs_currency: 'usd',
      days
    };
    
    if (interval) {
      params.interval = interval;
    }
    
    const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${id}/market_chart`, { params });
    res.json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json({
        status: 'error',
        message: error.response.data?.error || 'External API error'
      });
    } else {
      next(error);
    }
  }
}

export async function getCoinOHLC(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { vs_currency = 'usd', days = '7' } = req.query;
    
    const params = {
      vs_currency,
      days
    };
    
    const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${id}/ohlc`, { params });
    res.json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json({
        status: 'error',
        message: error.response.data?.error || 'External API error'
      });
    } else {
      next(error);
    }
  }
}

export async function getBatchHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ids } = req.query;
    
    if (!ids || typeof ids !== 'string') {
      res.status(400).json({
        status: 'error',
        message: 'ids parameter is required'
      });
      return;
    }
    
    const coinIds = ids.split(',').map(id => id.trim());
    const { days = '7', interval } = req.query;
    
    const promises = coinIds.map(async (coinId) => {
      try {
        const params: any = {
          vs_currency: 'usd',
          days
        };
        
        if (interval) {
          params.interval = interval;
        }
        
        const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${coinId}/market_chart`, { params });
        return { id: coinId, data: response.data };
      } catch (error: any) {
        return { 
          id: coinId, 
          error: error.response?.data?.error || 'Failed to fetch data',
          status: error.response?.status || 500
        };
      }
    });
    
    const results = await Promise.all(promises);
    res.json(results);
  } catch (error) {
    next(error);
  }
} 