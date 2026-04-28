import React from 'react';
import { Button, Input, Row, Col, DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import moment from 'moment';

dayjs.extend(customParseFormat);

const DATE_DISPLAY = 'MM/DD/YYYY';

function Timer({
    setTime,
    data,
    label,
    description,
    styles,
    hasDatePicker = false, // split mode: date picker + HH:mm input
    hasInput = true,        // plain text input (used when hasDatePicker=false)
    hasButton = true,
    format = 'MM/DD/YYYY HH:mm',
    minDate = null,         // moment object — clamps the Now button & disables past dates
}) {
    // Derive date and time parts directly from the data prop (no local state needed —
    // the parent owns the value, so the picker always reflects the latest external change).
    const datePart = (hasDatePicker && data) ? (data.split(' ')[0] || '') : '';
    const timePart = (hasDatePicker && data) ? (data.split(' ')[1] || '') : '';

    // Parse the date part with Day.js strict mode so a missing/partial date → null
    const datePickerValue = (() => {
        if (!datePart) return null;
        const d = dayjs(datePart, DATE_DISPLAY, true);
        return d.isValid() ? d : null;
    })();

    const handleDatePickerChange = (dayjsVal) => {
        const date = dayjsVal ? dayjsVal.format(DATE_DISPLAY) : '';
        // Keep whatever the user has already typed in the time field (default 00:00)
        const time = timePart || '00:00';
        setTime(date ? `${date} ${time}` : '');
    };

    const handleTimePartChange = (e) => {
        const time = e.target.value;
        // Only set the combined value if a date has been chosen
        setTime(datePart ? `${datePart} ${time}` : time);
    };

    const handleFullInputChange = (e) => {
        setTime(e.target.value);
    };

    const handleButtonClick = () => {
        const now = moment();
        const clamped = minDate && now.isBefore(minDate) ? minDate.clone() : now;
        setTime(clamped.format(format));
    };

    // Convert moment minDate → dayjs for the picker's disabledDate (no mutation issues)
    const minDayjs = minDate ? dayjs(minDate.format('YYYY-MM-DD')) : null;
    const disabledDate = minDayjs
        ? (current) => current && current.isBefore(minDayjs, 'day')
        : undefined;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
            <p style={styles.labelContainer}>
                <span style={styles.label}>{label}:</span>{' '}
                {data || <span style={{ color: '#aaa', fontStyle: 'italic' }}>{format}</span>}
            </p>

            {hasDatePicker ? (
                <Row gutter={8} style={{ marginBottom: '10px' }}>
                    <Col span={15}>
                        {/* inputReadOnly prevents typing in the picker's own field,
                            which was causing garbage dates. Users click to pick the date. */}
                        <DatePicker
                            value={datePickerValue}
                            onChange={handleDatePickerChange}
                            format={DATE_DISPLAY}
                            style={{ width: '100%' }}
                            placeholder="MM/DD/YYYY"
                            disabledDate={disabledDate}
                            inputReadOnly
                        />
                    </Col>
                    <Col span={9}>
                        <Input
                            value={timePart}
                            onChange={handleTimePartChange}
                            placeholder="HH:mm"
                            maxLength={5}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
            ) : (
                hasInput && (
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={24}>
                            <Input
                                value={data}
                                onChange={handleFullInputChange}
                                placeholder={format}
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </Row>
                )
            )}

            {hasButton && (
                <Button onClick={handleButtonClick} style={{ width: '100%' }}>
                    {description}
                </Button>
            )}
        </div>
    );
}

export default Timer;
