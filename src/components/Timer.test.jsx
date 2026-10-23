import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Timer from './Timer';
import { FEEDING_TIME_FORMAT } from '../domain/models';

const styles = {
  labelContainer: {},
  label: {},
};

describe('Timer', () => {
  test('uses a 24-hour value for the feeding Now action', () => {
    let nextValue = '';
    render(
      <Timer
        setTime={(value) => { nextValue = value; }}
        data=""
        label="Time start"
        description="Time start"
        styles={styles}
        hasDatePicker={false}
        format={FEEDING_TIME_FORMAT}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Time start' }));

    expect(nextValue).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  test('shows the expected format for invalid manual input', () => {
    render(
      <Timer
        setTime={() => {}}
        data="11:30 PM"
        label="Time depart"
        description="Time depart"
        styles={styles}
        hasDatePicker={false}
        format={FEEDING_TIME_FORMAT}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('24-hour HH:mm:ss');
  });
});
