import React, { useState } from 'react';
import Button from '../Button';

function Nest({ setNest, data }) {
  const [nests, setNests] = useState(["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"]);
  const dropdownValues = ["P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P20"];

  return (
    <div className="nest">
      <p>Nest: {data}</p>
      <div className="nest-bt">
        {nests.map((item, index) => (
          <Button
            handleData={setNest}
            value={item}
            key={index}
            selected={item === data}
          />
        ))}
        <Button handleData={setNest} value="" />
        <Button handleData={setNest} selected={data} value="drop-down" dropdownValues={dropdownValues} />
      </div>
    </div>
  );
}

export default Nest;
