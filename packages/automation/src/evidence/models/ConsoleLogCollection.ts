export interface ConsoleEntry {
  type: 'log' | 'info' | 'warn' | 'error' | 'debug' | 'exception';
  text: string;
  timestamp: Date;
  location?: string;
  actionId?: string; // If correlated with an action
}

export interface ConsoleLogCollection {
  entries: ConsoleEntry[];
}
