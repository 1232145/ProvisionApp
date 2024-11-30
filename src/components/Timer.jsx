import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Input, Row, Col, notification } from 'antd';
import moment from 'moment';

function Timer({ setTime, data, label, description, styles }) {
    const [selectedDate, setSelectedDate] = useState(null); // State to store selected date
    const [timeInput, setTimeInput] = useState(''); // State to store manual time input

    // Update state if 'data' prop changes (two-way binding for DatePicker)
    useEffect(() => {
        if (data) {
            setSelectedDate(moment(data, 'MM/DD/YYYY HH:mm', true)); // Convert incoming date to moment object
            setTimeInput(moment(data, 'MM/DD/YYYY HH:mm', true).format('MM/DD/YYYY HH:mm')); // Sync the input field with the prop
        }
    }, [data]); // Re-run when data prop changes

    // Handle the date change and format it
    const handleDateChange = (value) => {
        setSelectedDate(value); // Update the state with the selected date
        const formattedDate = value ? value.format('MM/DD/YYYY HH:mm') : ''; // Format the date
        setTime(formattedDate); // Pass the formatted date to the parent
        setTimeInput(formattedDate); // Sync the input field with DatePicker
    };

    // Handle the time input change
    const handleTimeInputChange = (e) => {
        const input = e.target.value;
        setTimeInput(input); // Update the state with the input time value
    };

    // Formatting the date and time in MM/DD/YYYY HH:mm format
    const formatDateTime = (date) => {
        return date ? moment(date).format('MM/DD/YYYY HH:mm') : '';
    };

    // Handling button click
    const handleButtonClick = () => {
        if (timeInput && moment(timeInput, 'MM/DD/YYYY HH:mm', true).isValid()) {
            // If input is valid, set it as the time
            setTime(timeInput);
        } else if (timeInput === '') {
            // If input is empty, set the current time as default
            setTime(moment().format('MM/DD/YYYY HH:mm')); // Set current time
        } else {
            // Show a warning if the time input is invalid
            notification.warning({
                message: 'Invalid Date Format',
                description: 'Please enter the date in MM/DD/YYYY HH:mm format.',
                duration: 2,
            });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
            <p style={styles.labelContainer}>
                <span style={styles.label}>{label}:</span> {formatDateTime(data)}
            </p>

            <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        format="MM/DD/YYYY HH:mm" // Use the desired format
                        showTime // Display time picker
                        style={{ width: '100%' }}
                    />
                </Col>

                <Col span={12}>
                    <Input
                        value={timeInput}
                        onChange={handleTimeInputChange}
                        placeholder="Enter time"
                        style={{ width: '100%' }}
                    />
                </Col>
            </Row>

            <Button onClick={handleButtonClick} style={{ width: '100%' }}>
                {description}
            </Button>
        </div>
    );
}

export default Timer;
