import React from 'react';
import Button from '../Button';
import { useConfig } from '../../contexts/ConfigContext';
import { useStyles } from '../../contexts/StylesContext';
import { useFeeding } from '../../contexts/FeedingContext';

// Set default providers outside component to avoid re-creation
const defaultProviders = ["BA", "BL", "BR", "FR", "S", "U", "UA", "UB", "UC", "X", "AA", "AB", "BMB", "KF", "KM", "SMB", "TA"];

function Provider({ data }) {
  // Use context hooks instead of props (eliminates prop drilling)
  const { slicedConfig } = useConfig();
  const styles = useStyles();
  const { setProvider } = useFeeding();
  
  // Use pre-computed sliced data from context
  const providers = slicedConfig?.Provider || defaultProviders.slice(0, 10);
  const dropdownValues = slicedConfig?.ProviderDropdown || defaultProviders.slice(10);

  return (
    <div style={styles.feedingItemContainer}>
      <p>Provider: {data}</p>
      <div style={styles.feedingItemButtonContainer}>
        {providers.map((item, index) => (
          <Button
            key={index}
            value={item}
            handleData={setProvider}
            selected={item === data}
          />
        ))}
        <Button handleData={setProvider} value="" />
        <Button handleData={setProvider} value="drop-down" selected={data} dropdownValues={dropdownValues} />
      </div>
    </div>
  );
}

export default Provider;
