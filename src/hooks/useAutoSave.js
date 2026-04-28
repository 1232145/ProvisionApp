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
    // Only save if there's meaningful data
    if (data && (data.Island || data.Species || data.First_Name || data.Last_Name || data.Date_Time_Start)) {
      platformFS.saveAutoSave(data).catch(error => {
        console.error('Error in auto-save:', error);
      });
    }
  }, []);

  return useDebounce(autoSave, delay);
};

export default useAutoSave;
