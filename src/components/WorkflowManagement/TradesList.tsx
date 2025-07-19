import React, { useState, useMemo } from 'react';
import { Search, Eye, Calendar, Building, User } from 'lucide-react';
import { EquityTrade, FXTrade, TradeFilter } from '../../types/trade';

interface TradesListProps {
  equityTrades: EquityTrade[];
  fxTrades: FXTrade[];
  filter: TradeFilter;
}

const TradesList: React.FC<TradesListProps> = ({ equityTrades, fxTrades, filter }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getWorkflowStageFromStatus = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Confirmation Generation';
      case 'confirmed':
        return 'Counterparty Matching';
      case 'settled':
        return 'Post-Settlement';
      case 'failed':
      case 'disputed':
        return 'Exception Handling';
      case 'booked':
        return 'Trade Enrichment';
      case 'cancelled':
        return 'Exception Handling';
      default:
        return 'Trade Capture';
    }
  };

  const getCurrentTradeStage = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Matching';
      case 'settled':
        return 'CCNR';
      case 'failed':
      case 'disputed':
        return 'Drafting';
      case 'booked':
        return 'Matching';
      case 'cancelled':
        return 'Drafting';
      default:
        return 'Pending';
    }
  };

  const getNextActionOwner = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Trading';
      case 'confirmed':
        return 'Settlements';
      case 'settled':
        return 'Completed';
      case 'failed':
      case 'disputed':
        return 'Legal';
      case 'booked':
        return 'Sales';
      case 'cancelled':
        return 'Legal';
      default:
        return 'Trading';
    }
  };

  const allTrades = useMemo(() => {
    const filteredEquityTrades = filter === 'fx' ? [] : equityTrades;
    const filteredFxTrades = filter === 'equity' ? [] : fxTrades;
    return [...filteredEquityTrades, ...filteredFxTrades];
  }, [equityTrades, fxTrades, filter]);

  const filteredTrades = useMemo(() => {
    return allTrades.filter(trade => {
      const isEquityTrade = 'quantity' in trade;
      
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          trade.tradeId.toLowerCase().includes(searchLower) ||
          trade.counterparty.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [allTrades, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">All Trades</h3>
        <span className="text-sm text-gray-500">
          {filteredTrades.length} of {allTrades.length} trades
        </span>
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search trades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Trades Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trade ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Counterparty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Action Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trade Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTrades.map((trade) => {
              const isEquityTrade = 'quantity' in trade;
              const status = isEquityTrade 
                ? (trade as EquityTrade).confirmationStatus 
                : (trade as FXTrade).tradeStatus;
              const currentStage = getCurrentTradeStage(status);
              const nextActionOwner = getNextActionOwner(status);
              const tradeDate = isEquityTrade 
                ? (trade as EquityTrade).tradeDate 
                : (trade as FXTrade).tradeDate;

              return (
                <tr key={trade.tradeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {trade.tradeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isEquityTrade ? 'Equity' : 'FX'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trade.counterparty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {currentStage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {nextActionOwner}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tradeDate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredTrades.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No trades found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
};

export default TradesList;