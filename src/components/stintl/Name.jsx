import React, { useEffect } from 'react';
import { Select, Input } from 'antd';

const { Option } = Select;

/**
 * Name component for entering or selecting observer name
 * Supports both full name (string) and split name (object with First_Name/Last_Name)
 * Shows dropdown if config data is available, otherwise shows separate first/last name inputs
 * @param {object} props - Component props
 * @param {Function} props.setName - Callback function to update name value (accepts string or object)
 * @param {string|object} props.data - Current name value (string or {First_Name, Last_Name} object)
 * @param {object} props.styles - Style object for component styling
 * @param {object|null} props.config - Config object containing Name array, or null if no config loaded
 */
function Name({ setName, data, styles, config }) {
  // data is expected to be a combined string or an object with First_Name/Last_Name
  const combined = typeof data === 'string' ? data : `${data?.First_Name || ''} ${data?.Last_Name || ''}`.trim();

  /**
   * Handles name selection change from dropdown
   * Value from dropdown is a combined full name string
   * @param {string} value - Selected full name string
   */
  const handleSelectChange = (value) => {
    // value from dropdown may be a combined string
    setName(value);
  };

  /**
   * Handles first name input change
   * Preserves last name while updating first name
   * @param {Event} e - Input change event
   */
  const handleFirstChange = (e) => {
    const first = e.currentTarget.value;
    const last = typeof data === 'object' ? (data?.Last_Name || '') : (combined.split(/\s+/).slice(1).join(' ') || '');
    setName({ First_Name: first, Last_Name: last });
  };

  /**
   * Handles last name input change
   * Preserves first name while updating last name
   * @param {Event} e - Input change event
   */
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

  // Check if config has Name data
  const hasConfigData = config && config.Name && config.Name.length > 0;

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
          value={config.Name.includes(combined) ? combined : undefined}
        >
          {config.Name.map((name, index) => (
            <Option key={index} value={name}>
              {name}
            </Option>
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