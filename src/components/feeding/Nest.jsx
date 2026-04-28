import React, { useState } from 'react';
import { Input, Button as AntButton } from 'antd';
import Button from '../Button';
import { useConfig } from '../../contexts/ConfigContext';
import { useStyles } from '../../contexts/StylesContext';
import { useFeeding } from '../../contexts/FeedingContext';

const defaultNests = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];

function Nest({ data }) {
  const { slicedConfig } = useConfig();
  const styles = useStyles();
  const { setNest } = useFeeding();
  const [customValue, setCustomValue] = useState('');

  const nests = slicedConfig?.Nest || defaultNests.slice(0, 10);
  const dropdownValues = slicedConfig?.NestDropdown || defaultNests.slice(10);

  const handleSetCustom = () => {
    if (customValue.trim()) {
      setNest(customValue.trim());
      setCustomValue('');
    }
  };

  return (
    <div style={styles.feedingItemContainer}>
      <p>Nest: {data}</p>
      <div style={styles.feedingItemButtonContainer}>
        {nests.map((item, index) => (
          <Button key={index} handleData={setNest} value={item} selected={item === data} />
        ))}
        <Button handleData={setNest} value="" />
        <Button handleData={setNest} selected={data} value="drop-down" dropdownValues={dropdownValues} />
        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
          <Input
            placeholder="Write in..."
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onPressEnter={handleSetCustom}
            size="small"
          />
          <AntButton size="small" onClick={handleSetCustom}>Set</AntButton>
        </div>
      </div>
    </div>
  );
}

export default Nest;
