import React from 'react';
import { FileText, Workflow } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'confirmations' | 'workflow';
  onTabChange: (tab: 'confirmations' | 'workflow') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-8">
      <button
        onClick={() => onTabChange('confirmations')}
        className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
          activeTab === 'confirmations'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span>Trade Confirmations</span>
      </button>
      <button
        onClick={() => onTabChange('workflow')}
        className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
          activeTab === 'workflow'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        <Workflow className="w-5 h-5" />
        <span>Workflow Management</span>
      </button>
    </div>
  );
};

export default TabNavigation;