import { useState } from 'react';

export const AddTodoForm = ({ onAdd }) => {
  const [newTask, setNewTask] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    onAdd(newTask);
    setNewTask('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add task"
        className="w-full bg-transparent border-none outline-none 
          text-gray-800 dark:text-terminal-green 
          placeholder-gray-400 dark:placeholder-terminal-green/50"
      />
    </form>
  );
};