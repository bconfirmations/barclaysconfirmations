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
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 20px; }
          .logo { color: #1e40af; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .content { max-width: 800px; margin: 0 auto; }
          .section { margin: 30px 0; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .table th { background-color: #f8f9fa; font-weight: bold; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
          .contact-box { background-color: #f0f4ff; padding: 15px; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="content">
          <div class="header">
            <div class="logo">BARCLAYS</div>
            <p style="margin: 0; color: #666;">Trade Confirmation Department</p>
          </div>
          
          <div class="section">
            <h2 style="color: #1e40af;">Client Document</h2>
            <p><strong>Issued by:</strong> Barclays</p>
            <p><strong>Trade Confirmation Department</strong></p>
            <br>
            <p>This document provides formal confirmation of the trade executed on your behalf, with detailed information as below.</p>
          </div>

          <div class="section">
            <h3 style="color: #1e40af;">Trade Summary</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Trade Reference</td>
                  <td>${trade.tradeId}</td>
                </tr>
                ${isEquityTrade ? `
                <tr>
                  <td>Order Reference</td>
                  <td>${(trade as EquityTrade).orderId}</td>
                </tr>
                ` : ''}
                <tr>
                  <td>Trade Date</td>
                  <td>${isEquityTrade ? (trade as EquityTrade).tradeDate : (trade as FXTrade).tradeDate}</td>
                </tr>
                <tr>
                  <td>Settlement Date</td>
                  <td>${isEquityTrade ? (trade as EquityTrade).settlementDate : (trade as FXTrade).settlementDate}</td>
                </tr>
                ${isEquityTrade ? `
                <tr>
                  <td>Client Name/Institution</td>
                  <td>Client Account ${(trade as EquityTrade).clientId}</td>
                </tr>
                ` : `
                <tr>
                  <td>Client Name/Institution</td>
                  <td>Trader ${(trade as FXTrade).traderId}</td>
                </tr>
                `}
                <tr>
                  <td>Counterparty</td>
                  <td>${trade.counterparty}</td>
                </tr>
                ${isEquityTrade ? `
                <tr>
                  <td>Trading Venue</td>
                  <td>${(trade as EquityTrade).tradingVenue}</td>
                </tr>
                <tr>
                  <td>Country</td>
                  <td>${(trade as EquityTrade).countryOfTrade}</td>
                </tr>
                ` : `
                <tr>
                  <td>Currency Pair</td>
                  <td>${(trade as FXTrade).currencyPair}</td>
                </tr>
                <tr>
                  <td>Product Type</td>
                  <td>${(trade as FXTrade).productType}</td>
                </tr>
                `}
              </tbody>
            </table>
          </div>

          ${isEquityTrade ? `
          <div class="section">
            <h3 style="color: #1e40af;">Trade Details</h3>
            <table class="table">
              <tbody>
                <tr>
                  <td>Transaction Type</td>
                  <td>${(trade as EquityTrade).tradeType}</td>
                </tr>
                <tr>
                  <td>Quantity</td>
                  <td>${(trade as EquityTrade).quantity.toLocaleString()} shares</td>
                </tr>
                <tr>
                  <td>Price per Share</td>
                  <td>${(trade as EquityTrade).currency} ${(trade as EquityTrade).price.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Total Trade Value</td>
                  <td>${(trade as EquityTrade).currency} ${(trade as EquityTrade).tradeValue.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          ` : `
          <div class="section">
            <h3 style="color: #1e40af;">FX Trade Details</h3>
            <table class="table">
              <tbody>
                <tr>
                  <td>Transaction Type</td>
                  <td>${(trade as FXTrade).buySell}</td>
                </tr>
                <tr>
                  <td>Base Currency</td>
                  <td>${(trade as FXTrade).baseCurrency}</td>
                </tr>
                <tr>
                  <td>Term Currency</td>
                  <td>${(trade as FXTrade).termCurrency}</td>
                </tr>
                <tr>
                  <td>Dealt Currency</td>
                  <td>${(trade as FXTrade).dealtCurrency}</td>
                </tr>
              </tbody>
            </table>
          </div>
          `}

          <div class="contact-box">
            <p><strong>For any queries regarding this confirmation, please contact:</strong></p>
            <p>Client Services Desk or contact your relationship manager</p>
          </div>

          <div class="footer">
            <p>This confirmation is issued in accordance with the terms and conditions governing trading relationships.</p>
            <p>Document generated on: ${new Date().toLocaleDateString()}</p>
            <p>Reference: ${trade.tradeId}-CLIENT</p>
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
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-3">
            <Building className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-blue-900">Client Trade Confirmation</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
          <div className="text-center mb-8 border-b-2 border-blue-600 pb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-blue-900">BARCLAYS</h1>
            </div>
            <p className="text-gray-600 text-lg">Trade Confirmation Department</p>
          </div>

          {/* Client Document Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Client Document</h2>
            <div className="space-y-2 mb-6">
              <p><strong>Issued by:</strong> Barclays</p>
              <p><strong>Trade Confirmation Department</strong></p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              This document provides formal confirmation of the trade executed on your behalf, with detailed information as below.
            </p>
          </div>

          {/* Trade Summary Table */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Trade Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 border-b border-gray-300">
                      Field
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 border-b border-l border-gray-300">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                      Trade Reference
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {trade.tradeId}
                    </td>
                  </tr>
                  {isEquityTrade && (
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                        Order Reference
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(trade as EquityTrade).orderId}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                      Trade Date
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {isEquityTrade ? (trade as EquityTrade).tradeDate : (trade as FXTrade).tradeDate}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                      Settlement Date
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {isEquityTrade ? (trade as EquityTrade).settlementDate : (trade as FXTrade).settlementDate}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                      Client Name/Institution
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {isEquityTrade ? `Client Account ${(trade as EquityTrade).clientId}` : `Trader ${(trade as FXTrade).traderId}`}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                      Counterparty
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {trade.counterparty}
                    </td>
                  </tr>
                  {isEquityTrade ? (
                    <>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                          Trading Venue
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {(trade as EquityTrade).tradingVenue}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                          Country
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {(trade as EquityTrade).countryOfTrade}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                          Currency Pair
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {(trade as FXTrade).currencyPair}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                          Product Type
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {(trade as FXTrade).productType}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trade Details */}
          {isEquityTrade ? (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Trade Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                        Transaction Type
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(trade as EquityTrade).tradeType}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                        Quantity
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(trade as EquityTrade).quantity.toLocaleString()} shares
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                        Price per Share
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(trade as EquityTrade).currency} {(trade as EquityTrade).price.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                        Total Trade Value
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-bold">
                        {(trade as EquityTrade).currency} {(trade as EquityTrade).tradeValue.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4">FX Trade Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                        Transaction Type
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(trade as FXTrade).buySell}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                        Base Currency
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(trade as FXTrade).baseCurrency}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                        Term Currency
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(trade as FXTrade).termCurrency}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                        Dealt Currency
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(trade as FXTrade).dealtCurrency}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p className="font-bold text-blue-900 mb-2">For any queries regarding this confirmation, please contact:</p>
            <p className="text-blue-800">Client Services Desk or contact your relationship manager</p>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-300 pt-6 text-sm text-gray-600">
            <p className="mb-2">This confirmation is issued in accordance with the terms and conditions governing trading relationships.</p>
            <div className="flex justify-between">
              <div>
                <p>Document generated on: {new Date().toLocaleDateString()}</p>
                <p>Reference: {trade.tradeId}-CLIENT</p>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientLetterModal;