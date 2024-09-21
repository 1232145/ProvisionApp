import React from 'react';
import Button from '../Button';
import { useState } from 'react';

function Recipient({ setRecipient, data, styles }) {
  const [recip, setRecip] = useState(["A", "A1", "B", "UC", "U", "K", "O", "S", "M", "Y"]);
  const dropdownValues = ["C", "N", "R", "T", "UA"];

  return (
    <div style={styles.feedingItemContainer}>
      <p>Recipient: {data}</p>
      <div style={styles.feedingItemButtonContainer}>
        {recip.map((item, index) => (
          <Button key={index} value={item} handleData={setRecipient} selected={data === item} />
        ))}
        <Button handleData={setRecipient} value="" />
        <Button handleData={setRecipient} value="drop-down" selected={data} dropdownValues={dropdownValues} />
      </div>
    </div>
  );
}

export default Recipient;
