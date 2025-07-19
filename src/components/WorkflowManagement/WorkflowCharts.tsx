import React from 'react';
import { BarChart3, PieChart } from 'lucide-react';
import { EquityTrade, FXTrade, TradeFilter } from '../../types/trade';

interface WorkflowChartsProps {
  data: (EquityTrade | FXTrade)[];
  chartType: 'bar' | 'pie';
  chartCategory: 'status' | 'nextAction' | 'tradeStages';
  onChartTypeChange: (type: 'bar' | 'pie') => void;
  onChartCategoryChange: (category: 'status' | 'nextAction' | 'tradeStages') => void;
  filter: TradeFilter;
}

const WorkflowCharts: React.FC<WorkflowChartsProps> = ({
  data,
  chartType,
  chartCategory,
  onChartTypeChange,
  onChartCategoryChange,
  filter,
}) => {
  const getChartData = () => {
    if (!data || data.length === 0) return [];

    // For this redesigned version, we only show trade status distribution
    const statusCounts = data.reduce((acc: any, trade: any) => {
      const isEquityTrade = 'quantity' in trade;
      const status = isEquityTrade 
        ? (trade as EquityTrade).confirmationStatus 
        : (trade as FXTrade).tradeStatus;
      
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([name, value], index) => ({
      name,
      value: value as number,
      color: getStatusColor(name)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '#8B5CF6'; // Purple
      case 'settled':
        return '#A855F7'; // Purple variant
      case 'pending':
        return '#C084FC'; // Light purple
      case 'failed':
        return '#F59E0B'; // Orange (instead of red)
      case 'disputed':
        return '#F97316'; // Orange variant
      case 'cancelled':
        return '#6B7280'; // Gray
      case 'booked':
        return '#D946EF'; // Magenta purple
      default:
        return '#9333EA'; // Default purple
    }
  };

  const chartData = getChartData();
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const renderBarChart = () => {
    const maxValue = Math.max(...chartData.map(item => item.value));
    
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Total Trades: {total}
        </div>
        <div className="space-y-4">
          {chartData.map((item, index) => {
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
                      backgroundColor: item.color,
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
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-3">Legend:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    let currentAngle = 0;

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Total Trades: {total}
        </div>
        <svg width="200" height="200" className="drop-shadow-sm">
          {chartData.map((item, index) => {
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
                fill={item.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity duration-200"
              />
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="space-y-2 max-w-xs">
          {chartData.map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
            return (
              <div key={index} className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
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
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Trade Status Distribution</h3>
        
        {/* Chart Type Toggle */}
        <div className="flex space-x-2">
          <button
            onClick={() => onChartTypeChange('bar')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Bar Chart</span>
          </button>
          <button
            onClick={() => onChartTypeChange('pie')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              chartType === 'pie'
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Pie Chart</span>
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filter === 'all' ? 'All Trades' : filter === 'equity' ? 'Equity Trades Only' : 'FX Trades Only'}
        </div>
      </div>

      <div className="min-h-[300px] flex items-center justify-center">
        {chartData.length === 0 ? (
          <div className="text-center text-gray-500">
            <div className="text-lg mb-2">No data available</div>
            <div className="text-sm">Please check your trade data</div>
          </div>
        ) : chartType === 'bar' ? (
          renderBarChart()
        ) : (
          renderPieChart()
        )}
      </div>
    </div>
  );
};

export default WorkflowCharts;