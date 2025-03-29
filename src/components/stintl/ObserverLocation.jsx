import React, { useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

function ObserverLocation({ setObs, data, styles, config }) {
  const handleSelectChange = (value) => {
    setObs(value);
  };

  const handleInputChange = (e) => {
    setObs(e.currentTarget.value);
  };

  // Synchronize the select value based on input
  useEffect(() => {
    if (data && config && config.ObserverLocation && !config.ObserverLocation.includes(data)) {
      // Do nothing if the input value isn't in the config
    }
  }, [data, config]);

  return (
    <div style={styles.inputContainer}>
      <p style={styles.labelContainer}>
        <span style={styles.label}>Obs location:</span>
      </p>
      <Select
        placeholder="Select an observer location"
        style={{ width: '50%', marginBottom: '10px' }}
        onChange={handleSelectChange}
        allowClear
        value={config && config.ObserverLocation && config.ObserverLocation.includes(data) ? data : undefined} // Set value based on input
      >
        {config && config.ObserverLocation && config.ObserverLocation.map((location, index) => (
          <Option key={index} value={location}>
            {location}
          </Option>
        ))}
      </Select>
      <input
        onChange={handleInputChange}
        value={data}
        placeholder="Observer location"
        style={styles.inputField}
      />
    </div>
  );
}

export default ObserverLocation;
