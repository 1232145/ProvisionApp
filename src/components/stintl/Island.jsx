import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

function Island({ setIsland, data, styles, config }) {
  const handleSelectChange = (value) => {
    setIsland(value ?? '');
  };

  const handleInputChange = (e) => {
    setIsland(e.currentTarget.value);
  };

  const hasConfigData = config && config.Island && config.Island.length > 0;

  // Ensure loaded value always appears in the list even if not in config
  const options = hasConfigData
    ? (data && !config.Island.includes(data) ? [data, ...config.Island] : config.Island)
    : [];

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
          value={data || undefined}
        >
          {options.map((island, index) => (
            <Option key={index} value={island}>{island}</Option>
          ))}
        </Select>
      ) : (
        <input
          onChange={handleInputChange}
          value={data}
          placeholder="Island"
          style={{ ...styles.inputField, width: '100%' }}
        />
      )}
    </div>
  );
}

export default Island;
