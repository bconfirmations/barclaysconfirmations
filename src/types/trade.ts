export interface EquityTrade {
  tradeId: string;
  orderId: string;
  clientId: string;
  tradeType: 'Buy' | 'Sell';
  quantity: number;
  price: number;
  tradeValue: number;
  currency: string;
  tradeDate: string;
  settlementDate: string;
  counterparty: string;
  tradingVenue: string;
  traderName: string;
  confirmationStatus: 'Confirmed' | 'Pending' | 'Failed' | 'Settled';
  countryOfTrade: string;
  opsTeamNotes: string;
}

export interface FXTrade {
  tradeId: string;
  tradeDate: string;
  valueDate: string;
  tradeTime: string;
  traderId: string;
  counterparty: string;
  currencyPair: string;
  buySell: 'Buy' | 'Sell';
  dealtCurrency: string;
  baseCurrency: string;
  termCurrency: string;
  tradeStatus: 'Booked' | 'Confirmed' | 'Settled' | 'Cancelled';
  productType: 'Spot' | 'Forward' | 'Swap';
  maturityDate?: string;
  confirmationTimestamp: string;
  settlementDate: string;
  amendmentFlag: 'Yes' | 'No';
  confirmationMethod: 'SWIFT' | 'Email' | 'Manual' | 'Electronic';
  confirmationStatus: 'Confirmed' | 'Pending' | 'Disputed';
}

export type Trade = EquityTrade | FXTrade;

export interface WorkflowStage {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface WorkflowAnalytics {
  stage: string;
  count: number;
  percentage: number;
}

export interface NextActionOwner {
  department: string;
  count: number;
  percentage: number;
}

export interface TradeStageAnalytics {
  stage: string;
  count: number;
  percentage: number;
}

export type TradeFilter = 'all' | 'equity' | 'fx';