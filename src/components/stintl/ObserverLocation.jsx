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
      <p>Obs location:
        <input onChange={(e) => handleChange(e)} value={input} placeholder="Observer location" style={styles.inputField} />
      </p>
    </div>
  )
}

export default ObserverLocation