import { z } from 'zod';

export const CreateExecutionSchema = z.object({
  projectId: z.string().cuid('Invalid Project ID'),
  configurationId: z.string().cuid('Invalid Configuration ID').optional(),
});

export type CreateExecutionDto = z.infer<typeof CreateExecutionSchema>;
