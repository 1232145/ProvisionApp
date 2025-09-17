import React, { createContext, useContext } from 'react';

// Create the Styles Context
const StylesContext = createContext();

// Custom hook to use the Styles Context
export const useStyles = () => {
    const context = useContext(StylesContext);
    if (!context) {
        throw new Error('useStyles must be used within a StylesProvider');
    }
    return context;
};

// Styles Provider component
export const StylesProvider = ({ children, styles }) => {
    return (
        <StylesContext.Provider value={styles}>
            {children}
        </StylesContext.Provider>
    );
};

export default StylesContext;
