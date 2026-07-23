import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name is too long'),
    description: z.string().optional(),
    websiteUrl: z.string().url('Must be a valid URL'),
    defaultBrowser: z.enum(['chromium', 'firefox', 'webkit', 'edge']).default('chromium'),
    defaultViewport: z.string().default('1920x1080'),
    headless: z.boolean().default(true),
    timeout: z.number().min(1000).max(120000).default(30000),
    retryCount: z.number().min(0).max(5).default(0),
  })
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    defaultBrowser: z.enum(['chromium', 'firefox', 'webkit', 'edge']).optional(),
    defaultViewport: z.string().optional(),
    headless: z.boolean().optional(),
    timeout: z.number().min(1000).max(120000).optional(),
    retryCount: z.number().min(0).max(5).optional(),
  })
});

export const getProjectsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => (val ? parseInt(val) : 1)),
    limit: z.string().optional().transform(val => (val ? parseInt(val) : 10)),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'name']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  })
});
