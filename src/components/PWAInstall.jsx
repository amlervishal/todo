import { useState, useEffect } from 'react';

export default function PWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setPlatform('ios');
    } else if (/android/i.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt since it can't be used again
      setInstallPrompt(null);
      setIsInstallable(false);
    });
  };

  return (
    <div className="pwa-install-container text-center mt-8 text-xs opacity-40 hover:opacity-70">
      
      {platform === 'ios' && (
        <div>
          <p>Install: Tap share button → Add to Home Screen</p>
        </div>
      )}
      
      {platform === 'android' && isInstallable && (
        <div>
          <button 
            onClick={handleInstallClick}
            className="underline"
          >
            Install app on your device
          </button>
        </div>
      )}
      
      {platform === 'android' && !isInstallable && (
        <div>
          <p>Install: Tap menu → Add to Home screen</p>
        </div>
      )}
      
      {platform === 'desktop' && isInstallable && (
        <div>
          <button 
            onClick={handleInstallClick}
            className="underline"
          >
            Install app on your computer
          </button>
        </div>
      )}
      
      {platform === 'desktop' && !isInstallable && (
        <div>
          <p>Install: Click the install icon in browser's address bar</p>
        </div>
      )}
    </div>
  );
}