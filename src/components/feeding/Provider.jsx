import React, { useState } from 'react';
import Button from '../Button';

function Provider({ setProvider, data, styles, config }) {
  // Set default providers
  const defaultProviders = ["BA", "BL", "BR", "FR", "S", "U", "UA", "UB", "UC", "X", "AA", "AB", "BMB", "KF", "KM", "SMB", "TA"];
  
  // Determine providers based on config or use default values
  const initialProviders = config?.Provider ? config.Provider.slice(0, config.MaxEntries[0]) : defaultProviders.slice(0, 10); // Take first 10 or default
  const [providers, setProviders] = useState(initialProviders);
  
  // Determine dropdown values based on config
  const dropdownValues = config?.Provider ? config.Provider.slice(config.MaxEntries[0]) : defaultProviders.slice(10);

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
