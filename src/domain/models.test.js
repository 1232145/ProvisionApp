import {
  createEmptyFeeding,
  createInitialStint,
  getMissingFieldLabels,
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

  test('reports friendly required field labels', () => {
    const missing = getMissingFieldLabels(createInitialStint());

    expect(missing).toContain('Stint: Island');
    expect(missing).toContain('Stint: First name');
    expect(missing).toContain('Feeding 1: Time start');
    expect(missing).not.toContain('Stint: First_Name');
  });
});

