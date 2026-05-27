import { useCallback } from 'react';
import { useDebounce } from './useDebounce';
import platformFS from '../utils/platform';

/**
 * Centralized auto-save hook with debouncing
 * @param {number} delay - Debounce delay in milliseconds (default: 1000ms)
 * @returns {Function} Debounced auto-save function
 */
export const useAutoSave = (delay = 1000) => {
  const autoSave = useCallback((data) => {
    if (!data) return;
    console.log('[AutoSave] Triggered —', new Date().toLocaleTimeString(), '| Island:', data.Island, '| Species:', data.Species, '| Name:', data.First_Name, data.Last_Name);
    platformFS.saveAutoSave(data).then(() => {
      console.log('[AutoSave] IPC sent successfully');
    }).catch(error => {
      console.error('[AutoSave] Error sending IPC:', error);
    });
  }, []);

  return useDebounce(autoSave, delay);
};

export default useAutoSave;
