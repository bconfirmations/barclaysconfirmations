import React, { useState, useCallback } from 'react';
import Header from './components/Layout/Header';
import TabNavigation from './components/Layout/TabNavigation';
import TradeConfirmationsTab from './components/TradeConfirmations/TradeConfirmationsTab';
import WorkflowManagementTab from './components/WorkflowManagement/WorkflowManagementTab';
import FileUploadModal from './components/DataManagement/FileUploadModal';
import { useTradeData } from './hooks/useTradeData';
import { useLifecycleData } from './hooks/useLifecycleData';
import { Loader2, AlertCircle, Upload } from 'lucide-react';
import { EquityTrade, FXTrade } from './types/trade';
import LifecycleSimulator from './components/Lifecycle/LifecycleSimulator';

function App() {
  const [activeTab, setActiveTab] = useState<'confirmations' | 'workflow'>('confirmations');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLifecycleSimulator, setShowLifecycleSimulator] = useState(false);
  const { equityTrades, fxTrades, loading, error, updateTradeData } = useTradeData();
  const { lifecycles, initializeLifecycles, simulateExternalUpdate } = useLifecycleData();

  const handleDataUpdate = useCallback((newEquityTrades: EquityTrade[], newFxTrades: FXTrade[]) => {
    updateTradeData(newEquityTrades, newFxTrades);
    // Initialize lifecycle data for new trades
    initializeLifecycles(newEquityTrades, newFxTrades);
  }, [updateTradeData]);

  // Initialize lifecycle data when trades are loaded
  React.useEffect(() => {
    if (equityTrades.length > 0 || fxTrades.length > 0) {
      initializeLifecycles(equityTrades, fxTrades);
    }
  }, [equityTrades, fxTrades, initializeLifecycles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading trade data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3 text-orange-600">
            <AlertCircle className="w-8 h-8" />
            <span className="text-lg">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors my-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Data</span>
            </button>
            <button
              onClick={() => setShowLifecycleSimulator(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors my-2"
            >
              <span>🔄</span>
              <span>Lifecycle Simulator</span>
            </button>
          </div>
        </div>
      </div>
      
      <main>
        {activeTab === 'confirmations' ? (
          <TradeConfirmationsTab 
            equityTrades={equityTrades} 
            fxTrades={fxTrades} 
            lifecycles={lifecycles}
          />
        ) : (
          <WorkflowManagementTab 
            equityTrades={equityTrades} 
            fxTrades={fxTrades} 
            lifecycles={lifecycles}
          />
        )}
      </main>

      {showUploadModal && (
        <FileUploadModal
          onClose={() => setShowUploadModal(false)}
          onDataUpdate={handleDataUpdate}
          currentEquityTrades={equityTrades}
          currentFxTrades={fxTrades}
        />
      )}

      {showLifecycleSimulator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Trade Lifecycle Simulator</h2>
              <button
                onClick={() => setShowLifecycleSimulator(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <LifecycleSimulator
                tradeIds={[...equityTrades, ...fxTrades].map(t => t.tradeId)}
                onSimulateUpdate={simulateExternalUpdate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;