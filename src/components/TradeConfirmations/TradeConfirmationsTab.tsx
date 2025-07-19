import React, { useState, useMemo } from 'react';
import { EquityTrade, FXTrade } from '../../types/trade';
import TradeFilters from './TradeFilters';
import TradeCard from './TradeCard';

interface TradeConfirmationsTabProps {
  equityTrades: EquityTrade[];
  fxTrades: FXTrade[];
}

const TradeConfirmationsTab: React.FC<TradeConfirmationsTabProps> = ({
  equityTrades,
  fxTrades,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tradeTypeFilter, setTradeTypeFilter] = useState('');
  const [counterpartyFilter, setCounterpartyFilter] = useState('');
  const [tradeDateFilter, setTradeDateFilter] = useState('');

  const allTrades = useMemo(() => {
    return [...equityTrades, ...fxTrades];
  }, [equityTrades, fxTrades]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const stats = {
      total: allTrades.length,
      completed: 0,
      inProgress: 0,
      completionRate: 0
    };

    allTrades.forEach(trade => {
      const isEquityTrade = 'quantity' in trade;
      const status = isEquityTrade 
        ? (trade as EquityTrade).confirmationStatus 
        : (trade as FXTrade).tradeStatus;
      
      if (status.toLowerCase() === 'settled') {
        stats.completed++;
      } else {
        stats.inProgress++;
      }
    });

    stats.completionRate = allTrades.length > 0 ? (stats.completed / allTrades.length) * 100 : 0;
    return stats;
  }, [allTrades]);

  const filteredTrades = useMemo(() => {
    return allTrades.filter(trade => {
      const isEquityTrade = 'quantity' in trade;
      
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          trade.tradeId.toLowerCase().includes(searchLower) ||
          trade.counterparty.toLowerCase().includes(searchLower) ||
          (isEquityTrade && (trade as EquityTrade).clientId.toLowerCase().includes(searchLower)) ||
          (!isEquityTrade && (trade as FXTrade).currencyPair.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter) {
        const tradeStatus = isEquityTrade 
          ? (trade as EquityTrade).confirmationStatus 
          : (trade as FXTrade).tradeStatus;
        if (tradeStatus !== statusFilter) return false;
      }

      // Trade type filter
      if (tradeTypeFilter) {
        if (isEquityTrade) {
          if ((trade as EquityTrade).tradeType !== tradeTypeFilter) return false;
        } else {
          if ((trade as FXTrade).productType !== tradeTypeFilter) return false;
        }
      }

      // Counterparty filter
      if (counterpartyFilter) {
        if (trade.counterparty !== counterpartyFilter) return false;
      }

      // Trade date filter
      if (tradeDateFilter) {
        const tradeDate = isEquityTrade 
          ? (trade as EquityTrade).tradeDate 
          : (trade as FXTrade).tradeDate;
        if (!tradeDate.includes(tradeDateFilter)) return false;
      }

      return true;
    });
  }, [allTrades, searchTerm, statusFilter, tradeTypeFilter, counterpartyFilter, tradeDateFilter]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trade Confirmations</h2>
        <p className="text-gray-600">
          Manage and view all trade confirmations. Total trades: {allTrades.length}
        </p>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trades</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">T</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{summaryStats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-blue-600">{summaryStats.completionRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{summaryStats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
        </div>
      </div>

      <TradeFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        tradeTypeFilter={tradeTypeFilter}
        onTradeTypeFilterChange={setTradeTypeFilter}
        counterpartyFilter={counterpartyFilter}
        onCounterpartyFilterChange={setCounterpartyFilter}
        tradeDateFilter={tradeDateFilter}
        onTradeDateFilterChange={setTradeDateFilter}
      />

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredTrades.length} of {allTrades.length} trades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrades.map((trade) => (
          <TradeCard key={trade.tradeId} trade={trade} />
        ))}
      </div>

      {filteredTrades.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No trades found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default TradeConfirmationsTab;