import React from 'react'
import { useState } from 'react';

function ObserverLocation({ setObs, data, styles }) {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    setInput(e.currentTarget.value);
    setObs(e.currentTarget.value);
  }

  return (
    <div style={styles.inputContainer}>
      <p style={styles.labelContainer}><span style={styles.label}>Obs location:</span></p>
      <input onChange={(e) => handleChange(e)} value={input} placeholder="Observer location" style={styles.inputField} />
    </div>
  )
}

export default ObserverLocation