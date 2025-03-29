import React, { useState } from 'react';
import Button from '../Button';

function PreySize({ setPreySize, data, styles, config }) {
  // Default prey sizes
  const defaultPreySizes = ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2", "2.25", "2.5", "2.75", "3", "3.25", "Unknown"];
  
  // Determine prey sizes based on config or use default values
  const initialPreySizes = config?.PreySize ? config.PreySize.slice(0, config.MaxEntries[0]) : defaultPreySizes.slice(0, 10); // Take first 10 or default
  const [preySizes, setPreySizes] = useState(initialPreySizes);
  
  // Determine dropdown values based on config
  const dropdownValues = config?.PreySize ? config.PreySize.slice(config.MaxEntries[0]) : defaultPreySizes.slice(10); // Remaining or default

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
