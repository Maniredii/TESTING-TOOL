import { z } from 'zod';
import { EntryPoint } from '@prisma/client';

export const createTestConfigSchema = z.object({
  body: z.object({
    projectId: z.string().cuid('Valid Project ID is required'),
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    description: z.string().optional(),
    entryPoint: z.nativeEnum(EntryPoint).default(EntryPoint.HOME),
    customUrl: z.string().url('Must be a valid URL').optional(),
    
    // Auth Settings
    loginRequired: z.boolean().default(false),
    signupRequired: z.boolean().default(false),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    password: z.string().optional(),
    phone: z.string().optional(),
    otpRequired: z.boolean().default(false),

    // Browser Settings
    browser: z.enum(['chromium', 'firefox', 'webkit', 'edge']).default('chromium'),
    headless: z.boolean().default(true),
    viewportWidth: z.number().min(320).max(7680).default(1920),
    viewportHeight: z.number().min(240).max(4320).default(1080),
    timeout: z.number().min(1000).max(120000).default(30000),
    retryCount: z.number().min(0).max(5).default(0),

    // Crawler Settings
    maxNavigationDepth: z.number().min(1).max(10).default(3),
    maxPages: z.number().min(1).max(1000).default(100),
    parallelExecution: z.boolean().default(false),
    followExternalLinks: z.boolean().default(false),
    ignoreQueryParams: z.boolean().default(false),
    respectRobotsTxt: z.boolean().default(true),

    // Logging & Artifacts
    recordVideo: z.boolean().default(true),
    captureScreenshots: z.boolean().default(true),
    captureConsoleLogs: z.boolean().default(true),
    captureNetworkLogs: z.boolean().default(true),
  })
});

export const updateTestConfigSchema = z.object({
  body: createTestConfigSchema.shape.body.partial().omit({ projectId: true })
});
