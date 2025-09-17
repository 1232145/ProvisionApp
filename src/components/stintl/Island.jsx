import React, { useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

function Island({ setIsland, data, styles, config }) {
  const handleSelectChange = (value) => {
    setIsland(value);
  };

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
      {/* Only show dropdown if config data is available */}
      {hasConfigData && (
        <Select
          placeholder="Select an island"
          style={{ width: '50%', marginBottom: '10px' }}
          onChange={handleSelectChange}
          allowClear
          value={config.Island.includes(data) ? data : undefined} // Set value based on input
        >
          {config.Island.map((island, index) => (
            <Option key={index} value={island}>
              {island}
            </Option>
          ))}
        </Select>
      )}
      <input
        onChange={handleInputChange}
        value={data}
        placeholder="Island"
        style={{
          ...styles.inputField,
          width: hasConfigData ? undefined : '100%' // Full width when no dropdown
        }}
      />
    </div>
  );
}

export default Island;
