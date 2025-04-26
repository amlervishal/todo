import { useState } from 'react';
import { X, Grip } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const NavBar = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, setIsDark } = useTheme();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-black z-10">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left section: Hamburger menu + Greeting */}
        <div className="flex items-center space-x-3">
          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-800 dark:text-terminal-green"
            aria-label="Toggle menu"
          >
            <Grip className="w-5 h-5" />
          </button>
          
          {/* User Greeting - Next to hamburger */}
          <div className="text-base font-mono opacity-75 text-gray-800 dark:text-terminal-green">
            {user ? `Hey ${user.displayName ? user.displayName.split(' ')[0].charAt(0).toUpperCase() + user.displayName.split(' ')[0].slice(1) : user.email}! 👋` : 'Terminal Todo'}
          </div>
        </div>
        
        {/* Logo */}
        <div className="h-8 w-8">
          <img src="/todo/logo.png" alt="Terminal Todo Logo" className="h-full w-full object-contain" />
        </div>
      </div>
      
      {/* Slide-in Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="absolute top-0 left-0 h-full w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 shadow-lg p-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-gray-800 dark:text-terminal-green">Menu</h2>
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-800 dark:text-terminal-green"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="space-y-4">
              <button
                onClick={() => {
                  setIsDark(!isDark);
                  toggleMenu();
                }}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-800 dark:text-terminal-green"
              >
                {isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              </button>
              
              {user && (
                <button
                  onClick={() => {
                    onSignOut();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-800 dark:text-terminal-green"
                >
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};