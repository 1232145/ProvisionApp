import { normalizeFeeding, normalizeStint } from '../domain/models';

export const csvNeedsQuoting = (value) => {
  const stringValue = value == null ? '' : String(value);
  return /[",\n\r]/.test(stringValue) || /^\s|\s$/.test(stringValue);
};

export const csvEscape = (value) => {
  const stringValue = value == null ? '' : String(value);
  const escaped = stringValue.replace(/"/g, '""');
  return csvNeedsQuoting(escaped) ? `"${escaped}"` : escaped;
};

export const csvStringifyRows = (rows) => rows
  .map((row) => row.map(csvEscape).join(','))
  .join('\n');

export const csvParse = (text = '') => {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    if (inQuotes) {
      if (character === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += character;
      }
    } else if (character === '"') {
      inQuotes = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (character !== '\r') {
      field += character;
    }
  }

  row.push(field);
  if (row.length > 1 || row[0] !== '') rows.push(row);
  return rows;
};

export const STINT_CSV_HEADERS = [
  'StintID',
  'Stint_Type',
  'Island',
  'Species',
  'Prey_Size_Method',
  'Prey_Size_Reference',
  'First_Name',
  'Last_Name',
  'Observer_Location',
  'Date_Time_Start',
  'Date_Time_End',
  'Stint_Comment',
  'FeedingID',
  'Nest',
  'Time_Arrive',
  'Time_Depart',
  'Provider',
  'Recipient',
  'Prey_Item',
  'Prey_Size',
  'Number_of_Items',
  'Plot_Status',
  'Feeding_Comment',
  'Feeding_Species',
];

export const stintToCsv = (value) => {
  const stint = normalizeStint(value);
  const rows = [STINT_CSV_HEADERS];

  stint.feedingData.forEach((rawFeeding) => {
    const feeding = normalizeFeeding(rawFeeding, rawFeeding.FeedingID);
    const species = Array.isArray(stint.Species) ? stint.Species.join(' & ') : '';
    feeding.Number_of_Items.forEach((item) => {
      rows.push([
        stint.StintID,
        stint.Stint_Type,
        stint.Island,
        species,
        stint.Prey_Size_Method,
        stint.Prey_Size_Reference,
        stint.First_Name,
        stint.Last_Name,
        stint.Observer_Location,
        stint.Date_Time_Start,
        stint.Date_Time_End,
        stint.Comment,
        feeding.FeedingID,
        feeding.Nest,
        feeding.Time_Arrive,
        feeding.Time_Depart,
        feeding.Provider,
        item.Recipient,
        item.Prey_Item,
        item.Prey_Size,
        feeding.Number_of_Items.length,
        feeding.Plot_Status,
        feeding.Comment,
        feeding.Species,
      ]);
    });
  });

  return csvStringifyRows(rows);
};

const nonEmptyRows = (csv) => csvParse(csv)
  .filter((row) => row.some((value) => (value ?? '').trim() !== ''));

export const parseStintCsv = (csv) => {
  const rows = nonEmptyRows(csv);
  if (rows.length < 2) return { data: null, errors: ['The CSV does not contain any data rows.'] };

  const headers = rows[0].map((header) => String(header).trim());
  const requiredHeaders = STINT_CSV_HEADERS.filter((header) => header !== 'Feeding_Species');
  const hasSplitName = headers.includes('First_Name') && headers.includes('Last_Name');
  const hasLegacyName = headers.includes('Name');
  const missingHeaders = requiredHeaders.filter((header) => {
    if (header === 'First_Name' || header === 'Last_Name') return !(hasSplitName || hasLegacyName);
    return !headers.includes(header);
  });

  if (missingHeaders.length > 0) {
    return { data: null, errors: [`Missing CSV headers: ${missingHeaders.join(', ')}`] };
  }

  const headerIndex = headers.reduce((result, header, index) => ({ ...result, [header]: index }), {});
  const dataRows = rows.slice(1);
  const get = (values, key) => {
    const index = headerIndex[key];
    return index == null ? '' : (values[index] ?? '');
  };
  const feedingMap = new Map();
  const feedingOrder = [];

  dataRows.forEach((values) => {
    const feedingId = get(values, 'FeedingID');
    if (!feedingId) return;

    if (!feedingMap.has(feedingId)) {
      feedingMap.set(feedingId, {
        FeedingID: feedingId,
        Nest: get(values, 'Nest'),
        Time_Arrive: get(values, 'Time_Arrive'),
        Time_Depart: get(values, 'Time_Depart'),
        Provider: get(values, 'Provider'),
        Plot_Status: get(values, 'Plot_Status'),
        Comment: get(values, 'Feeding_Comment'),
        Species: get(values, 'Feeding_Species'),
        Number_of_Items: [],
      });
      feedingOrder.push(feedingId);
    }

    const item = {
      Recipient: get(values, 'Recipient'),
      Prey_Item: get(values, 'Prey_Item'),
      Prey_Size: get(values, 'Prey_Size'),
    };
    if (item.Recipient || item.Prey_Item || item.Prey_Size) {
      feedingMap.get(feedingId).Number_of_Items.push(item);
    }
  });

  const firstRow = dataRows[0] || [];
  const pick = (key) => get(firstRow, key);
  const legacyName = pick('Name').trim().split(/\s+/);
  const firstName = hasSplitName ? pick('First_Name') : (legacyName[0] || '');
  const lastName = hasSplitName ? pick('Last_Name') : legacyName.slice(1).join(' ');
  const rawSpecies = pick('Species');

  return {
    data: normalizeStint({
      StintID: pick('StintID'),
      Stint_Type: pick('Stint_Type'),
      Island: pick('Island'),
      Species: rawSpecies ? rawSpecies.split(' & ').map((species) => species.trim()).filter(Boolean) : [],
      Prey_Size_Method: pick('Prey_Size_Method'),
      Prey_Size_Reference: pick('Prey_Size_Reference'),
      First_Name: firstName,
      Last_Name: lastName,
      Observer_Location: pick('Observer_Location'),
      Date_Time_Start: pick('Date_Time_Start'),
      Date_Time_End: pick('Date_Time_End'),
      Comment: pick('Stint_Comment'),
      feedingData: feedingOrder.map((id, index) => normalizeFeeding(feedingMap.get(id), index + 1)),
    }),
    errors: [],
  };
};

export const parseConfigCsv = (csv) => {
  const rows = nonEmptyRows(csv);
  if (rows.length < 2) return { data: null, errors: ['The configuration CSV does not contain any data rows.'] };

  const requiredHeaders = ['Name', 'Island', 'ObserverLocation', 'Nest', 'Provider', 'Recipient', 'PreySize', 'PreyItem', 'Species'];
  const headers = rows[0].map((header) => String(header).trim());
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
  if (missingHeaders.length > 0) {
    return { data: null, errors: [`Missing configuration headers: ${missingHeaders.join(', ')}`] };
  }

  const data = {};
  headers.forEach((header, index) => {
    data[header] = rows.slice(1)
      .map((row) => (row[index] == null ? '' : String(row[index]).trim()))
      .filter(Boolean);
  });

  return { data, errors: [] };
};

