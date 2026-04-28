import React from 'react'
import { Select } from 'antd'

const { Option } = Select;

function Species({ setSpecies, data, styles, config }) {
  const defaultSpecies = ['ARTE', 'COTE', 'BLGU', 'ATPU', 'LAGU', 'TERN', 'GULL'];

  const speciesOptions = config?.Species && config.Species.length > 0
    ? config.Species
    : defaultSpecies;

  // Normalize to array (handles old string data or empty state)
  const selectedValues = Array.isArray(data) ? data : (data ? [data] : []);

  return (
    <div style={styles.inputContainer}>
      <p style={styles.labelContainer}><span style={styles.label}>Species:</span></p>
      <Select
        mode="multiple"
        value={selectedValues}
        onChange={setSpecies}
        placeholder="Select species (select multiple if co-watching)"
        style={{ width: '100%' }}
        showSearch
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
