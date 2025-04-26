import { useState } from 'react';
import { X } from 'lucide-react';

export const CreateGroupDialog = ({ isOpen, onClose, onCreateGroup }) => {
  const [groupName, setGroupName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    
    onCreateGroup(groupName);
    setGroupName('');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md shadow-lg p-4 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium text-gray-800 dark:text-terminal-green">
            Create new group
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-terminal-green/70" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            className="w-full mb-4 p-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded
              text-gray-800 dark:text-terminal-green font-mono
              focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-terminal-green"
            autoFocus
          />
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-xs font-mono
                border border-gray-300 dark:border-gray-700 rounded
                text-gray-700 dark:text-terminal-green/70
                hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-mono
                bg-gray-800 dark:bg-terminal-green
                border border-gray-800 dark:border-terminal-green rounded
                text-white dark:text-black
                hover:bg-gray-700 dark:hover:bg-terminal-green/90"
              disabled={!groupName.trim()}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};