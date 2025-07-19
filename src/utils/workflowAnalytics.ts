import { EquityTrade, FXTrade, WorkflowAnalytics, NextActionOwner, TradeStageAnalytics, TradeFilter } from '../types/trade';
import { workflowStages } from '../data/workflowStages';

const getWorkflowStageFromStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Confirmation Generation';
    case 'confirmed':
      return 'Counterparty Matching';
    case 'settled':
      return 'Post-Settlement';
    case 'failed':
    case 'disputed':
      return 'Exception Handling';
    case 'booked':
      return 'Trade Enrichment';
    case 'cancelled':
      return 'Exception Handling';
    default:
      return 'Trade Capture';
  }
};

const getNextActionOwner = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Trading';
    case 'confirmed':
      return 'Settlements';
    case 'settled':
      return 'Completed';
    case 'failed':
    case 'disputed':
      return 'Legal';
    case 'booked':
      return 'Sales';
    case 'cancelled':
      return 'Legal';
    default:
      return 'Trading';
  }
};

const getCurrentTradeStage = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Matching';
    case 'settled':
      return 'CCNR';
    case 'failed':
    case 'disputed':
      return 'Drafting';
    case 'booked':
      return 'Matching';
    case 'cancelled':
      return 'Drafting';
    default:
      return 'Pending';
  }
};

export const generateWorkflowAnalytics = (
  equityTrades: EquityTrade[],
  fxTrades: FXTrade[],
  filter: TradeFilter = 'all'
): WorkflowAnalytics[] => {
  const filteredEquityTrades = filter === 'fx' ? [] : equityTrades;
  const filteredFxTrades = filter === 'equity' ? [] : fxTrades;
  
  const stageCounts: { [key: string]: number } = {};
  
  // Initialize all stages with 0
  workflowStages.forEach(stage => {
    stageCounts[stage.name] = 0;
  });
  
  // Count equity trades by stage
  filteredEquityTrades.forEach(trade => {
    const stage = getWorkflowStageFromStatus(trade.confirmationStatus);
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
  });
  
  // Count FX trades by stage
  filteredFxTrades.forEach(trade => {
    const stage = getWorkflowStageFromStatus(trade.tradeStatus);
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
  });
  
  const totalTrades = filteredEquityTrades.length + filteredFxTrades.length;
  
  return Object.entries(stageCounts).map(([stage, count]) => ({
    stage,
    count,
    percentage: totalTrades > 0 ? (count / totalTrades) * 100 : 0
  }));
};

export const generateNextActionOwnerAnalytics = (
  equityTrades: EquityTrade[],
  fxTrades: FXTrade[],
  filter: TradeFilter = 'all'
): NextActionOwner[] => {
  const filteredEquityTrades = filter === 'fx' ? [] : equityTrades;
  const filteredFxTrades = filter === 'equity' ? [] : fxTrades;
  
  const ownerCounts: { [key: string]: number } = {};
  
  // Count equity trades by next action owner
  filteredEquityTrades.forEach(trade => {
    const owner = getNextActionOwner(trade.confirmationStatus);
    ownerCounts[owner] = (ownerCounts[owner] || 0) + 1;
  });
  
  // Count FX trades by next action owner
  filteredFxTrades.forEach(trade => {
    const owner = getNextActionOwner(trade.tradeStatus);
    ownerCounts[owner] = (ownerCounts[owner] || 0) + 1;
  });
  
  const totalTrades = filteredEquityTrades.length + filteredFxTrades.length;
  
  return Object.entries(ownerCounts).map(([department, count]) => ({
    department,
    count,
    percentage: totalTrades > 0 ? (count / totalTrades) * 100 : 0
  }));
};

export const generateTradeStageAnalytics = (
  equityTrades: EquityTrade[],
  fxTrades: FXTrade[],
  filter: TradeFilter = 'all'
): TradeStageAnalytics[] => {
  const filteredEquityTrades = filter === 'fx' ? [] : equityTrades;
  const filteredFxTrades = filter === 'equity' ? [] : fxTrades;
  
  const stageCounts: { [key: string]: number } = {};
  
  // Count equity trades by current stage
  filteredEquityTrades.forEach(trade => {
    const stage = getCurrentTradeStage(trade.confirmationStatus);
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
  });
  
  // Count FX trades by current stage
  filteredFxTrades.forEach(trade => {
    const stage = getCurrentTradeStage(trade.tradeStatus);
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
  });
  
  const totalTrades = filteredEquityTrades.length + filteredFxTrades.length;
  
  return Object.entries(stageCounts).map(([stage, count]) => ({
    stage,
    count,
    percentage: totalTrades > 0 ? (count / totalTrades) * 100 : 0
  }));
};