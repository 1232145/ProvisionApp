import React, { useEffect } from 'react';
import { Select, Input } from 'antd';

const { Option } = Select;

function Name({ setName, data, styles, config }) {
  // data is expected to be a combined string or an object with First_Name/Last_Name
  const combined = typeof data === 'string' ? data : `${data?.First_Name || ''} ${data?.Last_Name || ''}`.trim();

  const handleSelectChange = (value) => {
    // value from dropdown may be a combined string
    setName(value);
  };

  const handleFirstChange = (e) => {
    const first = e.currentTarget.value;
    const last = typeof data === 'object' ? (data?.Last_Name || '') : (combined.split(/\s+/).slice(1).join(' ') || '');
    setName({ First_Name: first, Last_Name: last });
  };

  const handleLastChange = (e) => {
    const last = e.currentTarget.value;
    const first = typeof data === 'object' ? (data?.First_Name || '') : (combined.split(/\s+/)[0] || '');
    setName({ First_Name: first, Last_Name: last });
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
        style={{ width: '100%', marginBottom: '10px' }}
        onChange={handleSelectChange}
        allowClear
        value={config && config.Name && config.Name.includes(combined) ? combined : undefined}
      >
        {config && config.Name && config.Name.map((name, index) => (
          <Option key={index} value={name}>
            {name}
          </Option>
        ))}
      </Select>
      <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
        <Input
          onChange={handleFirstChange}
          value={typeof data === 'object' ? (data?.First_Name || '') : (combined.split(/\s+/)[0] || '')}
          placeholder="First Name"
          style={{ ...styles.inputField, width: '50%' }}
        />
        <Input
          onChange={handleLastChange}
          value={typeof data === 'object' ? (data?.Last_Name || '') : (combined.split(/\s+/).slice(1).join(' ') || '')}
          placeholder="Last Name"
          style={{ ...styles.inputField, width: '50%' }}
        />
      </div>
    </div>
  );
}

export default Name;