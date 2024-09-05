import React from 'react'

function Island({ setIsland, data, styles }) {
  const handleChange = (e) => {
    setIsland(e.currentTarget.value);
  }

  return (
    <div style={styles.inputContainer}>
      <p style={styles.labelContainer}><span style={styles.label}>Island:</span></p>
      <input
          onChange={(e) => handleChange(e)}
          value={data}
          placeholder="Island"
          style={styles.inputField}
        />
    </div>
  )
}

export default Island