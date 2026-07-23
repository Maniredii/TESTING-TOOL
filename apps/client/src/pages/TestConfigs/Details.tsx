import { useParams, Link } from 'react-router-dom';
import { useTestConfig } from '../../hooks/useTestConfigs';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const TestConfigDetails = () => {
  const { projectId, configId } = useParams<{ projectId: string; configId: string }>();
  const { data: config, isLoading, error } = useTestConfig(configId!);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading configuration details...</div>;
  }

  if (error || !config) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-2xl font-bold dark:text-white">Configuration Not Found</h2>
        <Link to={`/projects/${projectId}/configurations`} className="mt-4 text-blue-600 hover:underline">Return to Configurations</Link>
      </div>
    );
  }

  const BooleanItem = ({ label, value }: { label: string, value: boolean }) => (
    <div className="flex justify-between border-b pb-2 dark:border-gray-700">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      {value ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-gray-300 dark:text-gray-600" />}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl p-6">
      <Link to={`/projects/${projectId}/configurations`} className="mb-6 flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Configurations
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">{config.name}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{config.description || 'No description provided.'}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Core Settings */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold dark:text-white">Core Settings</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Entry Point</span>
              <span className="font-medium dark:text-white">{config.entryPoint}</span>
            </div>
            {config.entryPoint === 'CUSTOM' && (
              <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">Custom URL</span>
                <span className="font-medium dark:text-white">{config.customUrl}</span>
              </div>
            )}
            <BooleanItem label="Login Required" value={config.loginRequired} />
            <BooleanItem label="Signup Required" value={config.signupRequired} />
            {config.loginRequired && (
              <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">Test Email</span>
                <span className="font-medium dark:text-white">{config.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Browser Settings */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold dark:text-white">Browser Environment</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Browser</span>
              <span className="font-medium capitalize dark:text-white">{config.browser}</span>
            </div>
            <div className="flex justify-between border-b pb-2 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Viewport</span>
              <span className="font-medium dark:text-white">{config.viewportWidth} x {config.viewportHeight}</span>
            </div>
            <div className="flex justify-between border-b pb-2 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Timeout</span>
              <span className="font-medium dark:text-white">{config.timeout} ms</span>
            </div>
            <div className="flex justify-between border-b pb-2 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Retry Count</span>
              <span className="font-medium dark:text-white">{config.retryCount}</span>
            </div>
            <BooleanItem label="Headless Mode" value={config.headless} />
          </div>
        </div>

        {/* Crawler Settings */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold dark:text-white">Crawler Rules</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Max Navigation Depth</span>
              <span className="font-medium dark:text-white">{config.maxNavigationDepth}</span>
            </div>
            <div className="flex justify-between border-b pb-2 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Max Pages</span>
              <span className="font-medium dark:text-white">{config.maxPages}</span>
            </div>
            <BooleanItem label="Parallel Execution" value={config.parallelExecution} />
            <BooleanItem label="Follow External Links" value={config.followExternalLinks} />
            <BooleanItem label="Ignore Query Params" value={config.ignoreQueryParams} />
            <BooleanItem label="Respect Robots.txt" value={config.respectRobotsTxt} />
          </div>
        </div>

        {/* Artifacts Settings */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold dark:text-white">Artifacts Collection</h2>
          <div className="space-y-4 text-sm">
            <BooleanItem label="Record Video" value={config.recordVideo} />
            <BooleanItem label="Capture Screenshots" value={config.captureScreenshots} />
            <BooleanItem label="Capture Console Logs" value={config.captureConsoleLogs} />
            <BooleanItem label="Capture Network Logs" value={config.captureNetworkLogs} />
          </div>
        </div>
      </div>
    </div>
  );
};
