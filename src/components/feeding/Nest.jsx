import React, { useState } from 'react';
import Button from '../Button';

function Nest({ setNest, data, styles, config }) {
  // Set default nests
  const defaultNests = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];
  
  // Determine nests based on config or use default values
  const initialNests = config?.Nest ? config.Nest.slice(0, config.MaxEntries[0]) : defaultNests.slice(0, 10); // Take first 10 or default
  const [nests, setNests] = useState(initialNests);
  
  // Determine dropdown values based on config
  const dropdownValues = config?.Nest ? config.Nest.slice(config.MaxEntries[0]) : defaultNests.slice(10); // Take remaining or default

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
