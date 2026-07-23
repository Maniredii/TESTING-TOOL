import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTestConfigsByProject, useCreateTestConfig, useUpdateTestConfig, useDeleteTestConfig } from '../../hooks/useTestConfigs';
import { useProject } from '../../hooks/useProjects';
import { TestConfigFormModal } from '../../components/testConfigs/TestConfigFormModal';
import { DeleteConfirmDialog } from '../../components/testConfigs/DeleteConfirmDialog';
import { TestConfig } from '../../services/testConfig.service';
import { PlusCircle, Edit, Trash2, ArrowLeft, Search, Settings } from 'lucide-react';

export const TestConfigsList = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [search, setSearch] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<TestConfig | null>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<TestConfig | null>(null);

  const { data: project } = useProject(projectId!);
  const { data: configs, isLoading } = useTestConfigsByProject(projectId!);
  
  const { mutateAsync: createConfig, isPending: isCreating } = useCreateTestConfig();
  const { mutateAsync: updateConfig, isPending: isUpdating } = useUpdateTestConfig();
  const { mutateAsync: deleteConfig, isPending: isDeleting } = useDeleteTestConfig();

  const filteredConfigs = configs?.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) || [];

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingConfig) {
        await updateConfig({ id: editingConfig.id, data: formData });
      } else {
        await createConfig({ ...formData, projectId });
      }
      setIsFormOpen(false);
      setEditingConfig(null);
    } catch (error) {
      console.error('Failed to save configuration', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (configToDelete) {
      try {
        await deleteConfig(configToDelete.id);
        setIsDeleteOpen(false);
        setConfigToDelete(null);
      } catch (error) {
        console.error('Failed to delete config', error);
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <Link to={`/projects/${projectId}`} className="mb-6 flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Project
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Test Configurations</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Manage automation scenarios for {project?.name}</p>
        </div>
        <button
          onClick={() => { setEditingConfig(null); setIsFormOpen(true); }}
          className="flex items-center space-x-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5" />
          <span>New Configuration</span>
        </button>
      </div>

      <div className="mb-6 flex items-center rounded-lg border bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
        <Search className="ml-2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search configurations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-none bg-transparent p-2 focus:outline-none dark:text-white"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white shadow dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Entry Point</th>
              <th className="px-6 py-4">Browser</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse border-b dark:border-gray-700">
                  <td className="px-6 py-4"><div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div></td>
                </tr>
              ))
            ) : filteredConfigs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No test configurations found.</p>
                </td>
              </tr>
            ) : (
              filteredConfigs.map((config) => (
                <tr key={config.id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <Link to={`/projects/${projectId}/configurations/${config.id}`} className="hover:underline">{config.name}</Link>
                  </td>
                  <td className="px-6 py-4"><span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700">{config.entryPoint}</span></td>
                  <td className="px-6 py-4 capitalize">{config.browser}</td>
                  <td className="flex justify-end space-x-3 px-6 py-4">
                    <Link to={`/projects/${projectId}/configurations/${config.id}`} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      <Settings className="h-5 w-5" />
                    </Link>
                    <button onClick={() => { setEditingConfig(config); setIsFormOpen(true); }} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => { setConfigToDelete(config); setIsDeleteOpen(true); }} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TestConfigFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingConfig(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingConfig}
        isSubmitting={isCreating || isUpdating}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setConfigToDelete(null); }}
        onConfirm={handleDeleteConfirm}
        configName={configToDelete?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};
