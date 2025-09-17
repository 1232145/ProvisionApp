import React, { useState, useEffect } from 'react';
import Button from '../Button';

// Default recipient values outside component to avoid re-creation
const defaultRecipients = ["A", "A1", "B", "UC", "U", "K", "O", "S", "M", "Y", "C", "N", "R", "T", "UA"];

function Recipient({ setRecipient, data, styles, config, maxEntries = 10 }) {
  
  // Determine recipients based on config or use default values, using maxEntries
  const initialRecipients = config?.Recipient ? config.Recipient.slice(0, maxEntries) : defaultRecipients.slice(0, maxEntries);
  const [recip, setRecip] = useState(initialRecipients);
  
  // Update recipients when maxEntries changes
  useEffect(() => {
    const newRecipients = config?.Recipient ? config.Recipient.slice(0, maxEntries) : defaultRecipients.slice(0, maxEntries);
    setRecip(newRecipients);
  }, [maxEntries, config]);
  
  // Determine dropdown values based on config
  const dropdownValues = config?.Recipient ? config.Recipient.slice(maxEntries) : defaultRecipients.slice(maxEntries);

  return (
    <div style={styles.feedingItemContainer}>
      <p>Recipient: {data}</p>
      <div style={styles.feedingItemButtonContainer}>
        {recip.map((item, index) => (
          <Button 
            key={index} 
            value={item} 
            handleData={setRecipient}
            selected={data === item} 
          />
        ))}
        <Button handleData={setRecipient} value="" />
        <Button handleData={setRecipient} value="drop-down" selected={data} dropdownValues={dropdownValues} />
      </div>
    </div>
  );
}

export default Recipient;
