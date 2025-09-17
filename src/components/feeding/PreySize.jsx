import React from 'react';
import Button from '../Button';

// Default prey sizes outside component to avoid re-creation
const defaultPreySizes = ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2", "2.25", "2.5", "2.75", "3", "3.25", "Unknown"];

function PreySize({ setPreySize, data, styles, slicedConfig }) {
  // Use pre-computed sliced data from parent (eliminates re-renders and useEffect)
  const preySizes = slicedConfig?.PreySize || defaultPreySizes.slice(0, 10);
  const dropdownValues = slicedConfig?.PreySizeDropdown || defaultPreySizes.slice(10);

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
