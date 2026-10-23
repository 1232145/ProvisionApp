export const FEEDING_TIME_FORMAT = 'HH:mm:ss';
export const FEEDING_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

export const FIELD_LABELS = {
  StintID: 'Stint ID',
  Stint_Type: 'Stint type',
  Island: 'Island',
  Species: 'Species',
  Prey_Size_Method: 'Prey size method',
  Prey_Size_Reference: 'Prey size reference',
  First_Name: 'First name',
  Last_Name: 'Last name',
  Observer_Location: 'Observer location',
  Date_Time_Start: 'Start stint time',
  Date_Time_End: 'End stint time',
  Nest: 'Nest',
  Time_Arrive: 'Time start',
  Time_Depart: 'Time depart',
  Provider: 'Provider',
  Recipient: 'Recipient',
  Prey_Item: 'Prey item',
  Prey_Size: 'Prey size',
  Plot_Status: 'Plot',
};

export const createEmptyFeeding = (feedingId = 1) => ({
  FeedingID: feedingId,
  Nest: '',
  Time_Arrive: '',
  Time_Depart: '',
  Provider: '',
  Number_of_Items: [createEmptyFeedingItem()],
  Plot_Status: 'Outside Plot',
  Species: '',
  Comment: '',
});

export const createEmptyFeedingItem = () => ({
  Recipient: '',
  Prey_Item: '',
  Prey_Size: '',
});

export const createInitialStint = () => {
  const feeding = createEmptyFeeding(1);
  return {
    StintID: null,
    Stint_Type: 'Chick Provisioning',
    Island: '',
    Species: [],
    Prey_Size_Method: 'Numeric',
    Prey_Size_Reference: 'Culmen length',
    First_Name: '',
    Last_Name: '',
    Observer_Location: '',
    Date_Time_Start: '',
    Date_Time_End: '',
    Comment: '',
    feedingData: [feeding],
  };
};

export const normalizeFeeding = (value = {}, fallbackId = 1) => {
  const numberOfItems = Array.isArray(value.Number_of_Items) && value.Number_of_Items.length > 0
    ? value.Number_of_Items
    : [createEmptyFeedingItem()];

  return {
    ...createEmptyFeeding(fallbackId),
    ...value,
    FeedingID: value.FeedingID ?? fallbackId,
    Number_of_Items: numberOfItems.map((item) => ({
      ...createEmptyFeedingItem(),
      ...(item || {}),
    })),
  };
};

export const normalizeStint = (value = {}) => {
  const initial = createInitialStint();
  const feedingData = Array.isArray(value.feedingData) && value.feedingData.length > 0
    ? value.feedingData.map((feeding, index) => normalizeFeeding(feeding, index + 1))
    : initial.feedingData;

  return {
    ...initial,
    ...value,
    Species: Array.isArray(value.Species)
      ? value.Species
      : value.Species
        ? [value.Species]
        : [],
    feedingData,
  };
};

export const isValidFeedingTime = (value) => (
  typeof value === 'string' && FEEDING_TIME_PATTERN.test(value)
);

export const hasMeaningfulStintData = (value) => {
  if (!value || typeof value !== 'object') return false;

  const hasCoreFields = Boolean(
    value.Island ||
    value.First_Name ||
    value.Last_Name ||
    value.Observer_Location ||
    value.Date_Time_Start ||
    value.Date_Time_End ||
    value.Comment ||
    (Array.isArray(value.Species) && value.Species.length > 0)
  );

  const feedings = Array.isArray(value.feedingData) ? value.feedingData : [];
  const hasMeaningfulFeeding = feedings.some((feeding) => {
    if (!feeding || typeof feeding !== 'object') return false;

    const hasFeedingFields = Boolean(
      feeding.Nest ||
      feeding.Time_Arrive ||
      feeding.Time_Depart ||
      feeding.Provider ||
      feeding.Comment ||
      feeding.Species ||
      (feeding.Plot_Status && feeding.Plot_Status !== 'Outside Plot')
    );
    const items = Array.isArray(feeding.Number_of_Items) ? feeding.Number_of_Items : [];
    const hasItemFields = items.some((item) => (
      item && (item.Recipient || item.Prey_Item || item.Prey_Size)
    ));

    return hasFeedingFields || hasItemFields;
  });

  return hasCoreFields || hasMeaningfulFeeding;
};

