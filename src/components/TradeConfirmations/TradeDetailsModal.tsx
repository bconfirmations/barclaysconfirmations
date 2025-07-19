import React, { useState } from 'react';
import { X, Download, Calendar, Building, User, DollarSign, Globe, FileText, AlertCircle, MessageSquare } from 'lucide-react';
import { EquityTrade, FXTrade } from '../../types/trade';
import { generateTradePDF } from '../../utils/pdfGenerator';
import BarclaysLetterModal from './BarclaysLetterModal';
import ClientLetterModal from './ClientLetterModal';
import BreakDetailsModal from './BreakDetailsModal';

interface TradeDetailsModalProps {
  trade: EquityTrade | FXTrade;
  onClose: () => void;
}

const TradeDetailsModal: React.FC<TradeDetailsModalProps> = ({ trade, onClose }) => {
  const [showBarclaysLetter, setShowBarclaysLetter] = useState(false);
  const [showClientLetter, setShowClientLetter] = useState(false);
  const [showBreakDetails, setShowBreakDetails] = useState(false);
  const isEquityTrade = 'quantity' in trade;

  const handleDownloadPDF = () => {
    generateTradePDF(trade);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Trade Details</h2>
              <p className="text-gray-500">{trade.tradeId}</p>
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

          <div className="p-6">
            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setShowBarclaysLetter(true)}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>Open Barclays Letter</span>
              </button>
              
              <button
                onClick={() => setShowClientLetter(true)}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Building className="w-5 h-5" />
                <span>Open Client Letter</span>
              </button>
              
              <button
                onClick={() => setShowBreakDetails(true)}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <AlertCircle className="w-5 h-5" />
                <span>View Break Details</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Trade Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Trade Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Trade ID:</span>
                      <span className="font-medium">{trade.tradeId}</span>
                    </div>
                    
                    {isEquityTrade && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Order ID:</span>
                          <span className="font-medium">{(trade as EquityTrade).orderId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Client ID:</span>
                          <span className="font-medium">{(trade as EquityTrade).clientId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Trade Type:</span>
                          <span className="font-medium">{(trade as EquityTrade).tradeType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Trading Venue:</span>
                          <span className="font-medium">{(trade as EquityTrade).tradingVenue}</span>
                        </div>
                      </>
                    )}
                    
                    {!isEquityTrade && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Currency Pair:</span>
                          <span className="font-medium">{(trade as FXTrade).currencyPair}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Buy/Sell:</span>
                          <span className="font-medium">{(trade as FXTrade).buySell}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Product Type:</span>
                          <span className="font-medium">{(trade as FXTrade).productType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Trader ID:</span>
                          <span className="font-medium">{(trade as FXTrade).traderId}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Financial Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Financial Details
                  </h3>
                  <div className="space-y-3">
                    {isEquityTrade && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Quantity:</span>
                          <span className="font-medium">{(trade as EquityTrade).quantity.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Price:</span>
                          <span className="font-medium">{(trade as EquityTrade).currency} {(trade as EquityTrade).price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Trade Value:</span>
                          <span className="font-medium text-lg">{(trade as EquityTrade).currency} {(trade as EquityTrade).tradeValue.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    
                    {!isEquityTrade && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Base Currency:</span>
                          <span className="font-medium">{(trade as FXTrade).baseCurrency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Term Currency:</span>
                          <span className="font-medium">{(trade as FXTrade).termCurrency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Dealt Currency:</span>
                          <span className="font-medium">{(trade as FXTrade).dealtCurrency}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Settlement and Status Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Settlement Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Trade Date:</span>
                      <span className="font-medium">
                        {isEquityTrade ? (trade as EquityTrade).tradeDate : (trade as FXTrade).tradeDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Settlement Date:</span>
                      <span className="font-medium">
                        {isEquityTrade ? (trade as EquityTrade).settlementDate : (trade as FXTrade).settlementDate}
                      </span>
                    </div>
                    {!isEquityTrade && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Value Date:</span>
                          <span className="font-medium">{(trade as FXTrade).valueDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Trade Time:</span>
                          <span className="font-medium">{(trade as FXTrade).tradeTime}</span>
                        </div>
                        {(trade as FXTrade).maturityDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Maturity Date:</span>
                            <span className="font-medium">{(trade as FXTrade).maturityDate}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Counterparty & Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Counterparty:</span>
                      <span className="font-medium">{trade.counterparty}</span>
                    </div>
                    
                    {isEquityTrade && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Trader Name:</span>
                          <span className="font-medium">{(trade as EquityTrade).traderName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Country:</span>
                          <span className="font-medium">{(trade as EquityTrade).countryOfTrade}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Confirmation Status:</span>
                          <span className="font-medium">{(trade as EquityTrade).confirmationStatus}</span>
                        </div>
                      </>
                    )}
                    
                    {!isEquityTrade && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Trade Status:</span>
                          <span className="font-medium">{(trade as FXTrade).tradeStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Confirmation Method:</span>
                          <span className="font-medium">{(trade as FXTrade).confirmationMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Confirmation Status:</span>
                          <span className="font-medium">{(trade as FXTrade).confirmationStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amendment Flag:</span>
                          <span className="font-medium">{(trade as FXTrade).amendmentFlag}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBarclaysLetter && (
        <BarclaysLetterModal
          trade={trade}
          onClose={() => setShowBarclaysLetter(false)}
        />
      )}

      {showClientLetter && (
        <ClientLetterModal
          trade={trade}
          onClose={() => setShowClientLetter(false)}
        />
      )}

      {showBreakDetails && (
        <BreakDetailsModal
          trade={trade}
          onClose={() => setShowBreakDetails(false)}
        />
      )}
    </>
  );
};

export default TradeDetailsModal;