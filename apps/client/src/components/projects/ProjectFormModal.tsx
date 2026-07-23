import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().optional(),
  websiteUrl: z.string().url('Must be a valid URL'),
  defaultBrowser: z.enum(['chromium', 'firefox', 'webkit', 'edge']),
  defaultViewport: z.string(),
  headless: z.boolean(),
  timeout: z.number().min(1000).max(120000),
  retryCount: z.number().min(0).max(5),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormValues) => void;
  initialData?: any;
  isSubmitting: boolean;
}

export const ProjectFormModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }: Props) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      defaultBrowser: 'chromium',
      defaultViewport: '1920x1080',
      headless: true,
      timeout: 30000,
      retryCount: 0,
    }
  });

  useEffect(() => {
    if (initialData && isOpen) {
      reset(initialData);
    } else if (!isOpen) {
      reset();
    }
  }, [initialData, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold dark:text-white">
          {initialData ? 'Edit Project' : 'Create Project'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium dark:text-gray-300">Project Name</label>
              <input type="text" {...register('name')} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium dark:text-gray-300">Description</label>
              <textarea {...register('description')} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium dark:text-gray-300">Website URL</label>
              <input type="url" {...register('websiteUrl')} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              {errors.websiteUrl && <p className="text-sm text-red-500">{errors.websiteUrl.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium dark:text-gray-300">Browser</label>
              <select {...register('defaultBrowser')} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="chromium">Chrome / Chromium</option>
                <option value="firefox">Firefox</option>
                <option value="webkit">WebKit (Safari)</option>
                <option value="edge">Microsoft Edge</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium dark:text-gray-300">Viewport</label>
              <input type="text" {...register('defaultViewport')} placeholder="1920x1080" className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium dark:text-gray-300">Timeout (ms)</label>
              <input type="number" {...register('timeout', { valueAsNumber: true })} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium dark:text-gray-300">Retry Count</label>
              <input type="number" {...register('retryCount', { valueAsNumber: true })} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <input type="checkbox" id="headless" {...register('headless')} className="h-4 w-4 rounded border-gray-300" />
              <label htmlFor="headless" className="text-sm font-medium dark:text-gray-300">Run in Headless Mode</label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3 border-t pt-4 dark:border-gray-700">
            <button type="button" onClick={onClose} className="rounded border px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
