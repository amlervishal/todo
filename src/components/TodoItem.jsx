import { format } from 'date-fns';

export const TodoItem = ({ task, onToggle }) => (
  <div onClick={() => onToggle(task.id)} className="cursor-pointer group">
    <span className={`text-gray-800 dark:text-terminal-green ${task.completed ? 'line-through opacity-50' : ''}`}>
      {task.text}
    </span>
    <div className="text-xs opacity-25 mt-1 text-gray-800 dark:text-terminal-green">
      {format(new Date(task.createdAt), 'MMM d, yyyy')}
    </div>
  </div>
);