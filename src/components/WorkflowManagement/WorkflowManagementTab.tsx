import React, { useState, useMemo } from 'react';
import { EquityTrade, FXTrade, TradeFilter } from '../../types/trade';
import WorkflowCharts from './WorkflowCharts';
import TradesList from './TradesList';
import EscalationMatrix from './EscalationMatrix';

interface WorkflowManagementTabProps {
  equityTrades: EquityTrade[];
  fxTrades: FXTrade[];
}

const WorkflowManagementTab: React.FC<WorkflowManagementTabProps> = ({
  equityTrades,
  fxTrades,
}) => {
  const [filter, setFilter] = useState<TradeFilter>('all');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [chartCategory, setChartCategory] = useState<'status' | 'nextAction' | 'tradeStages'>('status');

  const filteredTrades = useMemo(() => {
    const filteredEquityTrades = filter === 'fx' ? [] : equityTrades;
    const filteredFxTrades = filter === 'equity' ? [] : fxTrades;
    return [...filteredEquityTrades, ...filteredFxTrades];
  }, [equityTrades, fxTrades, filter]);

  // Calculate trade stage counts
  const tradeStageStats = useMemo(() => {
    const stats = {
      matching: 0,
      drafting: 0,
      pendingClientConfirmation: 0,
      ccnr: 0
    };

    filteredTrades.forEach(trade => {
      const isEquityTrade = 'quantity' in trade;
      const status = isEquityTrade 
        ? (trade as EquityTrade).confirmationStatus 
        : (trade as FXTrade).tradeStatus;
      
      switch (status.toLowerCase()) {
        case 'pending':
          stats.pendingClientConfirmation++;
          break;
        case 'confirmed':
        case 'booked':
          stats.matching++;
          break;
        case 'settled':
          stats.ccnr++;
          break;
        case 'failed':
        case 'disputed':
        case 'cancelled':
          stats.drafting++;
          break;
        default:
          stats.pendingClientConfirmation++;
      }
    });

    return stats;
  }, [filteredTrades]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Workflow Management</h2>
        <p className="text-gray-600">
          Monitor and analyze trade processing workflow across all stages
        </p>
      </div>

      {/* Trade Stage Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Matching</p>
              <p className="text-2xl font-bold text-purple-600">{tradeStageStats.matching}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold">M</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafting</p>
              <p className="text-2xl font-bold text-orange-600">{tradeStageStats.drafting}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 font-bold">D</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Client Confirmation</p>
              <p className="text-2xl font-bold text-yellow-600">{tradeStageStats.pendingClientConfirmation}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold">P</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CCNR</p>
              <p className="text-2xl font-bold text-green-600">{tradeStageStats.ccnr}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Type Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Trade Type Filter</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              All Trades
            </button>
            <button
              onClick={() => setFilter('equity')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'equity'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Equity Trades
            </button>
            <button
              onClick={() => setFilter('fx')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'fx'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              FX Trades
            </button>
          </div>
        </div>
      </div>

      {/* Trade Status Distribution Chart */}
      <WorkflowCharts
        data={filteredTrades}
        chartType={chartType}
        chartCategory={chartCategory}
        onChartTypeChange={setChartType}
        onChartCategoryChange={setChartCategory}
        filter={filter}
      />

      {/* Potential Escalation Requirements */}
      <EscalationMatrix trades={filteredTrades} filter={filter} />

      {/* Trades List */}
      <TradesList 
        equityTrades={filter === 'fx' ? [] : equityTrades}
        fxTrades={filter === 'equity' ? [] : fxTrades}
        filter={filter}
      />
    </div>
  );
};

export default WorkflowManagementTab;