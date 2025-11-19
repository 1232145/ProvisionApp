import React from 'react';
import Button from '../Button';
import { useConfig } from '../../contexts/ConfigContext';
import { useStyles } from '../../contexts/StylesContext';
import { useFeeding } from '../../contexts/FeedingContext';

// Default prey items outside component to avoid re-creation
const defaultPreyItems = ["H", "U", "R", "S", "UF", "A", "HD", "T", "H or R", "E", "ALE", "AS", "B", "BR", "C", "CA", "CH", "CU", "CUS", "D", "DR", "EEL", "EP", "EW", "F", 
  "FS", "G", "GH", "I", "J", "K", "KF", "L", "LA/H", "LA/HD", "LA/R", "LA/S", "LA/UF", 
  "M", "MF", "O", "P", "PL", "PS", "PUF", "Q", "RF", "RG", "ROS", "RS", "SB", "SH", 
  "SM", "SN", "SP", "SS", "SY", "T", "TC", "U", "UF1", "UF1-SI2016", "UFEER2016", 
  "UF-PI2017", "UFSI2015", "UG", "LA/UF", "UI", "V", "W", "X", "Y", "Z"];

function PreyItem({ data }) {
  // Use context hooks instead of props (eliminates prop drilling)
  const { slicedConfig } = useConfig();
  const styles = useStyles();
  const { setPreyItem } = useFeeding();
  
  // Use pre-computed sliced data from context
  const preyI = slicedConfig?.PreyItem || defaultPreyItems.slice(0, 10);
  const dropdownValues = slicedConfig?.PreyItemDropdown || defaultPreyItems.slice(10);

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
