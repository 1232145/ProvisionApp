import React from 'react';
import Button from '../Button';
import { useConfig } from '../../contexts/ConfigContext';
import { useStyles } from '../../contexts/StylesContext';
import { useFeeding } from '../../contexts/FeedingContext';

// Set default nests outside component to avoid re-creation
const defaultNests = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];

function Nest({ data }) {
  // Use context hooks instead of props (eliminates prop drilling)
  const { slicedConfig } = useConfig();
  const styles = useStyles();
  const { setNest } = useFeeding();
  
  // Use pre-computed sliced data from context
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
