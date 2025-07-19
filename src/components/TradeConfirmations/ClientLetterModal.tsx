import React from 'react';
import { X, Download, Building } from 'lucide-react';
import { EquityTrade, FXTrade } from '../../types/trade';

interface ClientLetterModalProps {
  trade: EquityTrade | FXTrade;
  onClose: () => void;
}

const ClientLetterModal: React.FC<ClientLetterModalProps> = ({ trade, onClose }) => {
  const isEquityTrade = 'quantity' in trade;

  const handleDownloadPDF = () => {
    // Create client confirmation document
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Client Trade Confirmation - ${trade.tradeId}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { color: #6366f1; font-size: 24px; font-weight: bold; }
          .content { max-width: 800px; margin: 0 auto; }
          .section { margin: 20px 0; }
          .field { margin: 10px 0; display: flex; justify-content: space-between; }
          .label { font-weight: bold; }
          .value { text-align: right; }
          .footer { margin-top: 40px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="content">
          <div class="header">
            <div class="logo">RAYMOND JAMES®</div>
            <p>Trade Confirmation - Account # 12345678</p>
            <p>July 13, 2011</p>
            <p>Jane Doe, CFP®</p>
            <p>Raymond James & Associates, Inc.</p>
            <p>1234 West Street</p>
            <p>Anywhere, FL 12345-6789</p>
            <p>(123) 456-7890</p>
            <p>janedoe@raymondjames.com</p>
          </div>
          
          <h2>Client Trade Confirmation - Account # 12345678</h2>
          <p>These transactions were executed in a non-managed, non-fee-based account. Commissions are charged for individual transactions.</p>
          
          <div class="section">
            <h3>Trade Details</h3>
            <div class="field">
              <span class="label">Trade Reference:</span>
              <span class="value">${trade.tradeId}</span>
            </div>
            <div class="field">
              <span class="label">Trade Date:</span>
              <span class="value">${isEquityTrade ? (trade as EquityTrade).tradeDate : (trade as FXTrade).tradeDate}</span>
            </div>
            <div class="field">
              <span class="label">Settlement Date:</span>
              <span class="value">${isEquityTrade ? (trade as EquityTrade).settlementDate : (trade as FXTrade).settlementDate}</span>
            </div>
          </div>

          ${isEquityTrade ? `
            <div class="section">
              <h3>Equity Transaction</h3>
              <div class="field">
                <span class="label">Symbol:</span>
                <span class="value">ABC</span>
              </div>
              <div class="field">
                <span class="label">Number of Shares:</span>
                <span class="value">${(trade as EquityTrade).quantity.toLocaleString()}</span>
              </div>
              <div class="field">
                <span class="label">Net Amount:</span>
                <span class="value">${(trade as EquityTrade).currency} ${(trade as EquityTrade).tradeValue.toLocaleString()}</span>
              </div>
              <div class="field">
                <span class="label">Amount per Share:</span>
                <span class="value">${(trade as EquityTrade).currency} ${(trade as EquityTrade).price.toFixed(2)}</span>
              </div>
              <div class="field">
                <span class="label">Price per Share:</span>
                <span class="value">${(trade as EquityTrade).currency} ${(trade as EquityTrade).price.toFixed(2)}</span>
              </div>
            </div>
          ` : `
            <div class="section">
              <h3>FX Transaction</h3>
              <div class="field">
                <span class="label">Currency Pair:</span>
                <span class="value">${(trade as FXTrade).currencyPair}</span>
              </div>
              <div class="field">
                <span class="label">Transaction Type:</span>
                <span class="value">${(trade as FXTrade).buySell}</span>
              </div>
              <div class="field">
                <span class="label">Product Type:</span>
                <span class="value">${(trade as FXTrade).productType}</span>
              </div>
            </div>
          `}

          <div class="section">
            <h3>Trade Calculation</h3>
            <div class="field">
              <span class="label">Trade Commission:</span>
              <span class="value">$51.32</span>
            </div>
            <div class="field">
              <span class="label">Processing Fee:</span>
              <span class="value">$4.95</span>
            </div>
            <div class="field">
              <span class="label">Fee:</span>
              <span class="value">$1.32</span>
            </div>
            <div class="field">
              <span class="label">Net Amount:</span>
              <span class="value">${isEquityTrade ? (trade as EquityTrade).currency + ' ' + (trade as EquityTrade).tradeValue.toLocaleString() : 'USD 51,020.00'}</span>
            </div>
          </div>

          <div class="section">
            <h3>Additional Information</h3>
            <p><strong>CAPACITY:</strong> Raymond James & Associates, Inc. executed this transaction as agent.</p>
            <p><strong>UNSOLICITED TRANSACTION:</strong> This transaction was executed on an unsolicited basis.</p>
            <p><strong>AVERAGE PRICE TRADE:</strong> The execution price for this transaction is an average price.</p>
          </div>

          <div class="footer">
            <p>Please refer to the Understanding your Confirmation page for additional information.</p>
            <p>Account carried by Raymond James & Associates, Inc. | Member New York Stock Exchange/SIPC</p>
            <p>880 Carillon Parkway | St. Petersburg, Florida 33716 | 727.567.1000 | raymondjames.com</p>
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
    a.download = `client-confirmation-${trade.tradeId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-indigo-50">
          <div className="flex items-center space-x-3">
            <Building className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-indigo-900">Client Trade Confirmation</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 bg-white">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-indigo-900">RAYMOND JAMES®</h1>
            </div>
            <div className="text-right text-sm text-gray-600 mb-4">
              <p>July 13, 2011</p>
              <p>Trade Confirmation - Account # 12345678</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p><strong>Jane Doe, CFP®</strong></p>
              <p>Raymond James & Associates, Inc.</p>
              <p>1234 West Street</p>
              <p>Anywhere, FL 12345-6789</p>
              <p>(123) 456-7890</p>
              <p>janedoe@raymondjames.com</p>
            </div>
          </div>

          <hr className="border-gray-300 mb-6" />

          {/* Client Services Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="text-center">
              <p className="font-bold">Raymond James Client Services</p>
              <p>800.647.SERV (7378)</p>
              <p>Monday - Friday 8 a.m. to 6 p.m. ET</p>
              <p><strong>Online Account Access</strong></p>
              <p>raymondjames.com/investoraccess</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              John & Ellen Client's Trade Confirmation - Account # 12345678
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              These transactions were executed in a non-managed, non-fee-based account. Commissions are charged for individual transactions.
            </p>
          </div>

          {/* Trade Details Table */}
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold">Equities</span>
              <span className="bg-blue-100 px-3 py-1 rounded text-blue-800 font-bold">EQ</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="bg-blue-100 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded font-bold">
                      {isEquityTrade ? (trade as EquityTrade).tradeType : (trade as FXTrade).buySell}
                    </span>
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <p className="font-bold">ABC CORPORATION (Symbol: ABC)</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">Number of Shares:</p>
                      <p className="font-bold">{isEquityTrade ? (trade as EquityTrade).quantity.toLocaleString() : '2,000,000'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Net Amount:</p>
                      <p className="font-bold">{isEquityTrade ? (trade as EquityTrade).currency + ' ' + (trade as EquityTrade).tradeValue.toLocaleString() : '$51,020.00'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Amount per Share:</p>
                      <p className="font-bold">{isEquityTrade ? (trade as EquityTrade).currency + ' ' + (trade as EquityTrade).price.toFixed(2) : '$25.51'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Trade:</span>
                    <span>1 of 4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trade Commission:</span>
                    <span>$51.32</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span>$4.95</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee:</span>
                    <span>$1.32</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Net Amount:</span>
                    <span>{isEquityTrade ? (trade as EquityTrade).currency + ' ' + (trade as EquityTrade).tradeValue.toLocaleString() : '$51,020.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per Share:</span>
                    <span>{isEquityTrade ? (trade as EquityTrade).currency + ' ' + (trade as EquityTrade).price.toFixed(2) : '$25.63'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">CUSIP:</p>
                  <p>789456123</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Trade Date:</p>
                  <p>{isEquityTrade ? (trade as EquityTrade).tradeDate : (trade as FXTrade).tradeDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Settlement Date:</p>
                  <p>{isEquityTrade ? (trade as EquityTrade).settlementDate : (trade as FXTrade).settlementDate}</p>
                </div>

                <div className="bg-yellow-50 p-3 rounded text-sm">
                  <p><strong>CAPACITY:</strong> Raymond James & Associates, Inc. executed this transaction as agent.</p>
                  <p><strong>UNSOLICITED TRANSACTION:</strong> This transaction was executed on an unsolicited basis.</p>
                  <p><strong>AVERAGE PRICE TRADE:</strong> The execution price for this transaction is an average price.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="text-sm text-gray-600 mb-6">
            <p className="mb-2">Please refer to the Understanding your Confirmation page for additional information.</p>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                <p>Account carried by Raymond James & Associates, Inc. | Member New York Stock Exchange/SIPC</p>
                <p>880 Carillon Parkway | St. Petersburg, Florida 33716 | 727.567.1000 | raymondjames.com</p>
              </div>
              <div className="text-right">
                <p>Page 1 of 4</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientLetterModal;