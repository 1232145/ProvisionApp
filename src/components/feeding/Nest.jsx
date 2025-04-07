import React, { useState } from 'react';
import Button from '../Button';

function Nest({ setNest, data, styles, config }) {
  // Set default nests
  const defaultNests = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];
  
  const allNests = config?.Nest ? config.Nest : defaultNests; // Take first 10 or default

  const num      = Math.min(5, allNests.length);

  // Determine nests based on config or use default values
  // const initialNests = config?.Nest ? config.Nest.slice(0, config.MaxEntries[0]) : defaultNests.slice(0, 10); // Take first 10 or default
  const initialNests = allNests.slice(0,num);
  const [nests, setNests] = useState(initialNests);

  // Determine dropdown values based on config
  // const dropdownValues = config?.Nest ? config.Nest.slice(config.MaxEntries[0]) : defaultNests.slice(10); // Take remaining or default
  // initialNests.append("Other")
  const dropdownValues = allNests.slice(num)

  return (
    <div style={styles.feedingItemContainer}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
        <label htmlFor='nest-input'>Nest: </label>
        <input id='nest-input' style={{width: "80%"}} value={data} onChange={(e) => setNest(e.target.value)} />
      </div>
      <br />

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
