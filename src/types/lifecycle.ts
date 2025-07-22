export interface TeamData {
  teamName: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  lastUpdated: string;
  data: any;
  notes: string;
}

export interface TradeLifecycle {
  tradeId: string;
  currentStage: string;
  teams: {
    costManagement: TeamData;
    networkManagement: TeamData;
    referenceData: TeamData;
    collateralManagement: TeamData;
    confirmations: TeamData;
    settlements: TeamData;
    regulatoryAdherence: TeamData;
    middleOffice: TeamData;
  };
  createdAt: string;
  lastModified: string;
}

export interface TeamUpdate {
  tradeId: string;
  teamName: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  data: any;
  notes: string;
}

export const LIFECYCLE_TEAMS = [
  'costManagement',
  'networkManagement', 
  'referenceData',
  'collateralManagement',
  'confirmations',
  'settlements',
  'regulatoryAdherence',
  'middleOffice'
] as const;

export type LifecycleTeam = typeof LIFECYCLE_TEAMS[number];