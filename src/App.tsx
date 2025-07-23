import React, { useState, useCallback } from 'react';
import Header from './components/Layout/Header';
import TabNavigation from './components/Layout/TabNavigation';
import TradeConfirmationsTab from './components/TradeConfirmations/TradeConfirmationsTab';
import WorkflowManagementTab from './components/WorkflowManagement/WorkflowManagementTab';
import FileUploadModal from './components/DataManagement/FileUploadModal';
import { useTradeData } from './hooks/useTradeData';
import { Loader2, AlertCircle, Upload } from 'lucide-react';
import { EquityTrade, FXTrade } from './types/trade';

function App() {
  const [activeTab, setActiveTab] = useState<'confirmations' | 'workflow'>('confirmations');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { equityTrades, fxTrades, loading, error, updateTradeData, clearSavedData } = useTradeData();

  const handleDataUpdate = useCallback((newEquityTrades: EquityTrade[], newFxTrades: FXTrade[]) => {
    updateTradeData(newEquityTrades, newFxTrades);
  }, [updateTradeData]);

  const handleResetData = useCallback(() => {
    clearSavedData();
  }, [clearSavedData]);
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onResetData={handleResetData} />
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
        <Header onResetData={handleResetData} />
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
      <Header onResetData={handleResetData} />
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
          </div>
        </div>
      </div>
      
      <main>
        {activeTab === 'confirmations' ? (
          <TradeConfirmationsTab 
            equityTrades={equityTrades} 
            fxTrades={fxTrades} 
          />
        ) : (
          <WorkflowManagementTab 
            equityTrades={equityTrades} 
            fxTrades={fxTrades} 
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
    </div>
  );
}

export default App;