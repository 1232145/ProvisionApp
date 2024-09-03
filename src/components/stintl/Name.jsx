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
    <div>
      <div style={styles.inputContainer}>
        <p>First name:
          <input
            onChange={(e) => handleChange(e, "first")}
            value={input.firstName}
            placeholder="First name"
            style={styles.inputField}
          /></p>
      </div>
      <div style={styles.inputContainer}>
        <p>Last name:
          <input
            onChange={(e) => handleChange(e, "last")}
            value={input.lastName}
            placeholder="Last name"
            style={styles.inputField}
          /></p>
      </div>
    </div>
  );
}

export default Name;