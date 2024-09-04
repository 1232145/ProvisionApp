import React, { useState } from 'react';

function Name({ setName, data, styles }) {
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
  });

  const handleChange = (e, type) => {
    const val = e.currentTarget.value;
    type === "first" ? setInput({ ...input, firstName: val }) : setInput({ ...input, lastName: val });
    setName(val, type);
  };

  return (
    <>
      <div style={styles.inputContainer}>
        <p style={styles.labelContainer}><span style={styles.label}>First name:</span></p>
        <input
            onChange={(e) => handleChange(e, "first")}
            value={input.firstName}
            placeholder="First name"
            style={styles.inputField}
          />
      </div>
      <div style={styles.inputContainer}>
        <p style={styles.labelContainer}><span style={styles.label}>Last name:</span></p>
        <input
            onChange={(e) => handleChange(e, "last")}
            value={input.lastName}
            placeholder="Last name"
            style={styles.inputField}
          />
      </div>
    </>
  );
}

export default Name;