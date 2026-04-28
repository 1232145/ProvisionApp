import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

function ObserverLocation({ setObs, data, styles, config }) {
  const handleSelectChange = (value) => {
    setObs(value ?? '');
  };

  const handleInputChange = (e) => {
    setObs(e.currentTarget.value);
  };

  const hasConfigData = config && config.ObserverLocation && config.ObserverLocation.length > 0;

  // Ensure loaded value always appears in the list even if not in config
  const options = hasConfigData
    ? (data && !config.ObserverLocation.includes(data) ? [data, ...config.ObserverLocation] : config.ObserverLocation)
    : [];

  return (
    <div style={styles.inputContainer}>
      <p style={styles.labelContainer}>
        <span style={styles.label}>Obs location:</span>
      </p>
      {hasConfigData ? (
        <Select
          placeholder="Select an observer location"
          style={{ width: '100%' }}
          onChange={handleSelectChange}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={data || undefined}
        >
          {options.map((location, index) => (
            <Option key={index} value={location}>{location}</Option>
          ))}
        </Select>
      ) : (
        <input
          onChange={handleInputChange}
          value={data}
          placeholder="Observer location"
          style={{ ...styles.inputField, width: '100%' }}
        />
      )}
    </div>
  );
}

export default ObserverLocation;
