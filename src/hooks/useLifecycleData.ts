import { useState, useEffect, useCallback } from 'react';
import { TradeLifecycle, TeamUpdate, LifecycleTeam } from '../types/lifecycle';
import { EquityTrade, FXTrade } from '../types/trade';

export const useLifecycleData = () => {
  const [lifecycles, setLifecycles] = useState<TradeLifecycle[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize lifecycle data for existing trades
  const initializeLifecycles = useCallback((equityTrades: EquityTrade[], fxTrades: FXTrade[]) => {
    const allTrades = [...equityTrades, ...fxTrades];
    
    const newLifecycles: TradeLifecycle[] = allTrades.map(trade => {
      const isEquityTrade = 'quantity' in trade;
      const confirmationStatus = isEquityTrade 
        ? (trade as EquityTrade).confirmationStatus 
        : (trade as FXTrade).tradeStatus;
      
      // Simulate different stages based on confirmation status
      const getTeamStatuses = (status: string) => {
        const baseTime = new Date().toISOString();
        
        switch (status.toLowerCase()) {
          case 'settled':
            return {
              costManagement: { status: 'completed' as const, data: { cost: Math.random() * 1000 }, notes: 'Cost analysis completed' },
              networkManagement: { status: 'completed' as const, data: { networkId: `NET-${trade.tradeId}` }, notes: 'Network routing established' },
              referenceData: { status: 'completed' as const, data: { validated: true }, notes: 'Reference data validated' },
              collateralManagement: { status: 'completed' as const, data: { collateral: Math.random() * 5000 }, notes: 'Collateral requirements met' },
              confirmations: { status: 'completed' as const, data: trade, notes: 'Trade confirmed successfully' },
              settlements: { status: 'completed' as const, data: { settled: true }, notes: 'Settlement completed' },
              regulatoryAdherence: { status: 'completed' as const, data: { compliant: true }, notes: 'Regulatory requirements met' },
              middleOffice: { status: 'completed' as const, data: { processed: true }, notes: 'Middle office processing complete' }
            };
          case 'confirmed':
            return {
              costManagement: { status: 'completed' as const, data: { cost: Math.random() * 1000 }, notes: 'Cost analysis completed' },
              networkManagement: { status: 'completed' as const, data: { networkId: `NET-${trade.tradeId}` }, notes: 'Network routing established' },
              referenceData: { status: 'completed' as const, data: { validated: true }, notes: 'Reference data validated' },
              collateralManagement: { status: 'completed' as const, data: { collateral: Math.random() * 5000 }, notes: 'Collateral requirements met' },
              confirmations: { status: 'completed' as const, data: trade, notes: 'Trade confirmed successfully' },
              settlements: { status: 'in-progress' as const, data: { pending: true }, notes: 'Awaiting settlement' },
              regulatoryAdherence: { status: 'in-progress' as const, data: { reviewing: true }, notes: 'Regulatory review in progress' },
              middleOffice: { status: 'pending' as const, data: {}, notes: 'Awaiting confirmation completion' }
            };
          case 'pending':
            return {
              costManagement: { status: 'completed' as const, data: { cost: Math.random() * 1000 }, notes: 'Cost analysis completed' },
              networkManagement: { status: 'completed' as const, data: { networkId: `NET-${trade.tradeId}` }, notes: 'Network routing established' },
              referenceData: { status: 'completed' as const, data: { validated: true }, notes: 'Reference data validated' },
              collateralManagement: { status: 'in-progress' as const, data: { reviewing: true }, notes: 'Collateral review in progress' },
              confirmations: { status: 'in-progress' as const, data: trade, notes: 'Awaiting confirmation' },
              settlements: { status: 'pending' as const, data: {}, notes: 'Awaiting confirmation' },
              regulatoryAdherence: { status: 'pending' as const, data: {}, notes: 'Awaiting confirmation' },
              middleOffice: { status: 'pending' as const, data: {}, notes: 'Awaiting confirmation' }
            };
          case 'failed':
          case 'disputed':
            return {
              costManagement: { status: 'completed' as const, data: { cost: Math.random() * 1000 }, notes: 'Cost analysis completed' },
              networkManagement: { status: 'completed' as const, data: { networkId: `NET-${trade.tradeId}` }, notes: 'Network routing established' },
              referenceData: { status: 'completed' as const, data: { validated: true }, notes: 'Reference data validated' },
              collateralManagement: { status: 'failed' as const, data: { issue: 'Collateral insufficient' }, notes: 'Collateral requirements not met' },
              confirmations: { status: 'failed' as const, data: trade, notes: 'Confirmation failed - requires resolution' },
              settlements: { status: 'pending' as const, data: {}, notes: 'On hold pending confirmation' },
              regulatoryAdherence: { status: 'pending' as const, data: {}, notes: 'On hold pending confirmation' },
              middleOffice: { status: 'pending' as const, data: {}, notes: 'On hold pending confirmation' }
            };
          default:
            return {
              costManagement: { status: 'in-progress' as const, data: {}, notes: 'Processing cost analysis' },
              networkManagement: { status: 'pending' as const, data: {}, notes: 'Awaiting cost management' },
              referenceData: { status: 'pending' as const, data: {}, notes: 'Awaiting network setup' },
              collateralManagement: { status: 'pending' as const, data: {}, notes: 'Awaiting reference data' },
              confirmations: { status: 'pending' as const, data: trade, notes: 'Awaiting upstream teams' },
              settlements: { status: 'pending' as const, data: {}, notes: 'Awaiting confirmation' },
              regulatoryAdherence: { status: 'pending' as const, data: {}, notes: 'Awaiting confirmation' },
              middleOffice: { status: 'pending' as const, data: {}, notes: 'Awaiting confirmation' }
            };
        }
      };

      const teamStatuses = getTeamStatuses(confirmationStatus);
      
      return {
        tradeId: trade.tradeId,
        currentStage: getCurrentStage(teamStatuses),
        teams: {
          costManagement: {
            teamName: 'Cost Management Team',
            ...teamStatuses.costManagement,
            lastUpdated: baseTime
          },
          networkManagement: {
            teamName: 'Network Management Team',
            ...teamStatuses.networkManagement,
            lastUpdated: baseTime
          },
          referenceData: {
            teamName: 'Reference Data Team',
            ...teamStatuses.referenceData,
            lastUpdated: baseTime
          },
          collateralManagement: {
            teamName: 'Collateral Management Team',
            ...teamStatuses.collateralManagement,
            lastUpdated: baseTime
          },
          confirmations: {
            teamName: 'Confirmations Team',
            ...teamStatuses.confirmations,
            lastUpdated: baseTime
          },
          settlements: {
            teamName: 'Settlements Team',
            ...teamStatuses.settlements,
            lastUpdated: baseTime
          },
          regulatoryAdherence: {
            teamName: 'Regulatory Adherence Team',
            ...teamStatuses.regulatoryAdherence,
            lastUpdated: baseTime
          },
          middleOffice: {
            teamName: 'Middle Office Team',
            ...teamStatuses.middleOffice,
            lastUpdated: baseTime
          }
        },
        createdAt: baseTime,
        lastModified: baseTime
      };
    });

    setLifecycles(newLifecycles);
  }, []);

  // Get current stage based on team statuses
  const getCurrentStage = (teamStatuses: any) => {
    if (teamStatuses.middleOffice.status === 'completed') return 'Middle Office Team';
    if (teamStatuses.regulatoryAdherence.status === 'completed') return 'Regulatory Adherence Team';
    if (teamStatuses.settlements.status === 'completed') return 'Settlements Team';
    if (teamStatuses.confirmations.status === 'completed') return 'Confirmations Team';
    if (teamStatuses.collateralManagement.status === 'completed') return 'Collateral Management Team';
    if (teamStatuses.referenceData.status === 'completed') return 'Reference Data Team';
    if (teamStatuses.networkManagement.status === 'completed') return 'Network Management Team';
    return 'Cost Management Team';
  };

  // Update team data (simulates external team updates)
  const updateTeamData = useCallback((update: TeamUpdate) => {
    setLifecycles(prev => prev.map(lifecycle => {
      if (lifecycle.tradeId === update.tradeId) {
        const updatedLifecycle = {
          ...lifecycle,
          teams: {
            ...lifecycle.teams,
            [update.teamName]: {
              ...lifecycle.teams[update.teamName as LifecycleTeam],
              status: update.status,
              data: { ...lifecycle.teams[update.teamName as LifecycleTeam].data, ...update.data },
              notes: update.notes,
              lastUpdated: new Date().toISOString()
            }
          },
          lastModified: new Date().toISOString()
        };
        
        // Update current stage
        updatedLifecycle.currentStage = getCurrentStage(updatedLifecycle.teams);
        
        return updatedLifecycle;
      }
      return lifecycle;
    }));
  }, []);

  // Simulate external team updates
  const simulateExternalUpdate = useCallback((tradeId: string, teamName: LifecycleTeam) => {
    const updates = {
      costManagement: { status: 'completed' as const, data: { cost: Math.random() * 1000 }, notes: 'Cost analysis updated' },
      networkManagement: { status: 'completed' as const, data: { networkId: `NET-${tradeId}-UPD` }, notes: 'Network configuration updated' },
      referenceData: { status: 'completed' as const, data: { validated: true, updated: true }, notes: 'Reference data refreshed' },
      collateralManagement: { status: 'completed' as const, data: { collateral: Math.random() * 5000 }, notes: 'Collateral requirements updated' },
      settlements: { status: 'completed' as const, data: { settled: true }, notes: 'Settlement processed' },
      regulatoryAdherence: { status: 'completed' as const, data: { compliant: true }, notes: 'Regulatory compliance verified' },
      middleOffice: { status: 'completed' as const, data: { processed: true }, notes: 'Middle office processing complete' }
    };

    if (updates[teamName]) {
      updateTeamData({
        tradeId,
        teamName,
        ...updates[teamName]
      });
    }
  }, [updateTeamData]);

  return {
    lifecycles,
    loading,
    initializeLifecycles,
    updateTeamData,
    simulateExternalUpdate
  };
};