import { api } from './api';

export interface TestConfig {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  entryPoint: 'HOME' | 'LOGIN' | 'SIGNUP' | 'CUSTOM';
  customUrl?: string;
  loginRequired: boolean;
  signupRequired: boolean;
  email?: string;
  password?: string;
  phone?: string;
  otpRequired: boolean;
  browser: string;
  headless: boolean;
  viewportWidth: number;
  viewportHeight: number;
  timeout: number;
  retryCount: number;
  maxNavigationDepth: number;
  maxPages: number;
  parallelExecution: boolean;
  recordVideo: boolean;
  captureScreenshots: boolean;
  captureConsoleLogs: boolean;
  captureNetworkLogs: boolean;
  followExternalLinks: boolean;
  ignoreQueryParams: boolean;
  respectRobotsTxt: boolean;
  createdAt: string;
}

export const TestConfigService = {
  getByProject: async (projectId: string): Promise<TestConfig[]> => {
    const { data } = await api.get(`/projects/${projectId}/test-configurations`);
    return data.data.configs;
  },
  
  getById: async (id: string): Promise<TestConfig> => {
    const { data } = await api.get(`/test-configurations/${id}`);
    return data.data.config;
  },

  create: async (payload: any): Promise<TestConfig> => {
    const { data } = await api.post('/test-configurations', payload);
    return data.data.config;
  },

  update: async (id: string, payload: any): Promise<TestConfig> => {
    const { data } = await api.patch(`/test-configurations/${id}`, payload);
    return data.data.config;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/test-configurations/${id}`);
  }
};
