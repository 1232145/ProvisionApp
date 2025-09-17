import React, { useState, useEffect } from 'react';
import Button from '../Button';

// Default prey sizes outside component to avoid re-creation
const defaultPreySizes = ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2", "2.25", "2.5", "2.75", "3", "3.25", "Unknown"];

function PreySize({ setPreySize, data, styles, config, maxEntries = 10 }) {
  
  // Determine prey sizes based on config or use default values, using maxEntries
  const initialPreySizes = config?.PreySize ? config.PreySize.slice(0, maxEntries) : defaultPreySizes.slice(0, maxEntries);
  const [preySizes, setPreySizes] = useState(initialPreySizes);
  
  // Update prey sizes when maxEntries changes
  useEffect(() => {
    const newPreySizes = config?.PreySize ? config.PreySize.slice(0, maxEntries) : defaultPreySizes.slice(0, maxEntries);
    setPreySizes(newPreySizes);
  }, [maxEntries, config]);
  
  // Determine dropdown values based on config
  const dropdownValues = config?.PreySize ? config.PreySize.slice(maxEntries) : defaultPreySizes.slice(maxEntries);

  return (
    <div style={styles.feedingItemContainer}>
      <p>Prey Size: {data}</p>
      <div style={styles.feedingItemButtonContainer}>
        {preySizes.map((item, index) => (
          <Button
            key={index}
            value={item}
            handleData={setPreySize}
            selected={data === item}
          />
        ))}
        <Button handleData={setPreySize} value="" />
        <Button handleData={setPreySize} value="drop-down" selected={data} dropdownValues={dropdownValues} />
      </div>
    </div>
  );
}

export default PreySize;
