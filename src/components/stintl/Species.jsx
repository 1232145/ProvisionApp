import React from 'react'
import { Select } from 'antd'

const { Option } = Select;

/**
 * Species component for selecting species from dropdown
 * Uses config data if available, otherwise falls back to default species options
 * @param {object} props - Component props
 * @param {Function} props.setSpecies - Callback function to update species value
 * @param {string} props.data - Current species value
 * @param {object} props.styles - Style object for component styling
 * @param {object|null} props.config - Config object containing Species array, or null if no config loaded
 */
function Species({ setSpecies, data, styles, config }) {
  // Default species options
  const defaultSpecies = ['ARTE', 'COTE'];
  
  // Get species options from config or use defaults
  const speciesOptions = config?.Species && config.Species.length > 0 
    ? config.Species 
    : defaultSpecies;

  /**
   * Handles species selection change from dropdown
   * @param {string} value - Selected species value
   */
  const handleSelectChange = (value) => {
    setSpecies(value);
  }

  return (
    <div style={styles.inputContainer}>
      <p style={styles.labelContainer}><span style={styles.label}>Species:</span></p>
      <Select
        value={data}
        onChange={handleSelectChange}
        placeholder="Select species"
        style={{ 
          width: '100%'
        }}
        showSearch
        allowClear
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {speciesOptions.map((species, index) => (
          <Option key={index} value={species}>
            {species}
          </Option>
        ))}
      </Select>
    </div>
  )
}

export default Species