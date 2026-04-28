import React, { useState } from 'react';
import { Input, Button as AntButton } from 'antd';
import Button from '../Button';
import { useConfig } from '../../contexts/ConfigContext';
import { useStyles } from '../../contexts/StylesContext';
import { useFeeding } from '../../contexts/FeedingContext';

const defaultRecipients = ["A", "A1", "B", "UC", "U", "K", "O", "S", "M", "Y", "C", "N", "R", "T", "UA"];

function Recipient({ data }) {
  const { slicedConfig } = useConfig();
  const styles = useStyles();
  const { setRecipient } = useFeeding();
  const [customValue, setCustomValue] = useState('');

  const recip = slicedConfig?.Recipient || defaultRecipients.slice(0, 10);
  const dropdownValues = slicedConfig?.RecipientDropdown || defaultRecipients.slice(10);

  const handleSetCustom = () => {
    if (customValue.trim()) {
      setRecipient(customValue.trim());
      setCustomValue('');
    }
  };

  return (
    <div style={styles.feedingItemContainer}>
      <p>Recipient: {data}</p>
      <div style={styles.feedingItemButtonContainer}>
        {recip.map((item, index) => (
          <Button key={index} value={item} handleData={setRecipient} selected={data === item} />
        ))}
        <Button handleData={setRecipient} value="" />
        <Button handleData={setRecipient} value="drop-down" selected={data} dropdownValues={dropdownValues} />
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

export default Recipient;
