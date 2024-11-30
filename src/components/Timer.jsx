import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Input, Row, Col, notification } from 'antd';
import moment from 'moment';

function Timer({ setTime, data, label, description, styles, hasDatePicker = true, hasInput = true, format = 'MM/DD/YYYY HH:mm' }) {
    const [selectedDate, setSelectedDate] = useState(null); // State to store selected date

    // Update state if 'data' prop changes (two-way binding for DatePicker)
    useEffect(() => {
        if (data) {
            setSelectedDate(moment(data, format, true)); // Convert incoming date to moment object
        }
    }, [data]); // Re-run when data prop changes

    // Handle the date change and format it
    const handleDateChange = (value) => {
        setSelectedDate(value); // Update the state with the selected date
        const formattedDate = value ? value.format(format) : ''; // Format the date
        setTime(formattedDate); // Pass the formatted date to the parent
    };

    // Handle the time input change
    const handleTimeInputChange = (e) => {
        const input = e.target.value;
        setTime(input);
    };

    // Handling button click
    const handleButtonClick = () => {
        const time = moment().format(format);
        setTime(time);

        // If we nede a warning pop up for incorrect format:
        // notification.warning({
        //     message: 'Invalid Date Format',
        //     description: `Please enter the date in ${format} format.`,
        //     duration: 2,
        // });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
            <p style={styles.labelContainer}>
                <span style={styles.label}>{label}:</span> {data}
            </p>
            <Row gutter={16} style={{ marginBottom: '10px' }}>
                {
                    hasDatePicker &&
                    <Col span={12}>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            format="MM/DD/YYYY HH:mm" // Use the desired format
                            showTime // Display time picker
                            style={{ width: '100%' }}
                        />
                    </Col>
                }
                {
                    hasInput &&
                    <Col span={12}>
                        <Input
                            value={data}
                            onChange={handleTimeInputChange}
                            placeholder="Enter time"
                            style={{ width: '100%' }}
                        />
                    </Col>
                }
            </Row>
            <Button onClick={handleButtonClick} style={{ width: '100%' }}>
                {description}
            </Button>
        </div>
    );
}

export default Timer;
