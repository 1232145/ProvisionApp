import React, { useState } from 'react';
import { Input, Button as AntButton } from 'antd';
import Button from '../Button';
import { useConfig } from '../../contexts/ConfigContext';
import { useStyles } from '../../contexts/StylesContext';
import { useFeeding } from '../../contexts/FeedingContext';

const defaultProviders = ["BA", "BL", "BR", "FR", "S", "U", "UA", "UB", "UC", "X", "AA", "AB", "BMB", "KF", "KM", "SMB", "TA"];

function Provider({ data }) {
  const { slicedConfig } = useConfig();
  const styles = useStyles();
  const { setProvider } = useFeeding();
  const [customValue, setCustomValue] = useState('');

  const providers = slicedConfig?.Provider || defaultProviders.slice(0, 10);
  const dropdownValues = slicedConfig?.ProviderDropdown || defaultProviders.slice(10);

  const handleSetCustom = () => {
    if (customValue.trim()) {
      setProvider(customValue.trim());
      setCustomValue('');
    }
  };

  return (
    <div style={styles.feedingItemContainer}>
      <p>Provider: {data}</p>
      <div style={styles.feedingItemButtonContainer}>
        {providers.map((item, index) => (
          <Button key={index} value={item} handleData={setProvider} selected={item === data} />
        ))}
        <Button handleData={setProvider} value="" />
        <Button handleData={setProvider} value="drop-down" selected={data} dropdownValues={dropdownValues} />
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

export default Provider;
