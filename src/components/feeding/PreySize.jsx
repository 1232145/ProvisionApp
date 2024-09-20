import React from 'react';
import Button from '../Button';
import { useState } from 'react';

function PreySize({ setPreySize, data }) {
  const [preySizes, setPreySizes] = useState(["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2","Unknown"]);
  const dropdownValues = ["2.25", "2.5", "2.75", "3", "3.25"];

  const addPreySizeOption = (data) => {
    setPreySizes([...preySizes, data]);
  };

  return (
    <div className="prey-size">
      <p>Prey Size: {data}</p>
      <div className="prey-size-bt">
        {preySizes.map((item, index) => {
          return (
            <Button
              key={index}
              value={item}
              handleData={setPreySize}
              selected={data === item}
            />
          );
        })}
        <Button handleData={setPreySize} value="" />
        <Button handleData={setPreySize} value="drop-down" selected={data} dropdownValues={dropdownValues} />

      </div>
    </div>
  );
}

export default PreySize;
