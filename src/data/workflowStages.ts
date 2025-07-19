import { WorkflowStage } from '../types/trade';

export const workflowStages: WorkflowStage[] = [
  {
    id: 1,
    name: 'Trade Capture',
    description: 'Initial trade entry and validation',
    color: '#3B82F6'
  },
  {
    id: 2,
    name: 'Trade Enrichment',
    description: 'Adding additional trade details and references',
    color: '#8B5CF6'
  },
  {
    id: 3,
    name: 'Confirmation Generation',
    description: 'Creating confirmation documents',
    color: '#06B6D4'
  },
  {
    id: 4,
    name: 'Counterparty Matching',
    description: 'Matching with counterparty confirmations',
    color: '#10B981'
  },
  {
    id: 5,
    name: 'Exception Handling',
    description: 'Resolving breaks and discrepancies',
    color: '#F59E0B'
  },
  {
    id: 6,
    name: 'Settlement Preparation',
    description: 'Preparing for trade settlement',
    color: '#EF4444'
  },
  {
    id: 7,
    name: 'Settlement Processing',
    description: 'Processing actual settlement',
    color: '#84CC16'
  },
  {
    id: 8,
    name: 'Post-Settlement',
    description: 'Final reconciliation and reporting',
    color: '#6366F1'
  }
];