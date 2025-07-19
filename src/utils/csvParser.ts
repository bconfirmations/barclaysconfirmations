import { EquityTrade, FXTrade } from '../types/trade';

export const parseEquityTradesCSV = (csvText: string): EquityTrade[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      tradeId: values[0]?.trim() || '',
      orderId: values[1]?.trim() || '',
      clientId: values[2]?.trim() || '',
      tradeType: (values[3]?.trim() || 'Buy') as 'Buy' | 'Sell',
      quantity: parseInt(values[4]?.trim() || '0'),
      price: parseFloat(values[5]?.trim() || '0'),
      tradeValue: parseFloat(values[6]?.trim() || '0'),
      currency: values[7]?.trim() || '',
      tradeDate: values[8]?.trim() || '',
      settlementDate: values[9]?.trim() || '',
      counterparty: values[11]?.trim() || '',
      tradingVenue: values[12]?.trim() || '',
      traderName: values[13]?.trim() || '',
      confirmationStatus: (values[14]?.trim() || 'Pending') as 'Confirmed' | 'Pending' | 'Failed' | 'Settled',
      countryOfTrade: values[15]?.trim() || '',
      opsTeamNotes: values[16]?.trim() || ''
    };
  });
};

export const parseFXTradesCSV = (csvText: string): FXTrade[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      tradeId: values[0]?.trim() || '',
      tradeDate: values[1]?.trim() || '',
      valueDate: values[2]?.trim() || '',
      tradeTime: values[3]?.trim() || '',
      traderId: values[4]?.trim() || '',
      counterparty: values[5]?.trim() || '',
      currencyPair: values[6]?.trim() || '',
      buySell: (values[7]?.trim() || 'Buy') as 'Buy' | 'Sell',
      dealtCurrency: values[8]?.trim() || '',
      baseCurrency: values[9]?.trim() || '',
      termCurrency: values[10]?.trim() || '',
      tradeStatus: (values[11]?.trim() || 'Booked') as 'Booked' | 'Confirmed' | 'Settled' | 'Cancelled',
      productType: (values[12]?.trim() || 'Spot') as 'Spot' | 'Forward' | 'Swap',
      maturityDate: values[13]?.trim() || undefined,
      confirmationTimestamp: values[14]?.trim() || '',
      settlementDate: values[15]?.trim() || '',
      amendmentFlag: (values[16]?.trim() || 'No') as 'Yes' | 'No',
      confirmationMethod: (values[17]?.trim() || 'Electronic') as 'SWIFT' | 'Email' | 'Manual' | 'Electronic',
      confirmationStatus: (values[18]?.trim() || 'Pending') as 'Confirmed' | 'Pending' | 'Disputed'
    };
  });
};