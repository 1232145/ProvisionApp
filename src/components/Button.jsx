import React from 'react';
import { Button as AntButton, Select } from 'antd';

const { Option } = Select;

const styles = {
  button: {
    fontSize: '90%',
    marginBottom: '5%',
  },
  select: (isSelected) => ({
    width: '100%',
    height: '100%',
    marginTop: '2.5%',
    fontSize: '90%',
    color: isSelected ? 'white' : 'black',
    border: isSelected ? '1px solid green' : '',
    borderRadius: '7.5px'
  }),
  selectedOption: {
    backgroundColor: 'green',
    color: 'white',
  },
  selectedBtn: {
    backgroundColor: 'green',
    color: 'white',
  },
};

function Button({ handleData, value, type, selected, dropdownValues }) {
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

  if (value === "drop-down") {
    const isSelectedValid = dropdownValues.includes(selected);

    return (
      <Select
        style={styles.select(isSelectedValid)}
        value={isSelectedValid ? selected : ""}
        onChange={(value) => handleData(value)}
        placeholder="-- Select --"
        dropdownStyle={{ fontSize: '16px' }}
      >
        <Option value="">-- Select --</Option>
        {dropdownValues.map((option, index) => (
          <Option key={index} value={option}>
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
