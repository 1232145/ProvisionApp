import React from 'react';
import Button from '../Button';

// Default recipient values outside component to avoid re-creation
const defaultRecipients = ["A", "A1", "B", "UC", "U", "K", "O", "S", "M", "Y", "C", "N", "R", "T", "UA"];

function Recipient({ setRecipient, data, styles, slicedConfig }) {
  // Use pre-computed sliced data from parent (eliminates re-renders and useEffect)
  const recip = slicedConfig?.Recipient || defaultRecipients.slice(0, 10);
  const dropdownValues = slicedConfig?.RecipientDropdown || defaultRecipients.slice(10);

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
