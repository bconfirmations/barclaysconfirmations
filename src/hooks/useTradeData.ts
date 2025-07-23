import { useState, useEffect, useCallback } from 'react';
import { EquityTrade, FXTrade } from '../types/trade';
import { parseEquityTradesCSV, parseFXTradesCSV, detectTradeType } from '../utils/csvParser';

export const useTradeData = (initialEquityTrades?: EquityTrade[], initialFxTrades?: FXTrade[]) => {
  const [equityTrades, setEquityTrades] = useState<EquityTrade[]>(initialEquityTrades || []);
  const [fxTrades, setFxTrades] = useState<FXTrade[]>(initialFxTrades || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If initial data is provided, don't load from CSV
    if (initialEquityTrades && initialFxTrades) {
      setLoading(false);
      return;
    }

    const loadTradeData = async () => {
      try {
        setLoading(true);
        
        // Load equity trades
        const equityResponse = await fetch('/src/data/equity_trade_lifecycle_dataset69.csv');
        const equityText = await equityResponse.text();
        const parsedEquityTrades = parseEquityTradesCSV(equityText);
        
        // Load FX trades
        const fxResponse = await fetch('/src/data/fx_trade_lifecycle_full_dataset69.csv');
        const fxText = await fxResponse.text();
        const parsedFxTrades = parseFXTradesCSV(fxText);
        
        setEquityTrades(parsedEquityTrades);
        setFxTrades(parsedFxTrades);
        setError(null);
      } catch (err) {
        console.error('Error loading trade data:', err);
        setError('Failed to load trade data');
      } finally {
        setLoading(false);
      }
    };

    loadTradeData();
  }, []);

  const updateTradeData = useCallback((newEquityTrades: EquityTrade[], newFxTrades: FXTrade[]) => {
    setEquityTrades(newEquityTrades);
    setFxTrades(newFxTrades);
    
    // Log the update for debugging
    console.log('Trade data updated:', {
      equityCount: newEquityTrades.length,
      fxCount: newFxTrades.length,
      total: newEquityTrades.length + newFxTrades.length
    });
  }, []);

  return { equityTrades, fxTrades, loading, error, updateTradeData };
};