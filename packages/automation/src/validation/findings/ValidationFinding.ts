import { Severity } from '../severity/Severity';

export interface EvidenceReference {
  type: 'SCREENSHOT' | 'VIDEO' | 'NETWORK' | 'CONSOLE' | 'DOM_SNAPSHOT';
  id: string; // The ID of the evidence artifact
}

export interface ValidationFinding {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  description: string;
  evidenceReferences: EvidenceReference[];
  recommendation?: string;
  affectedUrl?: string;
  actionId?: string;
  timestamp: Date;
}
