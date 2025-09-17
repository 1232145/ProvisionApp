import React, { useState, useEffect } from 'react';
import Button from '../Button';

// Set default providers outside component to avoid re-creation
const defaultProviders = ["BA", "BL", "BR", "FR", "S", "U", "UA", "UB", "UC", "X", "AA", "AB", "BMB", "KF", "KM", "SMB", "TA"];

function Provider({ setProvider, data, styles, config, maxEntries = 10 }) {
  
  // Determine providers based on config or use default values, using maxEntries
  const initialProviders = config?.Provider ? config.Provider.slice(0, maxEntries) : defaultProviders.slice(0, maxEntries);
  const [providers, setProviders] = useState(initialProviders);
  
  // Update providers when maxEntries changes
  useEffect(() => {
    const newProviders = config?.Provider ? config.Provider.slice(0, maxEntries) : defaultProviders.slice(0, maxEntries);
    setProviders(newProviders);
  }, [maxEntries, config]);
  
  // Determine dropdown values based on config
  const dropdownValues = config?.Provider ? config.Provider.slice(maxEntries) : defaultProviders.slice(maxEntries);

  return (
    <div style={styles.feedingItemContainer}>
      <p>Provider: {data}</p>
      <div style={styles.feedingItemButtonContainer}>
        {providers.map((item, index) => (
          <Button
            key={index}
            value={item}
            handleData={setProvider}
            selected={item === data}
          />
        ))}
        <Button handleData={setProvider} value="" />
        <Button handleData={setProvider} value="drop-down" selected={data} dropdownValues={dropdownValues} />
      </div>
    </div>
  );
}

export default Provider;
