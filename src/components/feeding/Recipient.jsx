import React, { useState } from 'react';
import Button from '../Button';

function Recipient({ setRecipient, data }) {
  const [recip, setRecip] = useState(["A", "A1", "B", "UC", "U", "K", "O", "S", "M", "Y"]);
  const dropdownValues = ["C", "N", "R", "T", "UA"];

  const addRecipOption = (data) => {
    setRecip([...recip, data]);
  };

  return (
    <div className="recipient">
      <p>Recipient: {data}</p>
      <div className="recipient-bt">
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
