import React, { useMemo, useCallback } from 'react';
import { Button as AntButton, Select } from 'antd';

const { Option } = Select;

const styles = {
  button: {
    fontSize: '90%',
    marginBottom: '5%',
  },
  selectedOption: {
    backgroundColor: 'green',
    color: 'white',
  },
  selectedBtn: {
    backgroundColor: 'green',
    color: 'white',
  },
};

// Static style objects to avoid recreation
const selectStyleUnselected = {
  width: '100%',
  height: '100%',
  marginTop: '2.5%',
  fontSize: '90%',
  color: 'black',
  borderRadius: '7.5px'
};

const selectStyleSelected = {
  width: '100%',
  height: '100%',
  marginTop: '2.5%',
  fontSize: '90%',
  color: 'white',
  border: '1px solid green',
  borderRadius: '7.5px'
};

const dropdownStyle = { fontSize: '16px' };

function Button({ handleData, value, type, selected, dropdownValues }) {
  // Memoize callbacks to prevent re-renders
  const handleClear = useCallback(() => {
    handleData("");
  }, [handleData]);

  const handleButtonClick = useCallback((e) => {
    handleData(e.currentTarget.value);
  }, [handleData]);

  const handleSelectChange = useCallback((val) => {
    handleData(val);
  }, [handleData]);

  // Memoize button style
  const buttonStyle = useMemo(() => ({
    ...styles.button,
    ...(selected ? styles.selectedBtn : {}),
  }), [selected]);

  if (value === "") {
    return (
      <AntButton
        onClick={handleClear}
        type="default"
        style={styles.button}
      >
        Clear
      </AntButton>
    );
  }

  if (value === "drop-down") {
    const isSelectedValid = dropdownValues?.includes(selected) || false;
    const selectStyle = isSelectedValid ? selectStyleSelected : selectStyleUnselected;

    return (
      <Select
        style={selectStyle}
        value={isSelectedValid ? selected : ""}
        onChange={handleSelectChange}
        placeholder="-- Select --"
        dropdownStyle={dropdownStyle}
      >
        <Option value="">-- Select --</Option>
        {dropdownValues?.map((option, index) => (
          <Option key={option || index} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    );
  }

  return (
    <AntButton
      onClick={handleButtonClick}
      type={type ? type : "default"}
      style={buttonStyle}
      value={value}
    >
      {value}
    </AntButton>
  );
}

// Custom comparison function for React.memo to prevent unnecessary re-renders
export default React.memo(Button, (prevProps, nextProps) => {
    // Only re-render if these props actually change
    return (
        prevProps.value === nextProps.value &&
        prevProps.type === nextProps.type &&
        prevProps.selected === nextProps.selected &&
        prevProps.handleData === nextProps.handleData &&
        JSON.stringify(prevProps.dropdownValues) === JSON.stringify(nextProps.dropdownValues)
    );
});
