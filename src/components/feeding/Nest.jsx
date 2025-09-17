import React from 'react';
import Button from '../Button';

// Set default nests outside component to avoid re-creation
const defaultNests = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];

function Nest({ setNest, data, styles, slicedConfig }) {
  // Use pre-computed sliced data from parent (eliminates re-renders and useEffect)
  const nests = slicedConfig?.Nest || defaultNests.slice(0, 10);
  const dropdownValues = slicedConfig?.NestDropdown || defaultNests.slice(10);

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
