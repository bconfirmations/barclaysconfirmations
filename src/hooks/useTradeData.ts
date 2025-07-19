import { useState, useEffect } from 'react';
import { EquityTrade, FXTrade } from '../types/trade';
import { parseEquityTradesCSV, parseFXTradesCSV } from '../utils/csvParser';

export const useTradeData = () => {
  const [equityTrades, setEquityTrades] = useState<EquityTrade[]>([]);
  const [fxTrades, setFxTrades] = useState<FXTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  return { equityTrades, fxTrades, loading, error };
};