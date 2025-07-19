import { EquityTrade, FXTrade } from '../types/trade';

export const generateTradePDF = (trade: EquityTrade | FXTrade): void => {
  const isEquityTrade = 'quantity' in trade;
  
  // Create a simple HTML content for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Trade Confirmation - ${trade.tradeId}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; display: inline-block; width: 200px; }
        .value { display: inline-block; }
        .section { margin: 20px 0; border-top: 1px solid #ccc; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Barclays Confirmation Department</h1>
        <h2>Trade Confirmation</h2>
      </div>
      <div class="content">
        <div class="field">
          <span class="label">Trade ID:</span>
          <span class="value">${trade.tradeId}</span>
        </div>
        ${isEquityTrade ? `
          <div class="field">
            <span class="label">Order ID:</span>
            <span class="value">${(trade as EquityTrade).orderId}</span>
          </div>
          <div class="field">
            <span class="label">Client ID:</span>
            <span class="value">${(trade as EquityTrade).clientId}</span>
          </div>
          <div class="field">
            <span class="label">Trade Type:</span>
            <span class="value">${(trade as EquityTrade).tradeType}</span>
          </div>
          <div class="field">
            <span class="label">Quantity:</span>
            <span class="value">${(trade as EquityTrade).quantity.toLocaleString()}</span>
          </div>
          <div class="field">
            <span class="label">Price:</span>
            <span class="value">${(trade as EquityTrade).currency} ${(trade as EquityTrade).price.toFixed(2)}</span>
          </div>
          <div class="field">
            <span class="label">Trade Value:</span>
            <span class="value">${(trade as EquityTrade).currency} ${(trade as EquityTrade).tradeValue.toLocaleString()}</span>
          </div>
          <div class="field">
            <span class="label">Trading Venue:</span>
            <span class="value">${(trade as EquityTrade).tradingVenue}</span>
          </div>
          <div class="field">
            <span class="label">Trader Name:</span>
            <span class="value">${(trade as EquityTrade).traderName}</span>
          </div>
          <div class="field">
            <span class="label">Confirmation Status:</span>
            <span class="value">${(trade as EquityTrade).confirmationStatus}</span>
          </div>
        ` : `
          <div class="field">
            <span class="label">Currency Pair:</span>
            <span class="value">${(trade as FXTrade).currencyPair}</span>
          </div>
          <div class="field">
            <span class="label">Buy/Sell:</span>
            <span class="value">${(trade as FXTrade).buySell}</span>
          </div>
          <div class="field">
            <span class="label">Product Type:</span>
            <span class="value">${(trade as FXTrade).productType}</span>
          </div>
          <div class="field">
            <span class="label">Trade Status:</span>
            <span class="value">${(trade as FXTrade).tradeStatus}</span>
          </div>
          <div class="field">
            <span class="label">Confirmation Method:</span>
            <span class="value">${(trade as FXTrade).confirmationMethod}</span>
          </div>
          <div class="field">
            <span class="label">Confirmation Status:</span>
            <span class="value">${(trade as FXTrade).confirmationStatus}</span>
          </div>
        `}
        <div class="section">
          <h3>Settlement Details</h3>
          <div class="field">
            <span class="label">Trade Date:</span>
            <span class="value">${isEquityTrade ? (trade as EquityTrade).tradeDate : (trade as FXTrade).tradeDate}</span>
          </div>
          <div class="field">
            <span class="label">Settlement Date:</span>
            <span class="value">${isEquityTrade ? (trade as EquityTrade).settlementDate : (trade as FXTrade).settlementDate}</span>
          </div>
          <div class="field">
            <span class="label">Counterparty:</span>
            <span class="value">${isEquityTrade ? (trade as EquityTrade).counterparty : (trade as FXTrade).counterparty}</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Create a blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trade-confirmation-${trade.tradeId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};