import React, { useState } from 'react';
import Header from './components/Layout/Header';
import TabNavigation from './components/Layout/TabNavigation';
import TradeConfirmationsTab from './components/TradeConfirmations/TradeConfirmationsTab';
import WorkflowManagementTab from './components/WorkflowManagement/WorkflowManagementTab';
import { useTradeData } from './hooks/useTradeData';
import { Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'confirmations' | 'workflow'>('confirmations');
  const { equityTrades, fxTrades, loading, error } = useTradeData();

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
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
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
    </div>
  );
}

export default App;