import React, { createContext, useContext } from 'react';

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
    const value = {
        ...feedingState, // feeding, feedingTemp, index, nIndex
        dispatchFeeding,
        ...feedingActions // setPlot, setNest, setProvider, etc.
    };

    return (
        <FeedingContext.Provider value={value}>
            {children}
        </FeedingContext.Provider>
    );
};

export default FeedingContext;
