import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Input, Row, Col, notification } from 'antd';
import moment from 'moment';

function Timer({
    setTime, // Parent function to update the time
    data, // Value from parent to initialize
    label, // Label to display
    description, // Description for the button
    styles, // Styles for the component
    hasDatePicker = true, // Whether to show the DatePicker
    hasInput = true, // Whether to show the Input
    format = 'MM/DD/YYYY HH:mm', // Default date format
}) {
    const [selectedDate, setSelectedDate] = useState(data ? moment(data, format) : null);

    // Handle DatePicker changes
    const handleDateChange = (value) => {
        setSelectedDate(value); // Update local state when DatePicker changes
        const formattedDate = value ? value.format(format) : ''; // Format the date
        setTime(formattedDate); // Propagate the formatted date to the parent
    };

    // Handle time input change
    const handleTimeInputChange = (e) => {
        const input = e.target.value;
        setTime(input); // Propagate the input value to the parent
    };

    // Handle button click (sets current date and time)
    const handleButtonClick = () => {
        const time = moment().format(format);
        setTime(time); // Set the current time to the parent

        // If we need a warning pop-up for incorrect format:
        // notification.warning({
        //     message: 'Invalid Date Format',
        //     description: `Please enter the date in ${format} format.`,
        //     duration: 2,
        // });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
            <p style={styles.labelContainer}>
                <span style={styles.label}>{label}:</span> {data === null || data === undefined ? format : data}
            </p>
            <Row gutter={16} style={{ marginBottom: '10px' }}>
                {hasDatePicker && (
                    <Col span={hasInput ? 12 : 24}>
                        <DatePicker
                            value={selectedDate} // Bind the selected date to the DatePicker
                            onChange={handleDateChange} // Handle change from DatePicker
                            format={format} // Use the desired format
                            showTime // Display the time picker
                            style={{ width: '100%' }}
                            placeholder={`${format}`} // Add placeholder with format info
                        />
                    </Col>
                )}
                {hasInput && (
                    <Col span={hasDatePicker ? 12 : 24}>
                        <Input
                            value={data} // Bind to the parent data
                            onChange={handleTimeInputChange} // Update parent state
                            placeholder={`${format}`} // Add placeholder with format info
                            style={{ width: '100%' }}
                        />
                    </Col>
                )}
            </Row>
            <Button onClick={handleButtonClick} style={{ width: '100%' }}>
                {description}
            </Button>
        </div>
    );
}

export default Timer;
