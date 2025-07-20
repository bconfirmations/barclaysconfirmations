import React, { useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { EquityTrade, FXTrade, TradeFilter } from '../../types/trade';

interface EscalationMatrixProps {
  trades: (EquityTrade | FXTrade)[];
  escalationFilter: string;
  onEscalationFilterChange: (filter: string) => void;
}

const EscalationMatrix: React.FC<EscalationMatrixProps> = ({ trades, escalationFilter, onEscalationFilterChange }) => {

  // Calculate escalation requirements based on trade status and mock SLA data
  const calculateEscalations = () => {
    const escalations = {
      legal: 0,
      trading: 0,
      sales: 0,
      middleOffice: 0
    };

    let filteredTrades = trades;
    
    // Filter trades based on escalation filter
    if (escalationFilter !== 'all') {
      filteredTrades = trades.filter(trade => {
        const isEquityTrade = 'quantity' in trade;
        const status = isEquityTrade 
          ? (trade as EquityTrade).confirmationStatus 
          : (trade as FXTrade).tradeStatus;
        
        switch (escalationFilter) {
          case 'legal':
            return status.toLowerCase() === 'failed' || status.toLowerCase() === 'disputed';
          case 'trading':
            return status.toLowerCase() === 'pending';
          case 'sales':
            return status.toLowerCase() === 'confirmed';
          case 'middleOffice':
            return status.toLowerCase() === 'booked';
          default:
            return true;
        }
      });
    }

    filteredTrades.forEach(trade => {
      const isEquityTrade = 'quantity' in trade;
      const status = isEquityTrade 
        ? (trade as EquityTrade).confirmationStatus 
        : (trade as FXTrade).tradeStatus;

      // Mock SLA calculation - in real scenario, this would be based on actual timestamps
      const randomDays = Math.floor(Math.random() * 5);
      
      switch (status.toLowerCase()) {
        case 'failed':
        case 'disputed':
          if (randomDays > 3) escalations.legal++;
          break;
        case 'pending':
          if (randomDays > 1) escalations.trading++;
          break;
        case 'confirmed':
          if (randomDays > 1) escalations.sales++;
          break;
        case 'booked':
          escalations.middleOffice++;
          break;
      }
    });

    return escalations;
  };

  const escalations = calculateEscalations();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Potential Escalation Requirements</h3>
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <select
            value={escalationFilter}
            onChange={(e) => onEscalationFilterChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="legal">Legal</option>
            <option value="trading">Trading</option>
            <option value="sales">Sales</option>
            <option value="middleOffice">Middle Office</option>
          </select>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Trades requiring escalation due to missed SLA responses
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-300">
                Department
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b border-l border-gray-300">
                Legal
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b border-l border-gray-300">
                Trading
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b border-l border-gray-300">
                Sales
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b border-l border-gray-300">
                Middle Office
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-300">
                Number Pending SLA
              </td>
              <td className="px-4 py-3 text-center border-b border-l border-gray-300">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                  escalations.legal > 0 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {escalations.legal}
                </span>
              </td>
              <td className="px-4 py-3 text-center border-b border-l border-gray-300">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                  escalations.trading > 0 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {escalations.trading}
                </span>
              </td>
              <td className="px-4 py-3 text-center border-b border-l border-gray-300">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                  escalations.sales > 0 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {escalations.sales}
                </span>
              </td>
              <td className="px-4 py-3 text-center border-b border-l border-gray-300">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                  escalations.middleOffice > 0 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {escalations.middleOffice}
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                Defined SLA
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-600 border-l border-gray-300">
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>3 days</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-600 border-l border-gray-300">
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>1 day</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-600 border-l border-gray-300">
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>1 day</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-600 border-l border-gray-300">
                —
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">SLA Monitoring</p>
            <p className="text-sm text-yellow-700">
              Trades exceeding defined SLA timeframes require immediate attention and potential escalation to management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscalationMatrix;