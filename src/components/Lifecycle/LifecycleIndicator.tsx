import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { TradeLifecycle } from '../../types/lifecycle';

interface LifecycleIndicatorProps {
  lifecycle: TradeLifecycle;
  compact?: boolean;
}

const LifecycleIndicator: React.FC<LifecycleIndicatorProps> = ({ lifecycle, compact = false }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-300';
      case 'in-progress':
        return 'bg-yellow-100 border-yellow-300';
      case 'failed':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const teams = [
    { key: 'costManagement', name: 'Cost Mgmt', fullName: 'Cost Management Team' },
    { key: 'networkManagement', name: 'Network', fullName: 'Network Management Team' },
    { key: 'referenceData', name: 'Ref Data', fullName: 'Reference Data Team' },
    { key: 'collateralManagement', name: 'Collateral', fullName: 'Collateral Management Team' },
    { key: 'confirmations', name: 'Confirm', fullName: 'Confirmations Team' },
    { key: 'settlements', name: 'Settle', fullName: 'Settlements Team' },
    { key: 'regulatoryAdherence', name: 'Regulatory', fullName: 'Regulatory Adherence Team' },
    { key: 'middleOffice', name: 'Mid Office', fullName: 'Middle Office Team' }
  ];

  if (compact) {
    return (
      <div className="flex items-center space-x-1">
        {teams.map((team, index) => {
          const teamData = lifecycle.teams[team.key as keyof typeof lifecycle.teams];
          return (
            <div
              key={team.key}
              className={`w-3 h-3 rounded-full border-2 ${getStatusColor(teamData.status)}`}
              title={`${team.fullName}: ${teamData.status}`}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-3">
        Trade Lifecycle Progress
      </div>
      <div className="grid grid-cols-2 gap-2">
        {teams.map((team, index) => {
          const teamData = lifecycle.teams[team.key as keyof typeof lifecycle.teams];
          return (
            <div
              key={team.key}
              className={`flex items-center space-x-2 p-2 rounded-md border ${getStatusColor(teamData.status)}`}
            >
              {getStatusIcon(teamData.status)}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-800 truncate">
                  {team.name}
                </div>
                <div className="text-xs text-gray-600 capitalize">
                  {teamData.status.replace('-', ' ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 p-2 bg-blue-50 rounded-md">
        <div className="text-xs font-medium text-blue-800">
          Current Stage: {lifecycle.currentStage}
        </div>
        <div className="text-xs text-blue-600">
          Last Updated: {new Date(lifecycle.lastModified).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default LifecycleIndicator;