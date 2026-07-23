import { ExecutionResult } from '../../results/ExecutionResult';
import { EvidenceBundle } from '../../evidence/models/EvidenceBundle';
import { ExecutionStatistics } from '../models/ExecutionStatistics';

export class StatisticsBuilder {
  public build(executionResult: ExecutionResult, evidenceBundle: EvidenceBundle): ExecutionStatistics {
    const actions = executionResult.actionResults || [];
    const totalActions = actions.length;
    
    // Explicitly check against the exact strings from ActionStatus if imported, or handle case explicitly
    const successActions = actions.filter(a => a.status.toString().toUpperCase() === 'SUCCESS');
    const failureActions = actions.filter(a => a.status.toString().toUpperCase() === 'FAILED');
    
    const successRate = totalActions > 0 ? successActions.length / totalActions : 0;
    const failureRate = totalActions > 0 ? failureActions.length / totalActions : 0;
    
    const totalActionTime = actions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const averageActionTimeMs = totalActions > 0 ? totalActionTime / totalActions : 0;
    
    const totalNavigationTimeMs = actions
      .filter(a => a.actionType === 'NAVIGATE')
      .reduce((acc, curr) => acc + (curr.duration || 0), 0);
      
    const networkEntries = evidenceBundle.network?.entries || [];
    const failedNetworkRequests = networkEntries.filter(n => n.error || (n.statusCode && n.statusCode >= 400)).length;
    const totalNetworkTime = networkEntries.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    
    const consoleErrorCount = (evidenceBundle.consoleLogs?.entries || [])
      .filter(c => c.type === 'error' || c.type === 'exception').length;

    return {
      successRate,
      failureRate,
      averageActionTimeMs,
      totalNavigationTimeMs,
      retryCount: executionResult.metrics?.retryCount || 0,
      networkStatistics: {
        totalRequests: networkEntries.length,
        failedRequests: failedNetworkRequests,
        averageResponseTimeMs: networkEntries.length > 0 ? totalNetworkTime / networkEntries.length : 0,
      },
      consoleErrorCount,
    };
  }
}
