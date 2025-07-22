import React, { useState } from 'react';
import { Eye, Download, Calendar, Building, User, AlertCircle } from 'lucide-react';
import { EquityTrade, FXTrade } from '../../types/trade';
import { generateTradePDF } from '../../utils/pdfGenerator';
import TradeDetailsModal from './TradeDetailsModal';
import LifecycleIndicator from '../Lifecycle/LifecycleIndicator';
import { TradeLifecycle } from '../../types/lifecycle';

interface TradeCardProps {
  trade: EquityTrade | FXTrade;
  lifecycle?: TradeLifecycle;
}

const TradeCard: React.FC<TradeCardProps> = ({ trade, lifecycle }) => {
  const [showDetails, setShowDetails] = useState(false);
  const isEquityTrade = 'quantity' in trade;
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'settled':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'disputed':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadPDF = () => {
    generateTradePDF(trade);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{trade.tradeId}</h3>
            <p className="text-sm text-gray-500">
              {isEquityTrade ? 'Equity Trade' : 'FX Trade'}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            getStatusColor(isEquityTrade ? (trade as EquityTrade).confirmationStatus : (trade as FXTrade).tradeStatus)
          }`}>
            {isEquityTrade ? (trade as EquityTrade).confirmationStatus : (trade as FXTrade).tradeStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Trade Date</p>
              <p className="text-sm font-medium">
                {isEquityTrade ? (trade as EquityTrade).tradeDate : (trade as FXTrade).tradeDate}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Counterparty</p>
              <p className="text-sm font-medium">{trade.counterparty}</p>
            </div>
          </div>
        </div>

        {isEquityTrade && (
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Trade Value</span>
              <span className="text-lg font-semibold text-gray-900">
                {(trade as EquityTrade).currency} {(trade as EquityTrade).tradeValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-500">Quantity</span>
              <span className="text-sm font-medium">
                {(trade as EquityTrade).quantity.toLocaleString()} @ {(trade as EquityTrade).price}
              </span>
            </div>
          </div>
        )}

        {!isEquityTrade && (
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Currency Pair</span>
              <span className="text-lg font-semibold text-gray-900">
                {(trade as FXTrade).currencyPair}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-500">Product Type</span>
              <span className="text-sm font-medium">
                {(trade as FXTrade).productType}
              </span>
            </div>
          </div>
        )}

        {lifecycle && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <LifecycleIndicator lifecycle={lifecycle} compact />
            <div className="mt-2 text-xs text-gray-600">
              Current Stage: <span className="font-medium">{lifecycle.currentStage}</span>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={() => setShowDetails(true)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
          
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {showDetails && (
        <TradeDetailsModal
          trade={trade}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default TradeCard;