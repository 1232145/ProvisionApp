import { useCallback } from 'react';
import { useDebounce } from './useDebounce';
import platformFS from '../utils/platform';

/**
 * Centralized auto-save hook with debouncing
 * @param {number} delay - Debounce delay in milliseconds (default: 1000ms)
 * @returns {Function} Debounced auto-save function
 */
export const useAutoSave = (delay = 1000) => {
  const hasMeaningfulData = (data) => {
    if (!data || typeof data !== 'object') return false;

    const hasCoreFields = Boolean(
      data.Island ||
      data.First_Name ||
      data.Last_Name ||
      data.Observer_Location ||
      data.Date_Time_Start ||
      data.Date_Time_End ||
      data.Comment ||
      (Array.isArray(data.Species) && data.Species.length > 0)
    );

    const feedings = Array.isArray(data.feedingData) ? data.feedingData : [];
    const hasMeaningfulFeeding = feedings.some((feeding) => {
      if (!feeding || typeof feeding !== 'object') return false;

      const hasFeedingFields = Boolean(
        feeding.Nest ||
        feeding.Time_Arrive ||
        feeding.Time_Depart ||
        feeding.Provider ||
        feeding.Comment ||
        feeding.Species ||
        (feeding.Plot_Status && feeding.Plot_Status !== 'Outside Plot')
      );

      const items = Array.isArray(feeding.Number_of_Items) ? feeding.Number_of_Items : [];
      const hasItemFields = items.some((item) =>
        item && (item.Recipient || item.Prey_Item || item.Prey_Size)
      );

      return hasFeedingFields || hasItemFields;
    });

    return hasCoreFields || hasMeaningfulFeeding;
  };

  const autoSave = useCallback((data) => {
    // Only save if there's meaningful data
    if (hasMeaningfulData(data)) {
      platformFS.saveAutoSave(data).catch(error => {
        console.error('Error in auto-save:', error);
      });
    }
  }, []);

  return useDebounce(autoSave, delay);
};

export default useAutoSave;
