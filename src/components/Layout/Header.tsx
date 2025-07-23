import React from 'react';
import { Building2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <Building2 className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Barclays</h1>
            <p className="text-blue-200 text-sm">Confirmation Department</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;