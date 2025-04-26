import { format } from 'date-fns';
import { Pencil } from 'lucide-react';

export const TodoItem = ({ task, onToggle, onEdit }) => (
  <div className="group flex justify-between items-start">
    <div onClick={() => onToggle(task.id)} className="cursor-pointer flex-grow">
      <span className={`text-gray-800 dark:text-terminal-green text-sm ${task.completed ? 'line-through opacity-50' : ''}`}>
        {task.text}
      </span>
      <div className="text-xs opacity-25 mt-1 text-gray-800 dark:text-terminal-green">
        {format(new Date(task.createdAt), 'MMM d, yyyy')}
      </div>
    </div>
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onEdit(task.id);
      }} 
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
    >
      <Pencil size={14} className="text-gray-800 dark:text-terminal-green" />
    </button>
  </div>
);