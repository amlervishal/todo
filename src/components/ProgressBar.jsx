export const ProgressBar = ({ progress }) => (
  <div className="mb-6">
    <div className="mb-4 flex space-x-1">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`h-4 w-4 border transition-colors
            ${i < progress 
              ? 'bg-gray-800 border-gray-800 dark:bg-terminal-green dark:border-terminal-green' 
              : 'border-gray-800 dark:border-terminal-green'
            }`}
        />
      ))}
    </div>
    <div className="text-sm text-gray-800 dark:text-terminal-green opacity-50">
      {progress * 10}% COMPLETE
    </div>
  </div>
);