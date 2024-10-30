import { useTheme } from '../context/ThemeContext';
import { Sun, MoonStar } from 'lucide-react';

export const ThemeToggle = () => {
  const { isDark, setIsDark } = useTheme();
  
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed top-4 right-4 p-2 border
        transition-colors duration-200
        border-gray-800 dark:border-terminal-green
        text-gray-800 dark:text-terminal-green
        hover:bg-gray-600 hover:text-white
        dark:hover:bg-terminal-green dark:hover:text-black"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <MoonStar className="w-5 h-5" />
      )}
    </button>
  );
};