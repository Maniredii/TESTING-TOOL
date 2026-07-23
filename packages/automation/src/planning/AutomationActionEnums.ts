export enum SupportedAction {
  NAVIGATION = 'NAVIGATION',
  CLICK = 'CLICK',
  INPUT = 'INPUT',
  SELECT = 'SELECT',
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  UPLOAD = 'UPLOAD',
  DOWNLOAD = 'DOWNLOAD',
  HOVER = 'HOVER',
  SCROLL = 'SCROLL',
  WAIT = 'WAIT',
  REFRESH = 'REFRESH',
  BACK = 'BACK',
  FORWARD = 'FORWARD',
  ANALYZE_PAGE = 'ANALYZE_PAGE', // Virtual action to trigger re-analysis
}

export enum ActionPriorityLevel {
  BLOCKED = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4,
}
