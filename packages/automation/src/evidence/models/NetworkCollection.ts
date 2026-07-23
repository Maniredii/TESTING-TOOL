export interface NetworkEntry {
  url: string;
  method: string;
  requestHeaders: Record<string, string>;
  responseHeaders?: Record<string, string>;
  statusCode?: number;
  postData?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  error?: string;
  isRedirect?: boolean;
}

export interface NetworkCollection {
  entries: NetworkEntry[];
}
