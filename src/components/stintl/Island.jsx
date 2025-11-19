import React, { useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

/**
 * Island component for selecting or entering island name
 * Shows dropdown if config data is available, otherwise shows text input
 * @param {object} props - Component props
 * @param {Function} props.setIsland - Callback function to update island value
 * @param {string} props.data - Current island value
 * @param {object} props.styles - Style object for component styling
 * @param {object|null} props.config - Config object containing Island array, or null if no config loaded
 */
function Island({ setIsland, data, styles, config }) {
  /**
   * Handles selection change from dropdown
   * @param {string} value - Selected island value
   */
  const handleSelectChange = (value) => {
    setIsland(value);
  };

  /**
   * Handles input change from text field
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    setIsland(e.currentTarget.value);
  };

  // Synchronize the select value based on input
  useEffect(() => {
    if (data && config && config.Island && !config.Island.includes(data)) {
      // Safeguard: If input is not in the config, do nothing
    }
  }, [data, config]);

  // Check if config has Island data
  const hasConfigData = config && config.Island && config.Island.length > 0;

  return (
    <div style={styles.inputContainer}>
      <p style={styles.labelContainer}>
        <span style={styles.label}>Island:</span>
      </p>
      {hasConfigData ? (
        <Select
          placeholder="Select an island"
          style={{ width: '100%' }}
          onChange={handleSelectChange}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={config.Island.includes(data) ? data : undefined} // Set value based on input
        >
          {config.Island.map((island, index) => (
            <Option key={index} value={island}>
              {island}
            </Option>
          ))}
        </Select>
      ) : (
        <input
          onChange={handleInputChange}
          value={data}
          placeholder="Island"
          style={{
            ...styles.inputField,
            width: '100%'
          }}
        />
      )}
    </div>
  );
}

export default Island;
