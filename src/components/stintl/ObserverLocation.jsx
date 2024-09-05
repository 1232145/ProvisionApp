import React from 'react'

function ObserverLocation({ setObs, data, styles }) {
  const handleChange = (e) => {
    setObs(e.currentTarget.value);
  }

  return (
    <div style={styles.inputContainer}>
      <p style={styles.labelContainer}><span style={styles.label}>Obs location:</span></p>
      <input onChange={(e) => handleChange(e)} value={data} placeholder="Observer location" style={styles.inputField} />
    </div>
  )
}

export default ObserverLocation