import React from 'react';
import { Select, Input } from 'antd';

const { Option } = Select;

function Name({ setName, data, styles, config }) {
  const combined = typeof data === 'string'
    ? data
    : `${data?.First_Name || ''} ${data?.Last_Name || ''}`.trim();

  const handleSelectChange = (value) => {
    setName(value ?? '');
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

  const hasConfigData = config && config.Name && config.Name.length > 0;

  // Ensure loaded value always appears in the list even if not in config
  const options = hasConfigData
    ? (combined && !config.Name.includes(combined) ? [combined, ...config.Name] : config.Name)
    : [];

  return (
    <div style={styles.inputContainer}>
      <p style={styles.labelContainer}>
        <span style={styles.label}>Name:</span>
      </p>
      {hasConfigData ? (
        <Select
          placeholder="Select a name..."
          style={{ width: '100%' }}
          onChange={handleSelectChange}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={combined || undefined}
        >
          {options.map((name, index) => (
            <Option key={index} value={name}>{name}</Option>
          ))}
        </Select>
      ) : (
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
      )}
    </div>
  );
}

export default Name;
