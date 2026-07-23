import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

const testConfigSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  entryPoint: z.enum(['HOME', 'LOGIN', 'SIGNUP', 'CUSTOM']),
  customUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  
  // Auth
  loginRequired: z.boolean(),
  signupRequired: z.boolean(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  password: z.string().optional(),
  otpRequired: z.boolean(),

  // Browser
  browser: z.enum(['chromium', 'firefox', 'webkit', 'edge']),
  headless: z.boolean(),
  viewportWidth: z.number().min(320).max(7680),
  viewportHeight: z.number().min(240).max(4320),
  timeout: z.number().min(1000).max(120000),
  retryCount: z.number().min(0).max(5),

  // Crawler
  maxNavigationDepth: z.number().min(1).max(10),
  maxPages: z.number().min(1).max(1000),
  parallelExecution: z.boolean(),
  followExternalLinks: z.boolean(),
  ignoreQueryParams: z.boolean(),
  respectRobotsTxt: z.boolean(),

  // Artifacts
  recordVideo: z.boolean(),
  captureScreenshots: z.boolean(),
  captureConsoleLogs: z.boolean(),
  captureNetworkLogs: z.boolean(),
});

type TestConfigFormValues = z.infer<typeof testConfigSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TestConfigFormValues) => void;
  initialData?: any;
  isSubmitting: boolean;
}

