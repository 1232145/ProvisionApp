/**
 * Platform abstraction for browser development, Electron, and Capacitor/iOS.
 * The renderer never accesses Node or Electron modules directly.
 */

const isElectron = () => (
  typeof window !== 'undefined' && Boolean(window.desktop)
);

const isCapacitor = () => {
  if (typeof window === 'undefined' || !window.Capacitor) return false;
  return typeof window.Capacitor.isNativePlatform === 'function'
    ? window.Capacitor.isNativePlatform()
    : true;
};

const getPlatform = () => {
  if (isElectron()) return 'electron';
  if (isCapacitor()) return 'capacitor';
  return 'dev';
};

const encodeBase64 = (value) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};

const decodeBase64 = (value) => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

class PlatformFileSystem {
  constructor() {
    this.platform = getPlatform();
    this.desktop = this.platform === 'electron' ? window.desktop : null;
    this.filesystem = null;
    this.directory = null;
    this.app = null;
    this.filesystemPromise = null;
    this.appPromise = null;

    if (this.platform === 'capacitor') {
      this.filesystemPromise = import('@capacitor/filesystem')
        .then((module) => {
          this.filesystem = module.Filesystem;
          this.directory = module.Directory;
          return module;
        })
        .catch((error) => {
          console.warn('Capacitor Filesystem plugin not available:', error);
          return null;
        });

      this.appPromise = import('@capacitor/app')
        .then((module) => {
          this.app = module.App;
          return module.App;
        })
        .catch((error) => {
          console.warn('Capacitor App plugin not available:', error);
          return null;
        });
    }
  }

  async ensureCapacitorPlugins() {
    if (this.platform !== 'capacitor') return;
    if ((!this.filesystem || !this.directory) && this.filesystemPromise) {
      await this.filesystemPromise;
    }
    if (!this.app && this.appPromise) await this.appPromise;
  }

  async saveAutoSave(data) {
    if (this.platform === 'electron') {
      const result = await this.desktop.saveAutoSave(data);
      if (!result?.success) throw new Error(result?.error || 'Failed to auto-save in Electron');
      return result;
    }

    if (this.platform === 'capacitor') {
      await this.ensureCapacitorPlugins();
      if (this.filesystem && this.directory) {
        try {
          await this.filesystem.writeFile({
            path: 'auto-save.json',
            data: encodeBase64(JSON.stringify(data, null, 2)),
            directory: this.directory.Documents,
            recursive: true,
          });
          return { success: true };
        } catch (error) {
          console.error('Error saving auto-save (Capacitor):', error);
        }
      }
    }

    try {
      localStorage.setItem('auto-save', JSON.stringify(data));
      return { success: true, fallback: true };
    } catch (error) {
      console.error('Error saving auto-save:', error);
      throw error;
    }
  }

  async loadAutoSave() {
    if (this.platform === 'electron') return this.desktop.loadAutoSave();

    if (this.platform === 'capacitor') {
      await this.ensureCapacitorPlugins();
      if (this.filesystem && this.directory) {
        for (const directory of [this.directory.Documents, this.directory.Data]) {
          try {
            const result = await this.filesystem.readFile({ path: 'auto-save.json', directory });
            return JSON.parse(decodeBase64(result.data));
          } catch (error) {
            // Try the next supported location, then localStorage.
          }
        }
      }
    }

    try {
      const data = localStorage.getItem('auto-save');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading auto-save:', error);
      return null;
    }
  }

  async checkSaveFileStatus() {
    if (this.platform === 'electron') return this.desktop.checkSaveFileStatus();

    if (this.platform === 'capacitor') {
      await this.ensureCapacitorPlugins();
      if (this.filesystem && this.directory) {
        try {
          const stat = await this.filesystem.stat({ path: 'auto-save.json', directory: this.directory.Documents });
          return { exists: true, lastModified: stat.mtime ? new Date(stat.mtime).toISOString() : new Date().toISOString() };
        } catch (error) {
          // Check the fallback below.
        }
      }
    }

    const data = localStorage.getItem('auto-save');
    return { exists: Boolean(data), lastModified: data ? new Date().toISOString() : null };
  }

  onSaveFileStatus(callback) {
    if (this.platform === 'electron') return this.desktop.onSaveFileStatus(callback);
    return () => {};
  }

  onCloseWarning(callback) {
    if (this.platform === 'electron') return this.desktop.onCloseWarning(callback);

    if (this.platform === 'capacitor') {
      let listener;
      const listenerPromise = this.ensureCapacitorPlugins().then(() => {
        if (!this.app) return null;
        return this.app.addListener('appStateChange', ({ isActive }) => {
          if (!isActive) callback();
        });
      }).then((registeredListener) => {
        listener = registeredListener;
        return registeredListener;
      });

      return () => {
        listenerPromise.then((registeredListener) => {
          const activeListener = listener || registeredListener;
          activeListener?.remove();
        });
      };
    }

    return () => {};
  }

  confirmClose() {
    if (this.platform === 'electron') this.desktop.confirmClose();
  }

  getPlatform() {
    return this.platform;
  }

  async saveFile(content, fileName) {
    if (this.platform === 'electron') {
      const result = await this.desktop.saveFile(content, fileName);
      if (result?.canceled) return { canceled: true };
      if (!result?.success) throw new Error(result?.error || 'Failed to save file');
      return result.filePath;
    }

    if (this.platform === 'capacitor') {
      await this.ensureCapacitorPlugins();
      if (this.filesystem && this.directory) {
        const cleanPath = fileName.replace(/^\/+/, '');
        await this.filesystem.writeFile({
          path: cleanPath,
          data: encodeBase64(content),
          directory: this.directory.Documents,
          recursive: true,
        });
        const fileUri = await this.filesystem.getUri({ path: cleanPath, directory: this.directory.Documents });
        return fileUri.uri;
      }
    }

    return this.saveFileDev(content, fileName);
  }

  async saveFileDev(content, fileName) {
    try {
      const { saveAs } = await import('file-saver');
      saveAs(new Blob([content], { type: 'text/csv;charset=utf-8' }), fileName);
    } catch (error) {
      console.error('Error saving file in browser:', error);
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
    return null;
  }
}

export const platformFS = new PlatformFileSystem();
export default platformFS;
