import React from 'react'
import { useState } from 'react'

function Island({ setIsland, data, styles }) {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    setInput(e.currentTarget.value);
    setIsland(e.currentTarget.value);
  }

  return (
    <div style={styles.inputContainer}>
      <p><span style={styles.label}>Island:</span>
        <input
          onChange={(e) => handleChange(e)}
          value={input}
          placeholder="Island"
          style={styles.inputField}
        /></p>
    </div>
  )
}

export default Island