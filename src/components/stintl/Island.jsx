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

  return (
    <div style={styles.inputContainer}>
      <p style={styles.labelContainer}>
        <span style={styles.label}>Island:</span>
      </p>
      <Select
        placeholder="Select an island"
        style={{ width: '50%', marginBottom: '10px' }}
        onChange={handleSelectChange}
        allowClear
        value={config && config.Island && config.Island.includes(data) ? data : undefined} // Set value based on input
      >
        {config && config.Island && config.Island.map((island, index) => (
          <Option key={index} value={island}>
            {island}
          </Option>
        ))}
      </Select>
      <input
        onChange={handleInputChange}
        value={data}
        placeholder="Island"
        style={styles.inputField}
      />
    </div>
  );
}

export default Island;
