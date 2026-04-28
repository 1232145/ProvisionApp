import React, { useState } from 'react';
import { Input, Button as AntButton } from 'antd';
import Button from '../Button';
import { useConfig } from '../../contexts/ConfigContext';
import { useStyles } from '../../contexts/StylesContext';
import { useFeeding } from '../../contexts/FeedingContext';

const defaultPreySizes = ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2", "2.25", "2.5", "2.75", "3", "3.25", "Unknown"];

function PreySize({ data }) {
  const { slicedConfig } = useConfig();
  const styles = useStyles();
  const { setPreySize } = useFeeding();
  const [customValue, setCustomValue] = useState('');

  const preySizes = slicedConfig?.PreySize || defaultPreySizes.slice(0, 10);
  const dropdownValues = slicedConfig?.PreySizeDropdown || defaultPreySizes.slice(10);

  const handleSetCustom = () => {
    if (customValue.trim()) {
      setPreySize(customValue.trim());
      setCustomValue('');
    }
  };

  return (
    <div style={styles.feedingItemContainer}>
      <p>Prey Size: {data}</p>
      <div style={styles.feedingItemButtonContainer}>
        {preySizes.map((item, index) => (
          <Button key={index} value={item} handleData={setPreySize} selected={data === item} />
        ))}
        <Button handleData={setPreySize} value="" />
        <Button handleData={setPreySize} value="drop-down" selected={data} dropdownValues={dropdownValues} />
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

export default PreySize;