const labelFor = (key) => FIELD_LABELS[key] || key.replaceAll('_', ' ');

export const getFieldLabel = (key) => labelFor(key);

export const getMissingFeedingFieldLabels = (feeding) => {
  const missing = [];
  const requiredFields = ['Nest', 'Time_Arrive', 'Time_Depart', 'Provider', 'Plot_Status'];

  requiredFields.forEach((key) => {
    if (feeding?.[key] === '' || feeding?.[key] == null) {
      missing.push(labelFor(key));
    }
  });

  if (feeding?.Time_Arrive && !isValidFeedingTime(feeding.Time_Arrive)) {
    missing.push('Time start · use 24-hour HH:mm:ss');
  }
  if (feeding?.Time_Depart && !isValidFeedingTime(feeding.Time_Depart)) {
    missing.push('Time depart · use 24-hour HH:mm:ss');
  }

  const items = Array.isArray(feeding?.Number_of_Items) ? feeding.Number_of_Items : [];
  items.forEach((item, itemIndex) => {
    ['Recipient', 'Prey_Item', 'Prey_Size'].forEach((key) => {
      if (item?.[key] === '' || item?.[key] == null) {
        missing.push(`Item ${itemIndex + 1} · ${labelFor(key)}`);
      }
    });
  });

  return missing;
};

export const getFirstIncompleteFeedingIndex = (feedings, completedFeedingIds) => {
  if (!Array.isArray(feedings)) return -1;

  const completedIds = Array.isArray(completedFeedingIds) ? completedFeedingIds : [];
  return feedings.findIndex((feeding, index) => {
    if (!feeding) return false;
    const feedingId = feeding.FeedingID ?? index;
    return !completedIds.includes(feedingId);
  });
};

export const getMissingFieldLabels = (stint) => {
  const missing = [];
  const requiredStintFields = [
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
  ];

  requiredStintFields.forEach((key) => {
    const value = stint?.[key];
    const empty = value === '' || value == null || (Array.isArray(value) && value.length === 0);
    if (empty) missing.push(`Stint: ${labelFor(key)}`);
  });

  const feedingData = Array.isArray(stint?.feedingData) ? stint.feedingData : [];
  feedingData.forEach((feeding, feedingIndex) => {
    ['Nest', 'Time_Arrive', 'Time_Depart', 'Provider', 'Plot_Status'].forEach((key) => {
      if (feeding?.[key] === '' || feeding?.[key] == null) {
        missing.push(`Feeding ${feedingIndex + 1}: ${labelFor(key)}`);
      }
    });

    if (feeding?.Time_Arrive && !isValidFeedingTime(feeding.Time_Arrive)) {
      missing.push(`Feeding ${feedingIndex + 1}: Time start must use HH:mm:ss`);
    }
    if (feeding?.Time_Depart && !isValidFeedingTime(feeding.Time_Depart)) {
      missing.push(`Feeding ${feedingIndex + 1}: Time depart must use HH:mm:ss`);
    }

    const items = Array.isArray(feeding?.Number_of_Items) ? feeding.Number_of_Items : [];
    items.forEach((item, itemIndex) => {
      ['Recipient', 'Prey_Item', 'Prey_Size'].forEach((key) => {
        if (item?.[key] === '' || item?.[key] == null) {
          missing.push(`Feeding ${feedingIndex + 1}, item ${itemIndex + 1}: ${labelFor(key)}`);
        }
      });
    });
  });

  return missing;
};

