import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { workflowStages } from '../../data/workflowStages';
import { WorkflowAnalytics, TradeFilter } from '../../types/trade';

interface WorkflowStagesProps {
  analytics: WorkflowAnalytics[];
  filter: TradeFilter;
}

const WorkflowStages: React.FC<WorkflowStagesProps> = ({ analytics, filter }) => {
  const getStageIcon = (stageName: string, count: number) => {
    if (count === 0) return <Clock className="w-6 h-6 text-gray-400" />;
    
    switch (stageName) {
      case 'Exception Handling':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'Post-Settlement':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Clock className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Workflow Stages</h3>
        <span className="text-sm text-gray-500">
          {filter === 'all' ? 'All Trades' : filter === 'equity' ? 'Equity Trades Only' : 'FX Trades Only'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workflowStages.map((stage, index) => {
          const stageAnalytics = analytics.find(a => a.stage === stage.name);
          const count = stageAnalytics?.count || 0;
          const percentage = stageAnalytics?.percentage || 0;
          
          return (
            <div
              key={stage.id}
              className="relative p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: stage.color }}
                  >
                    {index + 1}
                  </div>
                  {getStageIcon(stage.name, count)}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-1">{stage.name}</h4>
              <p className="text-sm text-gray-600">{stage.description}</p>
              
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: stage.color 
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowStages;