/**
 * Platform abstraction layer for Electron and iOS (Capacitor)
 * Detects the platform and provides unified APIs for file operations
 * Supports: Electron (Windows) and iOS (Capacitor) only
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
  // Development fallback only - not a supported production platform
  return 'dev';
};

/**
 * Platform-specific file operations
 */
class PlatformFileSystem {
  constructor() {
    this.platform = getPlatform();
    this.ipcRenderer = null;
    this.filesystem = null;
    this.directory = null; // Directory enum for Capacitor
    this.app = null;
    this.share = null; // Share plugin for Capacitor
    this.filesystemPromise = null;
    this.appPromise = null;
    this.sharePromise = null;
    
    if (this.platform === 'electron') {
      try {
        // Safely check for window.require before using it
        if (typeof window !== 'undefined' && typeof window.require === 'function') {
          this.ipcRenderer = window.require('electron').ipcRenderer;
        }
      } catch (e) {
        console.warn('Electron IPC not available:', e);
      }
    } else if (this.platform === 'capacitor') {
      // Pre-load Capacitor plugins
      this.filesystemPromise = import('@capacitor/filesystem').then(module => {
        this.filesystem = module.Filesystem;
        this.directory = module.Directory; // Import Directory enum
        return { Filesystem: module.Filesystem, Directory: module.Directory };
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
      
      // Pre-load Share plugin
      this.sharePromise = import('@capacitor/share').then(module => {
        this.share = module.Share;
        return module.Share;
      }).catch(e => {
        console.warn('Capacitor Share plugin not available:', e);
        return null;
      });
    }
  }

  /**
   * Ensure Capacitor plugins are loaded
   */
  async ensureCapacitorPlugins() {
    if (this.platform === 'capacitor') {
      if ((!this.filesystem || !this.directory) && this.filesystemPromise) {
        await this.filesystemPromise;
      }
      if (!this.app && this.appPromise) {
        await this.appPromise;
      }
      if (!this.share && this.sharePromise) {
        await this.sharePromise;
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
      if (this.filesystem && this.directory) {
        try {
          const fileName = 'auto-save.json';
          const fileData = JSON.stringify(data, null, 2);
          
          // Capacitor requires base64 encoded data for writeFile
          const base64Data = btoa(unescape(encodeURIComponent(fileData)));
          
          // Ensure path doesn't start with / and use recursive to create directories if needed
          const cleanPath = fileName.startsWith('/') ? fileName.substring(1) : fileName;
          
          await this.filesystem.writeFile({
            path: cleanPath,
            data: base64Data,
            directory: this.directory.Documents,
            recursive: true
          });
          console.log('Auto-save updated (Capacitor)');
          return Promise.resolve();
        } catch (error) {
          console.error('Error saving auto-save (Capacitor):', error);
          // Fallback to localStorage if filesystem fails
          try {
            const fileData = JSON.stringify(data, null, 2);
            localStorage.setItem('auto-save', fileData);
            console.log('Auto-save fallback to localStorage');
            return Promise.resolve();
          } catch (localError) {
            console.error('Error saving to localStorage:', localError);
            return Promise.reject(error);
          }
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
      // Development fallback only (npm start) - use localStorage
      console.warn('Running in development mode - using localStorage. Use Electron or iOS for production.');
      try {
        localStorage.setItem('auto-save', JSON.stringify(data));
        console.log('Auto-save updated (dev mode - localStorage)');
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
      if (this.filesystem && this.directory) {
        try {
          const fileName = 'auto-save.json';
          // Ensure path doesn't start with /
          const cleanPath = fileName.startsWith('/') ? fileName.substring(1) : fileName;
          
          const result = await this.filesystem.readFile({
            path: cleanPath,
            directory: this.directory.Documents
          });
          // Capacitor returns base64 encoded data, decode it
          const decodedData = decodeURIComponent(escape(atob(result.data)));
          const parsed = JSON.parse(decodedData);
          console.log('Auto-save loaded successfully (Capacitor)');
          return parsed;
        } catch (error) {
          // File doesn't exist or error reading - try localStorage fallback
          console.log('No auto-save file found in Filesystem (Capacitor), checking localStorage...');
          try {
            const data = localStorage.getItem('auto-save');
            if (data) {
              console.log('Auto-save loaded from localStorage fallback');
              return JSON.parse(data);
            }
          } catch (localError) {
            console.error('Error loading from localStorage:', localError);
          }
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
      // Development fallback only (npm start) - use localStorage
      console.warn('Running in development mode - using localStorage. Use Electron or iOS for production.');
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
      if (this.filesystem && this.directory) {
        try {
          const fileName = 'auto-save.json';
          // Ensure path doesn't start with /
          const cleanPath = fileName.startsWith('/') ? fileName.substring(1) : fileName;
          
          const stat = await this.filesystem.stat({
            path: cleanPath,
            directory: this.directory.Documents
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
      // Development fallback only (npm start) - check localStorage
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
    return () => {}; // No-op for dev mode
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

  /**
   * Save a file (CSV, etc.) - platform-aware
   * @param {string} content - File content as string
   * @param {string} fileName - Name of the file to save
   * @returns {Promise} Promise that resolves when file is saved
   */
  async saveFile(content, fileName) {
    if (this.platform === 'electron' && this.ipcRenderer) {
      // For Electron, use IPC to save file
      return new Promise((resolve, reject) => {
        this.ipcRenderer.send('save-file', { content, fileName });
        // Listen for save confirmation
        const handler = (event, success) => {
          this.ipcRenderer.removeListener('save-file-result', handler);
          if (success) {
            resolve();
          } else {
            reject(new Error('Failed to save file'));
          }
        };
        this.ipcRenderer.on('save-file-result', handler);
      });
    } else if (this.platform === 'capacitor') {
      // For Capacitor/iOS, use Filesystem API
      await this.ensureCapacitorPlugins();
      if (this.filesystem && this.directory) {
        try {
          // Capacitor requires base64 encoded data for writeFile
          // Convert string to base64
          const base64Data = btoa(unescape(encodeURIComponent(content)));
          
          // Ensure path doesn't start with / and use recursive to create directories if needed
          const cleanPath = fileName.startsWith('/') ? fileName.substring(1) : fileName;
          
          await this.filesystem.writeFile({
            path: cleanPath,
            data: base64Data,
            directory: this.directory.Documents,
            recursive: true
          });
          
          // Get the file URI to show where it was saved
          const fileUri = await this.filesystem.getUri({
            path: cleanPath,
            directory: this.directory.Documents
          });
          
          console.log(`File saved: ${fileName} (Capacitor)`);
          console.log(`File location: ${fileUri.uri}`);
          
          // Return the URI so the caller can display it
          return Promise.resolve(fileUri.uri);
        } catch (error) {
          console.error('Error saving file (Capacitor):', error);
          return Promise.reject(error);
        }
      }
      // Fallback: try to use file-saver if available (dev mode only)
      return this.saveFileDev(content, fileName);
    } else {
      // Development fallback only (npm start)
      console.warn('Running in development mode - using file download. Use Electron or iOS for production.');
      return this.saveFileDev(content, fileName);
    }
  }

  /**
   * Share a file using Capacitor Share plugin (iOS only)
   * Makes the file easily accessible via iOS share sheet
   * @param {string} fileUri - URI of the file to share
   * @param {string} fileName - Name of the file
   * @returns {Promise} Promise that resolves when share dialog is shown
   */
  async shareFile(fileUri, fileName) {
    if (this.platform === 'capacitor') {
      await this.ensureCapacitorPlugins();
      if (this.share && this.filesystem) {
        try {
          // Read the file content
          const cleanPath = fileName.startsWith('/') ? fileName.substring(1) : fileName;
          const result = await this.filesystem.readFile({
            path: cleanPath,
            directory: this.directory.Documents
          });
          
          // Decode base64 data
          const decodedData = decodeURIComponent(escape(atob(result.data)));
          
          // Share the file content
          await this.share.share({
            title: fileName,
            text: decodedData,
            dialogTitle: `Share ${fileName}`
          });
          return Promise.resolve();
        } catch (error) {
          console.error('Error sharing file:', error);
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(new Error('Share not available on this platform'));
  }

  /**
   * Save file using file-saver (development mode only)
   * @private
   */
  async saveFileDev(content, fileName) {
    try {
      // Dynamically import file-saver only when needed
      const { saveAs } = await import('file-saver');
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, fileName);
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving file (web):', error);
      // Last resort: create download link
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return Promise.resolve();
    }
  }
}

// Export singleton instance
export const platformFS = new PlatformFileSystem();
export default platformFS;

