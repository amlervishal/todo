import { useState } from 'react';
import { ChevronUp } from 'lucide-react';

export const GroupSelector = ({ groups, currentGroupId, onGroupChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleGroupClick = (groupId) => {
    onGroupChange(groupId);
    setIsOpen(false);
  };
  
  // Find current group name
  const currentGroup = groups.find(g => g.id === currentGroupId) || { name: 'My Tasks' };
  
  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center space-x-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
      >
        <span className="text-xs font-mono text-gray-800 dark:text-terminal-green">
          {currentGroup.name}
        </span>
        <ChevronUp className={`w-3 h-3 text-gray-800 dark:text-terminal-green transform ${isOpen ? '' : 'rotate-180'}`} />
      </div>
      
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md shadow-lg py-1 max-h-48 overflow-y-auto">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => handleGroupClick(group.id)}
              className={`w-full text-left px-3 py-2 text-xs font-mono ${
                group.id === currentGroupId 
                  ? 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-terminal-green' 
                  : 'text-gray-600 dark:text-terminal-green/70 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};