import { EquityTrade, FXTrade } from '../types/trade';

// Enhanced CSV parser that handles various CSV formats
export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row: any = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    return row;
  });
};

// Auto-detect trade type based on column headers
export const detectTradeType = (data: any[]): 'equity' | 'fx' => {
  if (data.length === 0) return 'equity';
  
  const firstRow = data[0];
  const headers = Object.keys(firstRow).map(h => h.toLowerCase());
  
  // Check for FX-specific columns
  const fxIndicators = [
    'currencypair', 'currency pair', 'buysell', 'buy/sell', 'basecurrency', 'base currency',
    'termcurrency', 'term currency', 'producttype', 'product type', 'valuedate', 'value date',
    'traderid', 'trader id', 'dealtcurrency', 'dealt currency'
  ];
  
  // Check for Equity-specific columns
  const equityIndicators = [
    'quantity', 'price', 'clientid', 'client id', 'orderid', 'order id',
    'tradingvenue', 'trading venue', 'traderName', 'trader name'
  ];
  
  const fxMatches = fxIndicators.filter(indicator => 
    headers.some(header => header.includes(indicator))
  ).length;
  
  const equityMatches = equityIndicators.filter(indicator => 
    headers.some(header => header.includes(indicator))
  ).length;
  
  return fxMatches > equityMatches ? 'fx' : 'equity';
};

// Enhanced equity trades parser with flexible column mapping
export const parseEquityTradesCSV = (csvText: string): EquityTrade[] => {
  const data = parseCSV(csvText);
  if (data.length === 0) return [];
  
  return data.map((row, index) => {
    // Flexible column mapping - handles various naming conventions
    const getField = (possibleNames: string[]) => {
      for (const name of possibleNames) {
        if (row[name] !== undefined && row[name] !== '') return row[name];
      }
      return '';
    };
    
    return {
      tradeId: getField(['Trade ID', 'TradeID', 'tradeId', 'ID']) || `UPLOAD-${Date.now()}-${index}`,
      orderId: getField(['Order ID', 'OrderID', 'orderId']) || `ORDER-${Date.now()}-${index}`,
      clientId: getField(['Client ID', 'ClientID', 'clientId', 'Client']) || `CLIENT-${index}`,
      tradeType: (getField(['Trade Type', 'TradeType', 'tradeType', 'Type']) || 'Buy') as 'Buy' | 'Sell',
      quantity: parseInt(getField(['Quantity', 'quantity', 'Qty']) || '0'),
      price: parseFloat(getField(['Price', 'price', 'Unit Price']) || '0'),
      tradeValue: parseFloat(getField(['Trade Value', 'TradeValue', 'tradeValue', 'Value', 'Amount']) || '0'),
      currency: getField(['Currency', 'currency', 'Ccy']) || 'USD',
      tradeDate: getField(['Trade Date', 'TradeDate', 'tradeDate', 'Date']) || new Date().toLocaleDateString(),
      settlementDate: getField(['Settlement Date', 'SettlementDate', 'settlementDate', 'Settle Date']) || new Date().toLocaleDateString(),
      counterparty: getField(['Counterparty', 'counterparty', 'Counter Party']) || 'Unknown',
      tradingVenue: getField(['Trading Venue', 'TradingVenue', 'tradingVenue', 'Venue', 'Exchange']) || 'NYSE',
      traderName: getField(['Trader Name', 'TraderName', 'traderName', 'Trader']) || 'Trader A',
      confirmationStatus: (getField(['Confirmation Status', 'ConfirmationStatus', 'confirmationStatus', 'Status']) || 'Pending') as 'Confirmed' | 'Pending' | 'Failed' | 'Settled',
      countryOfTrade: getField(['Country of Trade', 'CountryOfTrade', 'countryOfTrade', 'Country']) || 'US',
      opsTeamNotes: getField(['Ops Team Notes', 'OpsTeamNotes', 'opsTeamNotes', 'Notes', 'Comments']) || 'Clean'
    };
  });
};

// Enhanced FX trades parser with flexible column mapping
export const parseFXTradesCSV = (csvText: string): FXTrade[] => {
  const data = parseCSV(csvText);
  if (data.length === 0) return [];
  
  return data.map((row, index) => {
    // Flexible column mapping - handles various naming conventions
    const getField = (possibleNames: string[]) => {
      for (const name of possibleNames) {
        if (row[name] !== undefined && row[name] !== '') return row[name];
      }
      return '';
    };
    
    return {
      tradeId: getField(['TradeID', 'Trade ID', 'tradeId', 'ID']) || `FX-${Date.now()}-${index}`,
      tradeDate: getField(['TradeDate', 'Trade Date', 'tradeDate', 'Date']) || new Date().toLocaleDateString(),
      valueDate: getField(['ValueDate', 'Value Date', 'valueDate']) || new Date().toLocaleDateString(),
      tradeTime: getField(['TradeTime', 'Trade Time', 'tradeTime', 'Time']) || '09:00:00',
      traderId: getField(['TraderID', 'Trader ID', 'traderId', 'Trader']) || `TDR${index}`,
      counterparty: getField(['Counterparty', 'counterparty', 'Counter Party']) || 'Unknown',
      currencyPair: getField(['CurrencyPair', 'Currency Pair', 'currencyPair', 'Pair']) || 'USD/EUR',
      buySell: (getField(['BuySell', 'Buy/Sell', 'buySell', 'Side', 'Direction']) || 'Buy') as 'Buy' | 'Sell',
      dealtCurrency: getField(['DealtCurrency', 'Dealt Currency', 'dealtCurrency']) || 'USD',
      baseCurrency: getField(['BaseCurrency', 'Base Currency', 'baseCurrency', 'Base']) || 'USD',
      termCurrency: getField(['TermCurrency', 'Term Currency', 'termCurrency', 'Term']) || 'EUR',
      tradeStatus: (getField(['TradeStatus', 'Trade Status', 'tradeStatus', 'Status']) || 'Booked') as 'Booked' | 'Confirmed' | 'Settled' | 'Cancelled',
      productType: (getField(['ProductType', 'Product Type', 'productType', 'Product']) || 'Spot') as 'Spot' | 'Forward' | 'Swap',
      maturityDate: getField(['MaturityDate', 'Maturity Date', 'maturityDate']) || undefined,
      confirmationTimestamp: getField(['ConfirmationTimestamp', 'Confirmation Timestamp', 'confirmationTimestamp']) || new Date().toISOString(),
      settlementDate: getField(['SettlementDate', 'Settlement Date', 'settlementDate']) || new Date().toLocaleDateString(),
      amendmentFlag: (getField(['AmendmentFlag', 'Amendment Flag', 'amendmentFlag']) || 'No') as 'Yes' | 'No',
      confirmationMethod: (getField(['ConfirmationMethod', 'Confirmation Method', 'confirmationMethod']) || 'Electronic') as 'SWIFT' | 'Email' | 'Manual' | 'Electronic',
      confirmationStatus: (getField(['ConfirmationStatus', 'Confirmation Status', 'confirmationStatus']) || 'Pending') as 'Confirmed' | 'Pending' | 'Disputed'
    };
  });
};