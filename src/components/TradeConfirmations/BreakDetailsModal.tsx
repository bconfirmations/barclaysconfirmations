import React, { useState } from 'react';
import { X, AlertCircle, MessageSquare, Send, Clock, User } from 'lucide-react';
import { EquityTrade, FXTrade } from '../../types/trade';

interface BreakDetailsModalProps {
  trade: EquityTrade | FXTrade;
  onClose: () => void;
}

const BreakDetailsModal: React.FC<BreakDetailsModalProps> = ({ trade, onClose }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'John Smith - Trading Desk',
      timestamp: '2025-01-18 09:30:00',
      message: 'Initial break identified - counterparty system unavailable during confirmation window.'
    },
    {
      id: 2,
      user: 'Sarah Johnson - Operations',
      timestamp: '2025-01-18 10:15:00',
      message: 'Attempted manual confirmation via phone. Counterparty confirms trade details but system still down.'
    }
  ]);

  const isEquityTrade = 'quantity' in trade;
  const status = isEquityTrade 
    ? (trade as EquityTrade).confirmationStatus 
    : (trade as FXTrade).tradeStatus;

  const hasBreak = status === 'Failed' || status === 'Disputed' || status === 'Cancelled';

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        user: 'Current User - Operations',
        timestamp: new Date().toLocaleString(),
        message: comment.trim()
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  const getBreakDetails = () => {
    switch (status.toLowerCase()) {
      case 'failed':
        return {
          type: 'Confirmation Failure',
          priority: 'High',
          assignedTo: 'Trading Desk',
          sla: '1 day',
          description: 'Trade confirmation failed due to counterparty system unavailability. Requires manual intervention and re-confirmation.',
          impact: 'Settlement delay possible',
          nextSteps: [
            'Contact counterparty via phone',
            'Obtain manual confirmation',
            'Update trade status in system',
            'Monitor for system restoration'
          ]
        };
      case 'disputed':
        return {
          type: 'Trade Dispute',
          priority: 'High',
          assignedTo: 'Legal Team',
          sla: '3 days',
          description: 'Trade details disputed by counterparty. Price discrepancy identified requiring legal review and resolution.',
          impact: 'Trade settlement on hold',
          nextSteps: [
            'Review original trade documentation',
            'Contact counterparty legal team',
            'Prepare dispute resolution documentation',
            'Escalate to senior management if needed'
          ]
        };
      case 'cancelled':
        return {
          type: 'Trade Cancellation',
          priority: 'Medium',
          assignedTo: 'Middle Office',
          sla: '2 days',
          description: 'Trade cancelled due to regulatory or compliance issues. Requires proper documentation and client notification.',
          impact: 'Trade void - no settlement',
          nextSteps: [
            'Document cancellation reason',
            'Notify all relevant parties',
            'Update regulatory reporting',
            'Process any applicable fees'
          ]
        };
      default:
        return null;
    }
  };

  const breakDetails = getBreakDetails();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className={`w-6 h-6 ${hasBreak ? 'text-orange-600' : 'text-green-600'}`} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Break Details</h2>
              <p className="text-gray-500">Trade ID: {trade.tradeId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {hasBreak && breakDetails ? (
            <div className="space-y-6">
              {/* Break Summary */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-orange-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-orange-800 mb-4">Break Identified</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-orange-700">Break Type</p>
                          <p className="text-orange-600">{breakDetails.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">Priority</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {breakDetails.priority}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">Assigned To</p>
                          <p className="text-orange-600">{breakDetails.assignedTo}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">SLA</p>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-orange-600">{breakDetails.sla}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-orange-700">Impact</p>
                          <p className="text-orange-600">{breakDetails.impact}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">Status</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            In Progress
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">Created</p>
                          <p className="text-orange-600">2025-01-18 09:30:00</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">Last Updated</p>
                          <p className="text-orange-600">2025-01-18 10:15:00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{breakDetails.description}</p>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Next Steps</h4>
                <ul className="space-y-2">
                  {breakDetails.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-blue-800">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Comments Section */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Comments & Updates
                  </h4>
                </div>
                
                <div className="p-4 space-y-4 max-h-60 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 p-4">
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment or update..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>
                    <button
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Breaks Identified</h3>
              <p className="text-gray-600">This trade has been processed successfully without any issues.</p>
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 font-medium">Trade Status: {status}</span>
                </div>
                <p className="text-green-700 text-sm mt-2">
                  All confirmations received and processed according to standard procedures.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
          {hasBreak && (
            <button className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
              Update Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreakDetailsModal;