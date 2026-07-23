import { useParams, Link } from 'react-router-dom';
import { useProject } from '../../hooks/useProjects';
import { ArrowLeft, Globe, Settings, TerminalSquare, AlertCircle } from 'lucide-react';

export const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, error } = useProject(id!);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading project details...</div>;
  }

  if (error || !project) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-2xl font-bold dark:text-white">Project Not Found</h2>
        <Link to="/projects" className="mt-4 text-blue-600 hover:underline">Return to Projects</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <Link to="/projects" className="mb-6 flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">{project.name}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{project.description || 'No description provided.'}</p>
        </div>
        <Link 
          to={`/projects/${project.id}/configurations`}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Manage Configurations
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Configuration Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center space-x-2 text-lg font-semibold dark:text-white">
            <Settings className="h-5 w-5 text-gray-500" />
            <h2>Configuration</h2>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Website URL</span>
              <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline dark:text-blue-400">
                <Globe className="mr-1 h-3 w-3" />
                {project.websiteUrl}
              </a>
            </div>
            <div className="flex justify-between border-b pb-2 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Browser</span>
              <span className="font-medium capitalize dark:text-white">{project.defaultBrowser}</span>
            </div>
            <div className="flex justify-between border-b pb-2 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Viewport</span>
              <span className="font-medium dark:text-white">{project.defaultViewport}</span>
            </div>
            <div className="flex justify-between border-b pb-2 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Headless Mode</span>
              <span className="font-medium dark:text-white">{project.headless ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex justify-between border-b pb-2 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Timeout</span>
              <span className="font-medium dark:text-white">{project.timeout} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Retries</span>
              <span className="font-medium dark:text-white">{project.retryCount}</span>
            </div>
          </div>
        </div>

        {/* Executions Placeholder */}
        <div className="col-span-1 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-2">
          <div className="mb-4 flex items-center space-x-2 text-lg font-semibold dark:text-white">
            <TerminalSquare className="h-5 w-5 text-gray-500" />
            <h2>Recent Executions</h2>
          </div>
          <div className="flex h-48 flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 text-center dark:border-gray-700 dark:bg-gray-900/50">
            <p className="text-gray-500 dark:text-gray-400">No executions found.</p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Automation module is not yet integrated.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
