import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../../hooks/useProjects';
import { ProjectFormModal } from '../../components/projects/ProjectFormModal';
import { DeleteConfirmDialog } from '../../components/projects/DeleteConfirmDialog';
import { Project } from '../../services/project.service';
import { PlusCircle, Edit, Trash2, Search, Settings } from 'lucide-react';

export const Projects = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const { data, isLoading } = useProjects({ search, page, limit: 10 });
  const { mutateAsync: createProject, isPending: isCreating } = useCreateProject();
  const { mutateAsync: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject();

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingProject) {
        await updateProject({ id: editingProject.id, data: formData });
      } else {
        await createProject(formData);
      }
      setIsFormOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to save project', error);
      // Custom toast could go here
    }
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete.id);
        setIsDeleteOpen(false);
        setProjectToDelete(null);
      } catch (error) {
        console.error('Failed to delete project', error);
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Projects</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your automated testing projects</p>
        </div>
        <button
          onClick={() => { setEditingProject(null); setIsFormOpen(true); }}
          className="flex items-center space-x-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5" />
          <span>New Project</span>
        </button>
      </div>

      <div className="mb-6 flex items-center rounded-lg border bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
        <Search className="ml-2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full border-none bg-transparent p-2 focus:outline-none dark:text-white"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white shadow dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4">Project Name</th>
              <th className="px-6 py-4">Website</th>
              <th className="px-6 py-4">Browser</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse border-b dark:border-gray-700">
                  <td className="px-6 py-4"><div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div></td>
                </tr>
              ))
            ) : data?.projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No projects found. Create one to get started.</p>
                </td>
              </tr>
            ) : (
              data?.projects.map((project) => (
                <tr key={project.id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <Link to={`/projects/${project.id}`} className="hover:underline">{project.name}</Link>
                  </td>
                  <td className="px-6 py-4">
                    <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                      {project.websiteUrl}
                    </a>
                  </td>
                  <td className="px-6 py-4 capitalize">{project.defaultBrowser}</td>
                  <td className="flex justify-end space-x-3 px-6 py-4">
                    <Link to={`/projects/${project.id}`} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      <Settings className="h-5 w-5" />
                    </Link>
                    <button onClick={() => { setEditingProject(project); setIsFormOpen(true); }} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => { setProjectToDelete(project); setIsDeleteOpen(true); }} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            disabled={!data.meta.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border px-4 py-2 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            Previous
          </button>
          <span className="text-gray-600 dark:text-gray-400">
            Page {data.meta.currentPage} of {data.meta.totalPages}
          </span>
          <button
            disabled={!data.meta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border px-4 py-2 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      )}

      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingProject(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingProject}
        isSubmitting={isCreating || isUpdating}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setProjectToDelete(null); }}
        onConfirm={handleDeleteConfirm}
        projectName={projectToDelete?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};
