import React, { useState } from 'react';
import Button from '../Button';

function Provider({ setProvider, data, styles, config }) {
  // Set default providers
  const defaultProviders = ["BA", "BL", "BR", "FR", "S", "U", "UA", "UB", "UC", "X", "AA", "AB", "BMB", "KF", "KM", "SMB", "TA"];
  
  const allProviders = config?.Provider ? config.Provider : defaultProviders;

  const num = Math.min( 5, allProviders.length );

  // Determine providers based on config or use default values
  const initialProviders = allProviders.slice(0, num) // Take first 10 or default
  const [providers, setProviders] = useState(initialProviders);
  
  // Determine dropdown values based on config
  const dropdownValues = allProviders.slice(num)

  return (
    <div style={styles.feedingItemContainer}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
        <label htmlFor='provider-input'>Provider: </label>
        <input id='provider-input' style={{width: "80%"}} value={data} onChange={(e) => setProvider(e.target.value)} />
      </div>
      <br />

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
