import React from 'react';
import { Search, Filter } from 'lucide-react';

interface TradeFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  tradeTypeFilter: string;
  onTradeTypeFilterChange: (type: string) => void;
  counterpartyFilter: string;
  onCounterpartyFilterChange: (counterparty: string) => void;
  tradeDateFilter: string;
  onTradeDateFilterChange: (date: string) => void;
}

const TradeFilters: React.FC<TradeFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  tradeTypeFilter,
  onTradeTypeFilterChange,
  counterpartyFilter,
  onCounterpartyFilterChange,
  tradeDateFilter,
  onTradeDateFilterChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search trades..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Settled">Settled</option>
          <option value="Booked">Booked</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Disputed">Disputed</option>
        </select>
        
        <select
          value={tradeTypeFilter}
          onChange={(e) => onTradeTypeFilterChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
          <option value="Spot">Spot</option>
          <option value="Forward">Forward</option>
          <option value="Swap">Swap</option>
        </select>
        
        <select
          value={counterpartyFilter}
          onChange={(e) => onCounterpartyFilterChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Counterparties</option>
          <option value="Citibank">Citibank</option>
          <option value="Goldman Sachs">Goldman Sachs</option>
          <option value="Morgan Stanley">Morgan Stanley</option>
          <option value="JPMorgan">JPMorgan</option>
          <option value="HSBC">HSBC</option>
          <option value="Deutsche">Deutsche</option>
          <option value="BNP Paribas">BNP Paribas</option>
          <option value="Citi">Citi</option>
        </select>
        
        <input
          type="text"
          placeholder="Filter by trade date..."
          value={tradeDateFilter}
          onChange={(e) => onTradeDateFilterChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default TradeFilters;