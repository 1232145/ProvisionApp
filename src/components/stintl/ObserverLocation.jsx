import React, { useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

/**
 * ObserverLocation component for selecting or entering observer location
 * Shows dropdown if config data is available, otherwise shows text input
 * @param {object} props - Component props
 * @param {Function} props.setObs - Callback function to update observer location value
 * @param {string} props.data - Current observer location value
 * @param {object} props.styles - Style object for component styling
 * @param {object|null} props.config - Config object containing ObserverLocation array, or null if no config loaded
 */
function ObserverLocation({ setObs, data, styles, config }) {
  /**
   * Handles selection change from dropdown
   * @param {string} value - Selected observer location value
   */
  const handleSelectChange = (value) => {
    setObs(value);
  };

  /**
   * Handles input change from text field
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    setObs(e.currentTarget.value);
  };

  // Synchronize the select value based on input
  useEffect(() => {
    if (data && config && config.ObserverLocation && !config.ObserverLocation.includes(data)) {
      // Do nothing if the input value isn't in the config
    }
  }, [data, config]);

  // Check if config has ObserverLocation data
  const hasConfigData = config && config.ObserverLocation && config.ObserverLocation.length > 0;

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
          value={config.ObserverLocation.includes(data) ? data : undefined} // Set value based on input
        >
          {config.ObserverLocation.map((location, index) => (
            <Option key={index} value={location}>
              {location}
            </Option>
          ))}
        </Select>
      ) : (
        <input
          onChange={handleInputChange}
          value={data}
          placeholder="Observer location"
          style={{
            ...styles.inputField,
            width: '100%'
          }}
        />
      )}
    </div>
  );
}

export default ObserverLocation;
