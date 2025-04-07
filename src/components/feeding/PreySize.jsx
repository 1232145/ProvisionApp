import React, { useState } from 'react';
import Button from '../Button';

function PreySize({ setPreySize, data, styles, config }) {
  // Default prey sizes
  const defaultPreySizes = ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2", "2.25", "2.5", "2.75", "3", "3.25", "Unknown"];
  
  const allPreySizes = config?.PreySize ? config.PreySize : defaultPreySizes;

  const num = Math.min(allPreySizes.length, 5);

  // Determine prey sizes based on config or use default values
  const initialPreySizes = allPreySizes.slice(0, num); // Take first 10 or default
  const [preySizes, setPreySizes] = useState(initialPreySizes);
  
  // Determine dropdown values based on config
  const dropdownValues = allPreySizes.slice(num); // Remaining or default

 
  return (
    <div style={styles.feedingItemContainer}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
        <label htmlFor='preySize-input'>Prey Size: </label>
        <input id='preySize-input' style={{width: "80%"}} value={data} onChange={(e) => setPreySize(e.target.value)} />
      </div>
      <br />  


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
