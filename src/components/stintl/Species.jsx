import React from 'react'
import Button from '../Button'
import { useState } from 'react'

function Species({ setSpecies, data, styles }) {

  const handleChange = (e) => {
    setSpecies(e.currentTarget.value);
  }

  return (
    <div>
      <p style={styles.labelContainer}><span style={styles.label}>Species:</span></p>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
        <Button handleData={setSpecies} value="ARTE" selected={data === "ARTE"} />
        <div style={{margin: '0px 2.5px'}} />
        <Button handleData={setSpecies} value="COTE" selected={data === "COTE"} />
      </div>
      <input onChange={(e) => handleChange(e)} value={data} placeholder="Other" style={styles.inputField} />
    </div>
  )
}

export default Species