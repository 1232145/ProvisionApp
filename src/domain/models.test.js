import {
  createEmptyFeeding,
  createInitialStint,
  getFirstIncompleteFeedingIndex,
  getFilledFeedingFieldLabels,
  getMissingFieldLabels,
  getMissingFeedingFieldLabels,
  getNextFeedingId,
  hasMeaningfulFeedingData,
  isValidStintClockTime,
  isValidStintDateTime,
  isValidFeedingTime,
  normalizeFeeding,
} from './models';

describe('domain models', () => {
  test('creates independent feeding item objects', () => {
    const first = createEmptyFeeding(1);
    const second = createEmptyFeeding(2);

    first.Number_of_Items[0].Recipient = 'A';

    expect(second.Number_of_Items[0].Recipient).toBe('');
    expect(first.FeedingID).toBe(1);
    expect(second.FeedingID).toBe(2);
  });

  test('normalizes missing feeding items without sharing nested state', () => {
    const source = { FeedingID: 3, Number_of_Items: [{ Recipient: 'A' }] };
    const normalized = normalizeFeeding(source, 3);

    normalized.Number_of_Items[0].Recipient = 'B';

    expect(source.Number_of_Items[0].Recipient).toBe('A');
    expect(normalized.Number_of_Items[0]).toEqual({
      Recipient: 'B',
      Prey_Item: '',
      Prey_Size: '',
    });
  });

  test('accepts only 24-hour feeding times', () => {
    expect(isValidFeedingTime('00:00:00')).toBe(true);
    expect(isValidFeedingTime('23:59:59')).toBe(true);
    expect(isValidFeedingTime('24:00:00')).toBe(false);
    expect(isValidFeedingTime('11:30:00 PM')).toBe(false);
    expect(isValidFeedingTime('11:30')).toBe(false);
  });

  test('validates stint date and time values strictly', () => {
    expect(isValidStintClockTime('00:00')).toBe(true);
    expect(isValidStintClockTime('24:00')).toBe(false);
    expect(isValidStintDateTime('02/28/2026 23:59')).toBe(true);
    expect(isValidStintDateTime('02/29/2026 23:59')).toBe(false);
    expect(isValidStintDateTime('2/28/2026 23:59')).toBe(false);
  });

  test('does not treat a new default feeding as meaningful', () => {
    const emptyFeeding = createEmptyFeeding(1);

    expect(hasMeaningfulFeedingData(emptyFeeding)).toBe(false);
    expect(getFilledFeedingFieldLabels(emptyFeeding)).toEqual([]);
    expect(getNextFeedingId([{ FeedingID: 1 }, { FeedingID: 3 }])).toBe(4);
  });

  test('reports friendly required field labels', () => {
    const missing = getMissingFieldLabels(createInitialStint());

    expect(missing).toContain('Stint: Island');
    expect(missing).toContain('Stint: First name');
    expect(missing).toContain('Feeding 1: Time start');
    expect(missing).not.toContain('Stint: First_Name');
  });

  test('reports invalid stint dates and chronology', () => {
    const base = {
      ...createInitialStint(),
      StintID: 'stint-1',
      Island: 'Gettysburg',
      Species: ['ARTE'],
      First_Name: 'Huy',
      Last_Name: 'Ngo',
      Observer_Location: 'Plot 1',
      Date_Time_Start: '02/30/2026 10:00',
      Date_Time_End: '02/30/2026 09:00',
    };

    expect(getMissingFieldLabels(base)).toEqual(expect.arrayContaining([
      'Stint: Start stint time must use MM/DD/YYYY HH:mm',
      'Stint: End stint time must use MM/DD/YYYY HH:mm',
    ]));

    const validButReversed = {
      ...base,
      Date_Time_Start: '02/28/2026 10:00',
      Date_Time_End: '02/28/2026 09:00',
    };
    expect(getMissingFieldLabels(validButReversed)).toContain(
      'Stint: End stint time cannot be before start stint time'
    );
  });

  test('reports friendly feeding validation labels', () => {
    const missing = getMissingFeedingFieldLabels(createEmptyFeeding(1));

    expect(missing).toEqual(expect.arrayContaining([
      'Nest',
      'Time start',
      'Time depart',
      'Provider',
      'Item 1 · Recipient',
      'Item 1 · Prey item',
      'Item 1 · Prey size',
    ]));
    expect(missing).not.toContain('Time_Arrive');
  });

  test('finds the first incomplete feeding after completed rows are hidden', () => {
    const feedings = [1, 2, 3, 4].map((FeedingID) => ({ FeedingID }));

    expect(getFirstIncompleteFeedingIndex(feedings, [1, 2])).toBe(2);
    expect(getFirstIncompleteFeedingIndex(feedings, [1, 3])).toBe(1);
    expect(getFirstIncompleteFeedingIndex(feedings, [1, 2, 3, 4])).toBe(-1);
  });
});

