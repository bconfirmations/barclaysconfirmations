import React, { useState, useCallback } from 'react';
import { X, Upload, FileSpreadsheet, Edit3, Save, Trash2, Plus } from 'lucide-react';
import * as XLSX from 'xlsx';
import { EquityTrade, FXTrade } from '../../types/trade';

interface FileUploadModalProps {
  onClose: () => void;
  onDataUpdate: (equityTrades: EquityTrade[], fxTrades: FXTrade[]) => void;
  currentEquityTrades: EquityTrade[];
  currentFxTrades: FXTrade[];
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  onClose,
  onDataUpdate,
  currentEquityTrades,
  currentFxTrades,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    data: any[];
    type: 'equity' | 'fx';
    id: string;
  }>>([]);
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editData, setEditData] = useState<any[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel' ||
          file.name.endsWith('.xlsx') || 
          file.name.endsWith('.xls')) {
        
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            // Determine if it's equity or FX based on columns
            const firstRow = jsonData[0] as any;
            const isEquity = firstRow && ('quantity' in firstRow || 'Quantity' in firstRow || 'clientId' in firstRow || 'Client ID' in firstRow);
            
            const newFile = {
              name: file.name,
              data: jsonData,
              type: isEquity ? 'equity' as const : 'fx' as const,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
            };
            
            setUploadedFiles(prev => [...prev, newFile]);
          } catch (error) {
            console.error('Error reading file:', error);
            alert('Error reading file. Please ensure it\'s a valid Excel file.');
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert('Please upload only Excel files (.xlsx or .xls)');
      }
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const startEditing = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      setEditingFile(fileId);
      setEditData([...file.data]);
    }
  };

  const saveEdits = () => {
    if (editingFile) {
      setUploadedFiles(prev => prev.map(file => 
        file.id === editingFile 
          ? { ...file, data: [...editData] }
          : file
      ));
      setEditingFile(null);
      setEditData([]);
    }
  };

  const cancelEdits = () => {
    setEditingFile(null);
    setEditData([]);
  };

  const deleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    if (editingFile === fileId) {
      setEditingFile(null);
      setEditData([]);
    }
  };

  const addNewRow = () => {
    if (editingFile) {
      const file = uploadedFiles.find(f => f.id === editingFile);
      if (file && file.data.length > 0) {
        const template = { ...file.data[0] };
        Object.keys(template).forEach(key => {
          template[key] = '';
        });
        setEditData(prev => [...prev, template]);
      }
    }
  };

  const updateCell = (rowIndex: number, column: string, value: string) => {
    setEditData(prev => prev.map((row, idx) => 
      idx === rowIndex ? { ...row, [column]: value } : row
    ));
  };

  const deleteRow = (rowIndex: number) => {
    setEditData(prev => prev.filter((_, idx) => idx !== rowIndex));
  };

  const convertToTradeFormat = (data: any[], type: 'equity' | 'fx'): EquityTrade[] | FXTrade[] => {
    if (type === 'equity') {
      return data.map((row, index) => ({
        tradeId: row['Trade ID'] || row['tradeId'] || `UPLOAD-${Date.now()}-${index}`,
        orderId: row['Order ID'] || row['orderId'] || `ORDER-${Date.now()}-${index}`,
        clientId: row['Client ID'] || row['clientId'] || `CLIENT-${index}`,
        tradeType: (row['Trade Type'] || row['tradeType'] || 'Buy') as 'Buy' | 'Sell',
        quantity: parseInt(row['Quantity'] || row['quantity'] || '0'),
        price: parseFloat(row['Price'] || row['price'] || '0'),
        tradeValue: parseFloat(row['Trade Value'] || row['tradeValue'] || '0'),
        currency: row['Currency'] || row['currency'] || 'USD',
        tradeDate: row['Trade Date'] || row['tradeDate'] || new Date().toLocaleDateString(),
        settlementDate: row['Settlement Date'] || row['settlementDate'] || new Date().toLocaleDateString(),
        counterparty: row['Counterparty'] || row['counterparty'] || 'Unknown',
        tradingVenue: row['Trading Venue'] || row['tradingVenue'] || 'NYSE',
        traderName: row['Trader Name'] || row['traderName'] || 'Trader A',
        confirmationStatus: (row['Confirmation Status'] || row['confirmationStatus'] || 'Pending') as 'Confirmed' | 'Pending' | 'Failed' | 'Settled',
        countryOfTrade: row['Country of Trade'] || row['countryOfTrade'] || 'US',
        opsTeamNotes: row['Ops Team Notes'] || row['opsTeamNotes'] || 'Clean'
      })) as EquityTrade[];
    } else {
      return data.map((row, index) => ({
        tradeId: row['TradeID'] || row['Trade ID'] || row['tradeId'] || `FX-${Date.now()}-${index}`,
        tradeDate: row['TradeDate'] || row['Trade Date'] || row['tradeDate'] || new Date().toLocaleDateString(),
        valueDate: row['ValueDate'] || row['Value Date'] || row['valueDate'] || new Date().toLocaleDateString(),
        tradeTime: row['TradeTime'] || row['Trade Time'] || row['tradeTime'] || '09:00:00',
        traderId: row['TraderID'] || row['Trader ID'] || row['traderId'] || `TDR${index}`,
        counterparty: row['Counterparty'] || row['counterparty'] || 'Unknown',
        currencyPair: row['CurrencyPair'] || row['Currency Pair'] || row['currencyPair'] || 'USD/EUR',
        buySell: (row['BuySell'] || row['Buy/Sell'] || row['buySell'] || 'Buy') as 'Buy' | 'Sell',
        dealtCurrency: row['DealtCurrency'] || row['Dealt Currency'] || row['dealtCurrency'] || 'USD',
        baseCurrency: row['BaseCurrency'] || row['Base Currency'] || row['baseCurrency'] || 'USD',
        termCurrency: row['TermCurrency'] || row['Term Currency'] || row['termCurrency'] || 'EUR',
        tradeStatus: (row['TradeStatus'] || row['Trade Status'] || row['tradeStatus'] || 'Booked') as 'Booked' | 'Confirmed' | 'Settled' | 'Cancelled',
        productType: (row['ProductType'] || row['Product Type'] || row['productType'] || 'Spot') as 'Spot' | 'Forward' | 'Swap',
        maturityDate: row['MaturityDate'] || row['Maturity Date'] || row['maturityDate'],
        confirmationTimestamp: row['ConfirmationTimestamp'] || row['Confirmation Timestamp'] || row['confirmationTimestamp'] || new Date().toISOString(),
        settlementDate: row['SettlementDate'] || row['Settlement Date'] || row['settlementDate'] || new Date().toLocaleDateString(),
        amendmentFlag: (row['AmendmentFlag'] || row['Amendment Flag'] || row['amendmentFlag'] || 'No') as 'Yes' | 'No',
        confirmationMethod: (row['ConfirmationMethod'] || row['Confirmation Method'] || row['confirmationMethod'] || 'Electronic') as 'SWIFT' | 'Email' | 'Manual' | 'Electronic',
        confirmationStatus: (row['ConfirmationStatus'] || row['Confirmation Status'] || row['confirmationStatus'] || 'Pending') as 'Confirmed' | 'Pending' | 'Disputed'
      })) as FXTrade[];
    }
  };

  const applyChanges = () => {
    const newEquityTrades: EquityTrade[] = [...currentEquityTrades];
    const newFxTrades: FXTrade[] = [...currentFxTrades];

    uploadedFiles.forEach(file => {
      if (file.type === 'equity') {
        const convertedTrades = convertToTradeFormat(file.data, 'equity') as EquityTrade[];
        newEquityTrades.push(...convertedTrades);
      } else {
        const convertedTrades = convertToTradeFormat(file.data, 'fx') as FXTrade[];
        newFxTrades.push(...convertedTrades);
      }
    });

    onDataUpdate(newEquityTrades, newFxTrades);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Upload Excel Files
            </p>
            <p className="text-gray-600 mb-4">
              Drag and drop your Excel files here, or click to browse
            </p>
            <input
              type="file"
              multiple
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </label>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
              <div className="space-y-4">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-3">
                        <FileSpreadsheet className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-900">{file.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          file.type === 'equity' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {file.type === 'equity' ? 'Equity Trades' : 'FX Trades'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {file.data.length} rows
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(file.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {editingFile && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Editing: {uploadedFiles.find(f => f.id === editingFile)?.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={addNewRow}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Row</span>
                  </button>
                  <button
                    onClick={saveEdits}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={cancelEdits}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                      {editData.length > 0 && Object.keys(editData[0]).map(column => (
                        <th key={column} className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {editData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="px-2 py-2">
                          <button
                            onClick={() => deleteRow(rowIndex)}
                            className="text-orange-600 hover:text-orange-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                        {Object.keys(row).map(column => (
                          <td key={column} className="px-2 py-2">
                            <input
                              type="text"
                              value={row[column] || ''}
                              onChange={(e) => updateCell(rowIndex, column, e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          {uploadedFiles.length > 0 && (
            <button
              onClick={applyChanges}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Changes ({uploadedFiles.reduce((sum, file) => sum + file.data.length, 0)} new trades)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;