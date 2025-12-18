/**
 * Platform abstraction layer for Electron and Capacitor
 * Detects the platform and provides unified APIs for file operations
 */

// Detect platform
const isElectron = () => {
  try {
    return typeof window !== 'undefined' && 
           window.process && 
           window.process.type === 'renderer' &&
           typeof window.require === 'function';
  } catch (e) {
    return false;
  }
};

const isCapacitor = () => {
  return typeof window !== 'undefined' && 
         window.Capacitor !== undefined;
};

const getPlatform = () => {
  if (isElectron()) return 'electron';
  if (isCapacitor()) return 'capacitor';
  return 'web';
};

/**
 * Platform-specific file operations
 */
class PlatformFileSystem {
  constructor() {
    this.platform = getPlatform();
    this.ipcRenderer = null;
    this.filesystem = null;
    this.app = null;
    this.filesystemPromise = null;
    this.appPromise = null;
    
    if (this.platform === 'electron') {
      try {
        this.ipcRenderer = window.require('electron').ipcRenderer;
      } catch (e) {
        console.warn('Electron IPC not available:', e);
      }
    } else if (this.platform === 'capacitor') {
      // Pre-load Capacitor plugins
      this.filesystemPromise = import('@capacitor/filesystem').then(module => {
        this.filesystem = module.Filesystem;
        return module.Filesystem;
      }).catch(e => {
        console.warn('Capacitor Filesystem plugin not available:', e);
        return null;
      });
      
      this.appPromise = import('@capacitor/app').then(module => {
        this.app = module.App;
        return module.App;
      }).catch(e => {
        console.warn('Capacitor App plugin not available:', e);
        return null;
      });
    }
  }

  /**
   * Ensure Capacitor plugins are loaded
   */
  async ensureCapacitorPlugins() {
    if (this.platform === 'capacitor') {
      if (!this.filesystem && this.filesystemPromise) {
        await this.filesystemPromise;
      }
      if (!this.app && this.appPromise) {
        await this.appPromise;
      }
    }
  }

  /**
   * Save data to auto-save file
   */
  async saveAutoSave(data) {
    if (this.platform === 'electron' && this.ipcRenderer) {
      this.ipcRenderer.send('autosave', data);
      return Promise.resolve();
    } else if (this.platform === 'capacitor') {
      await this.ensureCapacitorPlugins();
      if (this.filesystem) {
        try {
          const fileName = 'auto-save.json';
          const fileData = JSON.stringify(data, null, 2);
          
          await this.filesystem.writeFile({
            path: fileName,
            data: fileData,
            directory: this.filesystem.Directory.Data
          });
          console.log('Auto-save updated (Capacitor)');
          return Promise.resolve();
        } catch (error) {
          console.error('Error saving auto-save (Capacitor):', error);
          return Promise.reject(error);
        }
      }
      // Fallback to localStorage if Capacitor filesystem not available
      try {
        localStorage.setItem('auto-save', JSON.stringify(data));
        console.log('Auto-save updated (localStorage fallback)');
        return Promise.resolve();
      } catch (error) {
        console.error('Error saving auto-save (localStorage):', error);
        return Promise.reject(error);
      }
    } else {
      // Web fallback - use localStorage
      try {
        localStorage.setItem('auto-save', JSON.stringify(data));
        console.log('Auto-save updated (localStorage)');
        return Promise.resolve();
      } catch (error) {
        console.error('Error saving auto-save (localStorage):', error);
        return Promise.reject(error);
      }
    }
  }

  /**
   * Load auto-save data
   */
  async loadAutoSave() {
    if (this.platform === 'electron' && this.ipcRenderer) {
      return new Promise((resolve) => {
        const handler = (event, data) => {
          this.ipcRenderer.removeListener('load-auto-save', handler);
          resolve(data);
        };
        this.ipcRenderer.on('load-auto-save', handler);
        this.ipcRenderer.send('check-auto-save');
      });
    } else if (this.platform === 'capacitor') {
      await this.ensureCapacitorPlugins();
      if (this.filesystem) {
        try {
          const fileName = 'auto-save.json';
          const result = await this.filesystem.readFile({
            path: fileName,
            directory: this.filesystem.Directory.Data
          });
          return JSON.parse(result.data);
        } catch (error) {
          // File doesn't exist or error reading
          console.log('No auto-save file found (Capacitor)');
          return null;
        }
      }
      // Fallback to localStorage if Capacitor filesystem not available
      try {
        const data = localStorage.getItem('auto-save');
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error('Error loading auto-save (localStorage):', error);
        return null;
      }
    } else {
      // Web fallback - use localStorage
      try {
        const data = localStorage.getItem('auto-save');
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error('Error loading auto-save (localStorage):', error);
        return null;
      }
    }
  }

  /**
   * Check if save file exists and get its timestamp
   */
  async checkSaveFileStatus() {
    if (this.platform === 'electron' && this.ipcRenderer) {
      return new Promise((resolve) => {
        const handler = (event, status) => {
          this.ipcRenderer.removeListener('save-file-status', handler);
          resolve(status);
        };
        this.ipcRenderer.on('save-file-status', handler);
        this.ipcRenderer.send('check-save-file-exists');
      });
    } else if (this.platform === 'capacitor') {
      await this.ensureCapacitorPlugins();
      if (this.filesystem) {
        try {
          const fileName = 'auto-save.json';
          const stat = await this.filesystem.stat({
            path: fileName,
            directory: this.filesystem.Directory.Data
          });
          return {
            exists: true,
            lastModified: new Date(stat.mtime).toISOString()
          };
        } catch (error) {
          return {
            exists: false,
            lastModified: null
          };
        }
      }
      // Fallback to localStorage if Capacitor filesystem not available
      const data = localStorage.getItem('auto-save');
      return {
        exists: !!data,
        lastModified: data ? new Date().toISOString() : null
      };
    } else {
      // Web fallback - check localStorage
      const data = localStorage.getItem('auto-save');
      return {
        exists: !!data,
        lastModified: data ? new Date().toISOString() : null
      };
    }
  }

  /**
   * Listen for app close warnings (Electron only)
   */
  onCloseWarning(callback) {
    if (this.platform === 'electron' && this.ipcRenderer) {
      this.ipcRenderer.on('warn-close', callback);
      return () => {
        this.ipcRenderer.removeListener('warn-close', callback);
      };
    } else if (this.platform === 'capacitor') {
      // Initialize listener asynchronously
      this.ensureCapacitorPlugins().then(() => {
        if (this.app) {
          this.app.addListener('appStateChange', ({ isActive }) => {
            if (!isActive) {
              // App is going to background - could trigger save warning
              callback();
            }
          });
        }
      });
      return () => {
        // Cleanup handled by Capacitor automatically
      };
    }
    return () => {}; // No-op for web
  }

  /**
   * Confirm close (Electron only)
   */
  confirmClose() {
    if (this.platform === 'electron' && this.ipcRenderer) {
      this.ipcRenderer.send('confirm-close');
    }
  }

  /**
   * Get platform name
   */
  getPlatform() {
    return this.platform;
  }
}

// Export singleton instance
export const platformFS = new PlatformFileSystem();
export default platformFS;

