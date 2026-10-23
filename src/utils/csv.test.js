import { createInitialStint } from '../domain/models';
import { csvParse, csvStringifyRows, parseConfigCsv, parseStintCsv, stintToCsv } from './csv';

describe('CSV utilities', () => {
  test('round-trips quoted values', () => {
    const csv = csvStringifyRows([['plain', 'comma, value', 'quote " value', 'line\nvalue']]);

    expect(csvParse(csv)).toEqual([['plain', 'comma, value', 'quote " value', 'line\nvalue']]);
  });

  test('round-trips a stint and preserves 24-hour feeding times', () => {
    const stint = createInitialStint();
    const value = {
      ...stint,
      StintID: 'Gettysburg-ARTE-10/22/2026-23:38-Huy-Ngo',
      Island: 'Gettysburg',
      Species: ['ARTE'],
      First_Name: 'Huy',
      Last_Name: 'Ngo',
      Observer_Location: 'Plot 1',
      Date_Time_Start: '10/22/2026 23:38',
      Date_Time_End: '10/22/2026 23:48',
      feedingData: [{
        ...stint.feedingData[0],
        Nest: 'P1',
        Time_Arrive: '23:39:09',
        Time_Depart: '23:40:09',
        Provider: 'BA',
        Number_of_Items: [{ Recipient: 'A', Prey_Item: 'U', Prey_Size: '1' }],
      }],
    };

    const result = parseStintCsv(stintToCsv(value));

    expect(result.errors).toEqual([]);
    expect(result.data.Date_Time_Start).toBe('10/22/2026 23:38');
    expect(result.data.feedingData[0].Time_Arrive).toBe('23:39:09');
    expect(result.data.feedingData[0].Time_Depart).toBe('23:40:09');
  });

  test('returns actionable errors for malformed configuration CSV', () => {
    const result = parseConfigCsv('Name,Island\nHuy,Gettysburg');

    expect(result.data).toBeNull();
    expect(result.errors[0]).toContain('Missing configuration headers');
  });
});

