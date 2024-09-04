import React from 'react';
import { Button as AntButton, Select } from 'antd';

const { Option } = Select;

const styles = {
  button: {
    fontSize: '90%',
    marginBottom: '5%',
  },
  select: {
    width: '100%',
    height: '100%',
    marginTop: '2.5%',
    fontSize: '90%'
  },
  selectedBtn: {
    backgroundColor: 'green',
    color: 'white',
  },
};

function Button({ handleData, value, type, selected, dropdownValues }) {
  // Clear Button
  if (value === "") {
    return (
      <AntButton
        onClick={() => handleData("")}
        type="default"
        style={styles.button}
      >
        Clear
      </AntButton>
    );
  }

  // Drop Down button
  if (value === "drop-down") {
    return (
      <Select
        style={styles.select}
        value={selected || ""} // Set to empty string if selected is null/undefined
        onChange={(value) => handleData(value)}
        placeholder="-- Select --"
        dropdownStyle={{ fontSize: '16px' }} // Customize dropdown menu style
      >
        <Option value="">-- Select --</Option>
        {dropdownValues.map((option, index) => (
          //Note: option of dropdown not highlight
          <Option key={index} value={option} style={{ ...(selected ? styles.selectedBtn : {})}}>
            {option}
          </Option>
        ))}
      </Select>
    );
  }

  return (
    <AntButton
      onClick={(e) => handleData(e.currentTarget.value)}
      type={type ? type : "default"}
      style={{
        ...styles.button,
        ...(selected ? styles.selectedBtn : {}),
      }}
      value={value}
    >
      {value}
    </AntButton>
  );
}

export default Button;
