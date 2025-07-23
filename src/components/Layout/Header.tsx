import React from 'react';
import { Building2, RotateCcw } from 'lucide-react';
import { useTradeData } from '../../hooks/useTradeData';

interface HeaderProps {
  onResetData?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onResetData }) => {
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data to original state? This will remove all uploaded changes.')) {
      localStorage.removeItem('barclays_equity_trades');
      localStorage.removeItem('barclays_fx_trades');
      if (onResetData) {
        onResetData();
      }
      window.location.reload();
    }
  };

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Barclays</h1>
              <p className="text-blue-200 text-sm">Confirmation Department</p>
            </div>
          </div>
          
          <button
            onClick={handleResetData}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-800 hover:bg-blue-700 rounded-md transition-colors text-sm"
            title="Reset to original data"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;