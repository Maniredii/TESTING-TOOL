import { api } from './api';

export interface Project {
  id: string;
  name: string;
  description?: string;
  websiteUrl: string;
  defaultBrowser: string;
  defaultViewport: string;
  headless: boolean;
  timeout: number;
  retryCount: number;
  createdAt: string;
  owner: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ProjectsResponse {
  projects: Project[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const ProjectService = {
  getAll: async (params?: any): Promise<ProjectsResponse> => {
    const { data } = await api.get('/projects', { params });
    return data.data;
  },
  
  getById: async (id: string): Promise<Project> => {
    const { data } = await api.get(`/projects/${id}`);
    return data.data.project;
  },

  create: async (payload: any): Promise<Project> => {
    const { data } = await api.post('/projects', payload);
    return data.data.project;
  },

  update: async (id: string, payload: any): Promise<Project> => {
    const { data } = await api.patch(`/projects/${id}`, payload);
    return data.data.project;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  }
};
