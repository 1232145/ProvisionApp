import React from 'react';

function Name({ setName, data, styles }) {
  const handleChange = (e, type) => {
    setName(e.currentTarget.value, type);
  };

  return (
    <>
      <div style={styles.inputContainer}>
        <p style={styles.labelContainer}><span style={styles.label}>First name:</span></p>
        <input
            onChange={(e) => handleChange(e, "first")}
            value={data.firstName}
            placeholder="First name"
            style={styles.inputField}
          />
      </div>
      <div style={styles.inputContainer}>
        <p style={styles.labelContainer}><span style={styles.label}>Last name:</span></p>
        <input
            onChange={(e) => handleChange(e, "last")}
            value={data.lastName}
            placeholder="Last name"
            style={styles.inputField}
          />
      </div>
    </>
  );
}

export default Name;