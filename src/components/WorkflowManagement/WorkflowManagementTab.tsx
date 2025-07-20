import React, { useState, useMemo } from 'react';
import { EquityTrade, FXTrade, TradeFilter } from '../../types/trade';
import { BarChart3, PieChart } from 'lucide-react';
import EscalationMatrix from './EscalationMatrix';
import TradesList from './TradesList';

interface WorkflowManagementTabProps {
  equityTrades: EquityTrade[];
  fxTrades: FXTrade[];
}

const WorkflowManagementTab: React.FC<WorkflowManagementTabProps> = ({
  equityTrades,
  fxTrades,
}) => {
  const [filter, setFilter] = useState<TradeFilter>('all');
  const [escalationFilter, setEscalationFilter] = useState('all');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

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

  // Calculate next action owner analytics
  const nextActionOwnerStats = useMemo(() => {
    const stats = {
      settlements: 0,
      trading: 0,
      sales: 0,
      legal: 0,
      completed: 0
    };

    filteredTrades.forEach(trade => {
      const isEquityTrade = 'quantity' in trade;
      const status = isEquityTrade 
        ? (trade as EquityTrade).confirmationStatus 
        : (trade as FXTrade).tradeStatus;
      
      switch (status.toLowerCase()) {
        case 'pending':
          stats.trading++;
          break;
        case 'confirmed':
          stats.settlements++;
          break;
        case 'settled':
          stats.completed++;
          break;
        case 'failed':
        case 'disputed':
          stats.legal++;
          break;
        case 'booked':
          stats.sales++;
          break;
        case 'cancelled':
          stats.legal++;
          break;
        default:
          stats.trading++;
      }
    });

    return stats;
  }, [filteredTrades]);

  // Calculate workflow stage analytics
  const workflowStageStats = useMemo(() => {
    const stats = {
      matching: 0,
      drafting: 0,
      pending: 0,
      ccnr: 0
    };

    filteredTrades.forEach(trade => {
      const isEquityTrade = 'quantity' in trade;
      const status = isEquityTrade 
        ? (trade as EquityTrade).confirmationStatus 
        : (trade as FXTrade).tradeStatus;
      
      switch (status.toLowerCase()) {
        case 'pending':
          stats.pending++;
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
          stats.pending++;
      }
    });

    return stats;
  }, [filteredTrades]);

  const renderChart = (data: any[], title: string, colors: string[]) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    if (chartType === 'bar') {
      const maxValue = Math.max(...data.map(item => item.value));
      
      return (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Total: {total}
          </div>
          <div className="space-y-4">
            {data.map((item, index) => {
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
              const barWidth = maxValue > 0 ? Math.max((item.value / maxValue) * 100, 8) : 8;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 text-sm">{item.name}</span>
                    <span className="text-gray-600 text-sm font-medium">{item.value} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-3"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: colors[index % colors.length],
                        minWidth: item.value > 0 ? '60px' : '0px'
                      }}
                    >
                      {item.value > 0 && (
                        <span className="text-white text-sm font-bold">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      // Pie chart
      const radius = 80;
      const centerX = 100;
      const centerY = 100;
      let currentAngle = 0;

      return (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Total: {total}
          </div>
          <svg width="200" height="200" className="drop-shadow-sm">
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              const angle = (item.value / total) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = centerX + radius * Math.cos(startAngleRad);
              const y1 = centerY + radius * Math.sin(startAngleRad);
              const x2 = centerX + radius * Math.cos(endAngleRad);
              const y2 = centerY + radius * Math.sin(endAngleRad);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              );
            })}
          </svg>
          
          {/* Legend */}
          <div className="space-y-2 max-w-xs">
            {data.map((item, index) => {
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
              return (
                <div key={index} className="flex items-center justify-between space-x-3">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.value} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Next Action Owner Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Next Action Owner</h3>
            
            {/* Chart Type Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('bar')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  chartType === 'bar'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Bar Chart</span>
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  chartType === 'pie'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <PieChart className="w-4 h-4" />
                <span>Pie Chart</span>
              </button>
            </div>
          </div>

          <div className="min-h-[300px] flex items-center justify-center">
            {renderChart(
              [
                { name: 'Settlements', value: nextActionOwnerStats.settlements },
                { name: 'Trading', value: nextActionOwnerStats.trading },
                { name: 'Sales', value: nextActionOwnerStats.sales },
                { name: 'Legal', value: nextActionOwnerStats.legal },
                { name: 'Completed', value: nextActionOwnerStats.completed }
              ],
              'Next Action Owner',
              ['#3B82F6', '#10B981', '#06B6D4', '#8B5CF6', '#059669']
            )}
          </div>
        </div>

        {/* Workflow Stages Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Workflow Stages</h3>
            
            {/* Chart Type Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('bar')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  chartType === 'bar'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Bar Chart</span>
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  chartType === 'pie'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <PieChart className="w-4 h-4" />
                <span>Pie Chart</span>
              </button>
            </div>
          </div>

          <div className="min-h-[300px] flex items-center justify-center">
            {renderChart(
              [
                { name: 'Matching', value: workflowStageStats.matching },
                { name: 'Drafting', value: workflowStageStats.drafting },
                { name: 'Pending', value: workflowStageStats.pending },
                { name: 'CCNR', value: workflowStageStats.ccnr }
              ],
              'Workflow Stages',
              ['#059669', '#0891B2', '#0284C7', '#1D4ED8']
            )}
          </div>
        </div>
      </div>

      {/* Potential Escalation Requirements */}
      <EscalationMatrix 
        trades={filteredTrades} 
        escalationFilter={escalationFilter}
        onEscalationFilterChange={setEscalationFilter}
      />

      {/* Trades List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Trades</h3>
          <span className="text-sm text-gray-500">
            {filteredTrades.length} trades
          </span>
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
                  Trade Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrades.slice(0, 20).map((trade) => {
                const isEquityTrade = 'quantity' in trade;
                const status = isEquityTrade 
                  ? (trade as EquityTrade).confirmationStatus 
                  : (trade as FXTrade).tradeStatus;
                const tradeDate = isEquityTrade 
                  ? (trade as EquityTrade).tradeDate 
                  : (trade as FXTrade).tradeDate;

                const getStatusColor = (status: string) => {
                  switch (status.toLowerCase()) {
                    case 'confirmed':
                      return 'bg-blue-100 text-blue-800';
                    case 'settled':
                      return 'bg-green-100 text-green-800';
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
    </div>
  );
};

export default WorkflowManagementTab;