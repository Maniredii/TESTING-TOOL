interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  configName: string;
  isDeleting: boolean;
}

export const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, configName, isDeleting }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="text-xl font-bold text-red-600">Delete Configuration</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete <strong>{configName}</strong>? This action is permanent and cannot be undone.
        </p>
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="rounded border px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
