import React, { useState } from 'react';
import Button from '../Button';

function Recipient({ setRecipient, data, styles, config }) {
  // Default recipient values
  const defaultRecipients = ["A", "A1", "B", "UC", "U", "K", "O", "S", "M", "Y", "C", "N", "R", "T", "UA"];
  
  // Determine recipients based on config or use default values
  const initialRecipients = config?.Recipient ? config.Recipient.slice(0, config.MaxEntries[0]) : defaultRecipients.slice(0, 10); // Take first 10 or default
  const [recip, setRecip] = useState(initialRecipients);
  
  // Determine dropdown values based on config
  const dropdownValues = config?.Recipient ? config.Recipient.slice(config.MaxEntries[0]) : defaultRecipients.slice(10);

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
