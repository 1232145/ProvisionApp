import React, { useState } from 'react';
import Button from '../Button';

function Recipient({ setRecipient, data, styles, config }) {
  // Default recipient values
  const defaultRecipients = ["A", "A1", "B", "UC", "U", "K", "O", "S", "M", "Y", "C", "N", "R", "T", "UA"];
  
  const allRecipients = config?.Recipient ? config.Recipient : defaultRecipients;
  
  const num = Math.min( allRecipients.length, 5 );

  // Determine recipients based on config or use default values
  const initialRecipients = allRecipients.slice(0, 5); // Take first 10 or default
  const [recip, setRecip] = useState(initialRecipients);
  
  // Determine dropdown values based on config
  const dropdownValues = allRecipients.slice(num)

  return (
    <div style={styles.feedingItemContainer}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
        <label htmlFor='recipient-input'>Recipient: </label>
        <input id='recipient-input' style={{width: "80%"}} value={data} onChange={(e) => setRecipient(e.target.value)} />
      </div>
      <br />

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
