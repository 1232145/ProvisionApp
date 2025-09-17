import React, { useState, useEffect } from 'react';
import Button from '../Button';

// Set default nests outside component to avoid re-creation
const defaultNests = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];

function Nest({ setNest, data, styles, config, maxEntries = 10 }) {
  
  // Determine nests based on config or use default values, using maxEntries
  const initialNests = config?.Nest ? config.Nest.slice(0, maxEntries) : defaultNests.slice(0, maxEntries);
  const [nests, setNests] = useState(initialNests);
  
  // Update nests when maxEntries changes
  useEffect(() => {
    const newNests = config?.Nest ? config.Nest.slice(0, maxEntries) : defaultNests.slice(0, maxEntries);
    setNests(newNests);
  }, [maxEntries, config]);
  
  // Determine dropdown values based on config
  const dropdownValues = config?.Nest ? config.Nest.slice(maxEntries) : defaultNests.slice(maxEntries);

  return (
    <div style={styles.feedingItemContainer}>
      <p>Nest: {data}</p>
      <div style={styles.feedingItemButtonContainer}>
        {nests.map((item, index) => (
          <Button
            handleData={setNest}
            value={item}
            key={index}
            selected={item === data}
          />
        ))}
        <Button handleData={setNest} value="" />
        <Button handleData={setNest} selected={data} value="drop-down" dropdownValues={dropdownValues} />
      </div>
    </div>
  );
}

export default Nest;
