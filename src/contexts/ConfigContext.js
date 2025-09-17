import React, { createContext, useContext } from 'react';

// Create the Config Context
const ConfigContext = createContext();

// Custom hook to use the Config Context
export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};

// Config Provider component
export const ConfigProvider = ({ children, config, slicedConfig, maxEntries, setMaxEntries }) => {
    const value = {
        config,
        slicedConfig,
        maxEntries,
        setMaxEntries
    };

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};

export default ConfigContext;
