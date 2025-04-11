// This script registers the service worker
import { registerSW } from 'virtual:pwa-register';

// This is how you can update the PWA
const updateSW = registerSW({
  onNeedRefresh() {
    // Show a prompt to the user about updating the app
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

export default updateSW;