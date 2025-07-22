import React, { useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { LifecycleTeam, LIFECYCLE_TEAMS } from '../../types/lifecycle';

interface LifecycleSimulatorProps {
  tradeIds: string[];
  onSimulateUpdate: (tradeId: string, teamName: LifecycleTeam) => void;
}

const LifecycleSimulator: React.FC<LifecycleSimulatorProps> = ({ 
  tradeIds, 
  onSimulateUpdate 
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<LifecycleTeam>('costManagement');

  const teamNames = {
    costManagement: 'Cost Management Team',
    networkManagement: 'Network Management Team',
    referenceData: 'Reference Data Team',
    collateralManagement: 'Collateral Management Team',
    confirmations: 'Confirmations Team',
    settlements: 'Settlements Team',
    regulatoryAdherence: 'Regulatory Adherence Team',
    middleOffice: 'Middle Office Team'
  };

  const handleSimulateUpdate = () => {
    if (!selectedTrade) return;
    
    setIsSimulating(true);
    onSimulateUpdate(selectedTrade, selectedTeam);
    
    setTimeout(() => {
      setIsSimulating(false);
    }, 1000);
  };

  const handleSimulateRandomUpdates = () => {
    setIsSimulating(true);
    
    // Simulate 3-5 random updates
    const updateCount = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < updateCount; i++) {
      setTimeout(() => {
        const randomTrade = tradeIds[Math.floor(Math.random() * tradeIds.length)];
        const randomTeam = LIFECYCLE_TEAMS[Math.floor(Math.random() * LIFECYCLE_TEAMS.length)];
        onSimulateUpdate(randomTrade, randomTeam);
        
        if (i === updateCount - 1) {
          setIsSimulating(false);
        }
      }, i * 500);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Lifecycle Simulator
        </h3>
        <div className="text-sm text-gray-500">
          Simulate external team updates
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Trade
            </label>
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a trade...</option>
              {tradeIds.slice(0, 10).map(tradeId => (
                <option key={tradeId} value={tradeId}>
                  {tradeId}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value as LifecycleTeam)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {LIFECYCLE_TEAMS.map(team => (
                <option key={team} value={team}>
                  {teamNames[team]}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleSimulateUpdate}
            disabled={!selectedTrade || isSimulating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Simulate Update</span>
          </button>
          
          <button
            onClick={handleSimulateRandomUpdates}
            disabled={tradeIds.length === 0 || isSimulating}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Random Updates</span>
          </button>
        </div>
        
        {isSimulating && (
          <div className="flex items-center space-x-2 text-blue-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Simulating updates...</span>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">
          How it works:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Select a trade and team to simulate an update from that team</li>
          <li>• Use "Random Updates" to simulate multiple team updates across different trades</li>
          <li>• Watch how changes from other teams affect the Confirmations system</li>
          <li>• All charts and analytics will update in real-time</li>
        </ul>
      </div>
    </div>
  );
};

export default LifecycleSimulator;