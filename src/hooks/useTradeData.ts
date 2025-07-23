import { useState, useEffect, useCallback } from 'react';
import { EquityTrade, FXTrade } from '../types/trade';
import { parseEquityTradesCSV, parseFXTradesCSV, detectTradeType } from '../utils/csvParser';

// Local storage keys for persistent data
const EQUITY_TRADES_KEY = 'barclays_equity_trades';
const FX_TRADES_KEY = 'barclays_fx_trades';

// Helper functions for local storage
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

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
        
        // First, try to load from localStorage
        const savedEquityTrades = loadFromLocalStorage(EQUITY_TRADES_KEY);
        const savedFxTrades = loadFromLocalStorage(FX_TRADES_KEY);
        
        if (savedEquityTrades && savedFxTrades) {
          console.log('Loading trades from localStorage');
          setEquityTrades(savedEquityTrades);
          setFxTrades(savedFxTrades);
          setError(null);
          setLoading(false);
          return;
        }
        
        console.log('Loading trades from CSV files');
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
        
        // Save initial data to localStorage
        saveToLocalStorage(EQUITY_TRADES_KEY, parsedEquityTrades);
        saveToLocalStorage(FX_TRADES_KEY, parsedFxTrades);
        
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
    
    // Save updated data to localStorage for persistence
    saveToLocalStorage(EQUITY_TRADES_KEY, newEquityTrades);
    saveToLocalStorage(FX_TRADES_KEY, newFxTrades);
    
    // Log the update for debugging
    console.log('Trade data updated:', {
      equityCount: newEquityTrades.length,
      fxCount: newFxTrades.length,
      total: newEquityTrades.length + newFxTrades.length
    });
    
    console.log('Data saved to localStorage for persistence');
  }, []);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(EQUITY_TRADES_KEY);
    localStorage.removeItem(FX_TRADES_KEY);
    console.log('Cleared saved trade data from localStorage');
  }, []);

  return { equityTrades, fxTrades, loading, error, updateTradeData, clearSavedData };
};