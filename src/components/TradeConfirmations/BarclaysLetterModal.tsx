import React from 'react';
import { X, Download, Building2 } from 'lucide-react';
import { EquityTrade, FXTrade } from '../../types/trade';

interface BarclaysLetterModalProps {
  trade: EquityTrade | FXTrade;
  onClose: () => void;
}

const BarclaysLetterModal: React.FC<BarclaysLetterModalProps> = ({ trade, onClose }) => {
  const isEquityTrade = 'quantity' in trade;

  const handleDownloadPDF = () => {
    // Create a simple HTML content for PDF generation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Barclays Trade Confirmation - ${trade.tradeId}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { color: #1e40af; font-size: 24px; font-weight: bold; }
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
            <div class="logo">BARCLAYS BANK PLC</div>
            <p>Trade Confirmation Department</p>
            <p>1 Churchill Place, London E14 5HP, United Kingdom</p>
            <p>Authorized by the Prudential Regulation Authority</p>
          </div>
          
          <h2 style="text-align: center;">TRADE CONFIRMATION NOTICE</h2>
          <p style="text-align: center;">This document serves as formal confirmation of the trade executed as detailed below</p>
          
          <div class="section">
            <h3>TRADE IDENTIFICATION</h3>
            <div class="field">
              <span class="label">Trade Reference:</span>
              <span class="value">${trade.tradeId}</span>
            </div>
            ${isEquityTrade ? `
              <div class="field">
                <span class="label">Order Reference:</span>
                <span class="value">${(trade as EquityTrade).orderId}</span>
              </div>
            ` : ''}
            <div class="field">
              <span class="label">Trade Date:</span>
              <span class="value">${isEquityTrade ? (trade as EquityTrade).tradeDate : (trade as FXTrade).tradeDate}</span>
            </div>
            <div class="field">
              <span class="label">Settlement Date:</span>
              <span class="value">${isEquityTrade ? (trade as EquityTrade).settlementDate : (trade as FXTrade).settlementDate}</span>
            </div>
          </div>

          <div class="section">
            <h3>COUNTERPARTY DETAILS</h3>
            <div class="field">
              <span class="label">Institution:</span>
              <span class="value">${trade.counterparty}</span>
            </div>
            ${isEquityTrade ? `
              <div class="field">
                <span class="label">Trading Venue:</span>
                <span class="value">${(trade as EquityTrade).tradingVenue}</span>
              </div>
              <div class="field">
                <span class="label">Country:</span>
                <span class="value">${(trade as EquityTrade).countryOfTrade}</span>
              </div>
            ` : ''}
          </div>

          <div class="section">
            <h3>TRADE SPECIFICATIONS</h3>
            ${isEquityTrade ? `
              <div class="field">
                <span class="label">Transaction Type:</span>
                <span class="value">${(trade as EquityTrade).tradeType}</span>
              </div>
              <div class="field">
                <span class="label">Quantity:</span>
                <span class="value">${(trade as EquityTrade).quantity.toLocaleString()} shares</span>
              </div>
              <div class="field">
                <span class="label">Price per Share:</span>
                <span class="value">${(trade as EquityTrade).currency} ${(trade as EquityTrade).price.toFixed(2)}</span>
              </div>
              <div class="field">
                <span class="label">Total Trade Value:</span>
                <span class="value">${(trade as EquityTrade).currency} ${(trade as EquityTrade).tradeValue.toLocaleString()}</span>
              </div>
              <div class="field">
                <span class="label">Client ID:</span>
                <span class="value">${(trade as EquityTrade).clientId}</span>
              </div>
            ` : `
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
              <div class="field">
                <span class="label">Base Currency:</span>
                <span class="value">${(trade as FXTrade).baseCurrency}</span>
              </div>
              <div class="field">
                <span class="label">Term Currency:</span>
                <span class="value">${(trade as FXTrade).termCurrency}</span>
              </div>
            `}
          </div>

          <div class="section">
            <h3>BANK APPROVAL & AUTHORIZATION</h3>
            <div class="field">
              <span class="label">Bank Authorization:</span>
              <span class="value" style="color: green; font-weight: bold;">APPROVED</span>
            </div>
            <div class="field">
              <span class="label">Authorized By:</span>
              <span class="value">Senior Trade Operations Manager</span>
            </div>
            <div class="field">
              <span class="label">Trader:</span>
              <span class="value">${isEquityTrade ? (trade as EquityTrade).traderName : 'Trader A'}</span>
            </div>
            <div class="field">
              <span class="label">Authorization Date:</span>
              <span class="value">17 July 2025</span>
            </div>
            <div class="field">
              <span class="label">Digital Signature:</span>
              <span class="value" style="color: blue; font-weight: bold;">VERIFIED</span>
            </div>
            <div class="field">
              <span class="label">Operations Notes:</span>
              <span class="value">${isEquityTrade ? (trade as EquityTrade).opsTeamNotes || 'Clean' : 'Clean'}</span>
            </div>
          </div>

          <div class="footer">
            <p><strong>IMPORTANT LEGAL NOTICE:</strong></p>
            <p>This confirmation is issued in accordance with the terms and conditions governing trading relationships between Barclays Bank PLC and the counterparty. This document constitutes a legally binding confirmation of the trade details specified herein.</p>
            <p>Any discrepancies must be reported immediately to the Trade Confirmation Department. Failure to object within 24 hours of receipt shall constitute acceptance of all terms.</p>
            <p>This trade is subject to the standard terms and conditions of Barclays Bank PLC and applicable regulatory requirements including but not limited to MiFID II, EMIR, and relevant local regulations.</p>
            <br>
            <div style="text-align: right;">
              <p><strong>BARCLAYS BANK PLC</strong></p>
              <p>Trade Confirmation Department</p>
              <p>Authorized Signature</p>
            </div>
            <p>Document Generated: 17 July 2025</p>
            <p>Reference: ${trade.tradeId}-CONF</p>
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
    a.download = `barclays-confirmation-${trade.tradeId}.html`;
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
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-blue-900">Trade Confirmation Document</h2>
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
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-blue-900">BARCLAYS BANK PLC</h1>
            </div>
            <p className="text-gray-600">Trade Confirmation Department</p>
            <p className="text-gray-600">1 Churchill Place, London E14 5HP, United Kingdom</p>
            <p className="text-gray-600">Authorized by the Prudential Regulation Authority</p>
          </div>

          <hr className="border-gray-300 mb-8" />

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">TRADE CONFIRMATION NOTICE</h2>
            <p className="text-gray-600">This document serves as formal confirmation of the trade executed as detailed below</p>
          </div>

          {/* Content in two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Trade Identification */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">TRADE IDENTIFICATION</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Trade Reference:</span>
                    <span>{trade.tradeId}</span>
                  </div>
                  {isEquityTrade && (
                    <div className="flex justify-between">
                      <span className="font-medium">Order Reference:</span>
                      <span>{(trade as EquityTrade).orderId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Trade Date:</span>
                    <span>{isEquityTrade ? (trade as EquityTrade).tradeDate : (trade as FXTrade).tradeDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Settlement Date:</span>
                    <span>{isEquityTrade ? (trade as EquityTrade).settlementDate : (trade as FXTrade).settlementDate}</span>
                  </div>
                </div>
              </div>

              {/* Trade Specifications */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">TRADE SPECIFICATIONS</h3>
                <div className="space-y-2">
                  {isEquityTrade ? (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">Transaction Type:</span>
                        <span>{(trade as EquityTrade).tradeType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Quantity:</span>
                        <span>{(trade as EquityTrade).quantity.toLocaleString()} shares</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Price per Share:</span>
                        <span>{(trade as EquityTrade).currency} {(trade as EquityTrade).price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Trade Value:</span>
                        <span className="text-lg font-bold">{(trade as EquityTrade).currency} {(trade as EquityTrade).tradeValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Client ID:</span>
                        <span>{(trade as EquityTrade).clientId}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">Currency Pair:</span>
                        <span>{(trade as FXTrade).currencyPair}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Transaction Type:</span>
                        <span>{(trade as FXTrade).buySell}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Product Type:</span>
                        <span>{(trade as FXTrade).productType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Base Currency:</span>
                        <span>{(trade as FXTrade).baseCurrency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Term Currency:</span>
                        <span>{(trade as FXTrade).termCurrency}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Counterparty Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">COUNTERPARTY DETAILS</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Institution:</span>
                    <span>{trade.counterparty}</span>
                  </div>
                  {isEquityTrade && (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">Trading Venue:</span>
                        <span>{(trade as EquityTrade).tradingVenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Country:</span>
                        <span>{(trade as EquityTrade).countryOfTrade}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bank Approval */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">BANK APPROVAL & AUTHORIZATION</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Bank Authorization:</span>
                    <span className="text-green-600 font-bold">APPROVED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Authorized By:</span>
                    <span>Senior Trade Operations Manager</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Trader:</span>
                    <span>{isEquityTrade ? (trade as EquityTrade).traderName : 'Trader A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Authorization Date:</span>
                    <span>17 July 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Digital Signature:</span>
                    <span className="text-blue-600 font-bold">VERIFIED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Operations Notes:</span>
                    <span>{isEquityTrade ? (trade as EquityTrade).opsTeamNotes || 'Clean' : 'Clean'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-300 my-8" />

          {/* Legal Notice */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-3">IMPORTANT LEGAL NOTICE:</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>This confirmation is issued in accordance with the terms and conditions governing trading relationships between Barclays Bank PLC and the counterparty. This document constitutes a legally binding confirmation of the trade details specified herein.</p>
              <p>Any discrepancies must be reported immediately to the Trade Confirmation Department. Failure to object within 24 hours of receipt shall constitute acceptance of all terms.</p>
              <p>This trade is subject to the standard terms and conditions of Barclays Bank PLC and applicable regulatory requirements including but not limited to MiFID II, EMIR, and relevant local regulations.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end mt-8 pt-6 border-t border-gray-300">
            <div className="text-sm text-gray-600">
              <p>Document Generated: 17 July 2025</p>
              <p>Reference: {trade.tradeId}-CONF</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">BARCLAYS BANK PLC</p>
              <p className="text-gray-600">Trade Confirmation Department</p>
              <p className="text-gray-600">Authorized Signature</p>
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

export default BarclaysLetterModal;