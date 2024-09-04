import React from 'react';
import Button from './Button';

function Timer({ setTime, data, label, description, styles }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '10px',
        }}>
            <p style={styles.labelContainer}><span style={styles.label}>{label}:</span>{data}</p>
            <Button handleData={setTime} value={description} />
        </div>
    );
}

export default Timer;
