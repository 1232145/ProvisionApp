import React, { useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

function Name({ setName, data, styles, config }) {
  const handleSelectChange = (value) => {
    setName(value);
  };

  const handleInputChange = (e) => {
    setName(e.currentTarget.value);
  };

  // Synchronize the select value based on input
  useEffect(() => {
    if (data && config && config.Name && !config.Name.includes(data)) {
      // If the input is not in the config, ensure it doesn't trigger an update
      // You might not need to do anything here, just a safeguard
    }
  }, [data, config]);

  return (
    <div style={styles.inputContainer}>
      <p style={styles.labelContainer}>
        <span style={styles.label}>Name:</span>
      </p>
      <Select
        placeholder="Select a name..."
        style={{ width: '50%', marginBottom: '10px' }}
        onChange={handleSelectChange}
        allowClear
        value={config && config.Name && config.Name.includes(data) ? data : undefined} // Set value based on input
      >
        {config && config.Name && config.Name.map((name, index) => (
          <Option key={index} value={name}>
            {name}
          </Option>
        ))}
      </Select>
      <input
        onChange={handleInputChange}
        value={data}
        placeholder="Name"
        style={styles.inputField}
      />
    </div>
  );
}

export default Name;
