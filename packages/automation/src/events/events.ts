export const AutomationEvents = {
  BROWSER_STARTED: 'browser:started',
  BROWSER_CLOSED: 'browser:closed',
  CONTEXT_CREATED: 'context:created',
  CONTEXT_DESTROYED: 'context:destroyed',
  PAGE_OPENED: 'page:opened',
  PAGE_CLOSED: 'page:closed',
  NAVIGATION_STARTED: 'navigation:started',
  NAVIGATION_FINISHED: 'navigation:finished',
  EXECUTION_STARTED: 'execution:started',
  EXECUTION_FINISHED: 'execution:finished',
} as const;
