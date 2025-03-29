import React, { useState } from 'react';
import Button from '../Button';

function PreyItem({ setPreyItem, data, styles, config }) {
  // Default prey items
  const defaultPreyItems = ["H", "U", "R", "S", "UF", "A", "HD", "T", "H or R", "E", "ALE", "AS", "B", "BR", "C", "CA", "CH", "CU", "CUS", "D", "DR", "EEL", "EP", "EW", "F", 
    "FS", "G", "GH", "I", "J", "K", "KF", "L", "LA/H", "LA/HD", "LA/R", "LA/S", "LA/UF", 
    "M", "MF", "O", "P", "PL", "PS", "PUF", "Q", "RF", "RG", "ROS", "RS", "SB", "SH", 
    "SM", "SN", "SP", "SS", "SY", "T", "TC", "U", "UF1", "UF1-SI2016", "UFEER2016", 
    "UF-PI2017", "UFSI2015", "UG", "LA/UF", "UI", "V", "W", "X", "Y", "Z"];

  const allPreyItems = config?.PreyItem ? config.PreyItem: defaultPreyItems;
  
  const num = Math.min( 5, allPreyItems.length );
  
  // Determine prey items based on config or use default values
  const initialPreyItems = allPreyItems.slice(0, num) // Take first 10 or default
  const [preyI, setPreyI] = useState(initialPreyItems);
  
  // Determine dropdown values based on config
  const dropdownValues = allPreyItems.slice(num);
  
  // Add "Other" option if it is not already in config file
  if(!dropdownValues.includes("Other")){
    dropdownValues.push("Other")
  }

  return (
    <div style={styles.feedingItemContainer}>
      <p>Prey Item: {data}</p>
      <div style={styles.feedingItemButtonContainer}>
        {preyI.map((item, index) => (
          <Button 
            key={index} 
            value={item} 
            handleData={setPreyItem}
            selected={item === data} 
          />
        ))}
        <Button handleData={setPreyItem} value="" />
        <Button handleData={setPreyItem} value="drop-down" selected={data} dropdownValues={dropdownValues} />
      </div>
    </div>
  );
}

export default PreyItem;
