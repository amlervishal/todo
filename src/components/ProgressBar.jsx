export const ProgressBar = ({ progress }) => {
  // Create an array of 20 elements
  const squares = Array.from({ length: 20 });
  
  // Calculate progress based on 20 squares
  const filledSquares = Math.round((progress / 10) * 20);
  
  return (
    <div className="mb-6 w-full">
      <div className="flex items-center space-x-4">
        <div className="flex space-x-0.5 justify-center">
          {squares.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 border transition-colors
                ${i < filledSquares 
                  ? 'bg-gray-800 border-gray-800 dark:bg-terminal-green dark:border-terminal-green' 
                  : 'border-gray-800 dark:border-terminal-green'
                }`}
            />
          ))}
        </div>
        <div className="text-xs text-gray-800 dark:text-terminal-green opacity-50">
          {progress * 10}% complete
        </div>
      </div>
    </div>
  );
};