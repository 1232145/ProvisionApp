import React from 'react';

function Name({ setName, data, styles }) {
  const handleChange = (e) => {
    setName(e.currentTarget.value);
  };

  return (
    <>
      <div style={styles.inputContainer}>
        <p style={styles.labelContainer}><span style={styles.label}>Name:</span></p>
        <input
            onChange={(e) => handleChange(e)}
            value={data}
            placeholder="Name"
            style={styles.inputField}
          />
      </div>
    </>
  );
}

export default Name;