export const TestConfigFormModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }: Props) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<TestConfigFormValues>({
    resolver: zodResolver(testConfigSchema),
    defaultValues: {
      entryPoint: 'HOME',
      loginRequired: false,
      signupRequired: false,
      otpRequired: false,
      browser: 'chromium',
      headless: true,
      viewportWidth: 1920,
      viewportHeight: 1080,
      timeout: 30000,
      retryCount: 0,
      maxNavigationDepth: 3,
      maxPages: 100,
      parallelExecution: false,
      followExternalLinks: false,
      ignoreQueryParams: false,
      respectRobotsTxt: true,
      recordVideo: true,
      captureScreenshots: true,
      captureConsoleLogs: true,
      captureNetworkLogs: true,
    }
  });

  const entryPoint = watch('entryPoint');
  const loginRequired = watch('loginRequired');

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
      <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <div className="border-b px-6 py-4 dark:border-gray-700">
          <h2 className="text-2xl font-bold dark:text-white">
            {initialData ? 'Edit Configuration' : 'Create Configuration'}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form id="test-config-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* General Info */}
            <section>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">General Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium dark:text-gray-300">Configuration Name</label>
                  <input type="text" {...register('name')} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium dark:text-gray-300">Description</label>
                  <textarea {...register('description')} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium dark:text-gray-300">Entry Point</label>
                  <select {...register('entryPoint')} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                    <option value="HOME">Home Page</option>
                    <option value="LOGIN">Login Page</option>
                    <option value="SIGNUP">Signup Page</option>
                    <option value="CUSTOM">Custom URL</option>
                  </select>
                </div>
                {entryPoint === 'CUSTOM' && (
                  <div>
                    <label className="mb-1 block text-sm font-medium dark:text-gray-300">Custom URL</label>
                    <input type="url" {...register('customUrl')} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                    {errors.customUrl && <p className="text-sm text-red-500">{errors.customUrl.message}</p>}
                  </div>
                )}
              </div>
            </section>

            <hr className="dark:border-gray-700" />

            {/* Authentication Settings */}
            <section>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Authentication Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="loginRequired" {...register('loginRequired')} className="h-4 w-4" />
                  <label htmlFor="loginRequired" className="text-sm font-medium dark:text-gray-300">Login Required</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="signupRequired" {...register('signupRequired')} className="h-4 w-4" />
                  <label htmlFor="signupRequired" className="text-sm font-medium dark:text-gray-300">Signup Required</label>
                </div>
                {loginRequired && (
                  <>
                    <div>
                      <label className="mb-1 block text-sm font-medium dark:text-gray-300">Test Email</label>
                      <input type="email" {...register('email')} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                      {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium dark:text-gray-300">Test Password</label>
                      <input type="password" {...register('password')} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="otpRequired" {...register('otpRequired')} className="h-4 w-4" />
                      <label htmlFor="otpRequired" className="text-sm font-medium dark:text-gray-300">Requires OTP Bypass</label>
                    </div>
                  </>
                )}
              </div>
            </section>

            <hr className="dark:border-gray-700" />

            {/* Browser Settings */}
            <section>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Browser & Environment</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium dark:text-gray-300">Browser</label>
                  <select {...register('browser')} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                    <option value="chromium">Chromium</option>
                    <option value="firefox">Firefox</option>
                    <option value="webkit">WebKit</option>
                    <option value="edge">Edge</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium dark:text-gray-300">Viewport Width</label>
                  <input type="number" {...register('viewportWidth', { valueAsNumber: true })} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium dark:text-gray-300">Viewport Height</label>
                  <input type="number" {...register('viewportHeight', { valueAsNumber: true })} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium dark:text-gray-300">Timeout (ms)</label>
                  <input type="number" {...register('timeout', { valueAsNumber: true })} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium dark:text-gray-300">Retry Count</label>
                  <input type="number" {...register('retryCount', { valueAsNumber: true })} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="flex items-end pb-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="headlessConfig" {...register('headless')} className="h-4 w-4" />
                    <label htmlFor="headlessConfig" className="text-sm font-medium dark:text-gray-300">Headless Mode</label>
                  </div>
                </div>
              </div>
            </section>

            <hr className="dark:border-gray-700" />

            {/* Crawler & Artifacts */}
            <section>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Crawler & Artifacts</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium dark:text-gray-300">Max Navigation Depth</label>
                  <input type="number" {...register('maxNavigationDepth', { valueAsNumber: true })} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium dark:text-gray-300">Max Pages</label>
                  <input type="number" {...register('maxPages', { valueAsNumber: true })} className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                
                <div className="col-span-2 grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2"><input type="checkbox" {...register('parallelExecution')} className="h-4 w-4" /><label className="text-sm dark:text-gray-300">Parallel Execution</label></div>
                  <div className="flex items-center space-x-2"><input type="checkbox" {...register('followExternalLinks')} className="h-4 w-4" /><label className="text-sm dark:text-gray-300">Follow External Links</label></div>
                  <div className="flex items-center space-x-2"><input type="checkbox" {...register('ignoreQueryParams')} className="h-4 w-4" /><label className="text-sm dark:text-gray-300">Ignore Query Params</label></div>
                  <div className="flex items-center space-x-2"><input type="checkbox" {...register('respectRobotsTxt')} className="h-4 w-4" /><label className="text-sm dark:text-gray-300">Respect Robots.txt</label></div>
                  <div className="flex items-center space-x-2"><input type="checkbox" {...register('recordVideo')} className="h-4 w-4" /><label className="text-sm dark:text-gray-300">Record Video</label></div>
                  <div className="flex items-center space-x-2"><input type="checkbox" {...register('captureScreenshots')} className="h-4 w-4" /><label className="text-sm dark:text-gray-300">Capture Screenshots</label></div>
                  <div className="flex items-center space-x-2"><input type="checkbox" {...register('captureConsoleLogs')} className="h-4 w-4" /><label className="text-sm dark:text-gray-300">Capture Console Logs</label></div>
                  <div className="flex items-center space-x-2"><input type="checkbox" {...register('captureNetworkLogs')} className="h-4 w-4" /><label className="text-sm dark:text-gray-300">Capture Network Logs</label></div>
                </div>
              </div>
            </section>
          </form>
        </div>

        <div className="border-t px-6 py-4 dark:border-gray-700">
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="rounded border px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" form="test-config-form" disabled={isSubmitting} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
