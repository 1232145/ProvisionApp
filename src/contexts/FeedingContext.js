import React, { createContext, useContext, useMemo } from 'react';

// Create the Feeding Context
const FeedingContext = createContext();

// Custom hook to use the Feeding Context
export const useFeeding = () => {
    const context = useContext(FeedingContext);
    if (!context) {
        throw new Error('useFeeding must be used within a FeedingProvider');
    }
    return context;
};

// Feeding Provider component
export const FeedingProvider = ({ children, feedingState, dispatchFeeding, feedingActions }) => {
    // Memoize the context value to prevent unnecessary re-renders
    // Extract primitive values from feedingState to avoid object reference issues
    const { feeding, feedingTemp, index, nIndex } = feedingState;
    
    const value = useMemo(() => ({
        // Include state values directly (primitives/objects, but memoized)
        feeding,
        feedingTemp,
        index,
        nIndex,
        dispatchFeeding,
        ...feedingActions // setPlot, setNest, setProvider, etc.
    }), [feeding, feedingTemp, index, nIndex, dispatchFeeding, feedingActions]);

    return (
        <FeedingContext.Provider value={value}>
            {children}
        </FeedingContext.Provider>
    );
};

export default FeedingContext;
