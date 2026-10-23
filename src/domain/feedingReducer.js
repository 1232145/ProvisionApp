export const feedingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PLOT':
      return { ...state, feeding: { ...state.feeding, Plot_Status: action.payload } };
    case 'SET_FEEDING_SPECIES':
      return { ...state, feeding: { ...state.feeding, Species: action.payload } };
    case 'SET_NEST':
      return { ...state, feeding: { ...state.feeding, Nest: action.payload } };
    case 'SET_PROVIDER':
      return { ...state, feeding: { ...state.feeding, Provider: action.payload } };
    case 'SET_NUMBER_ITEMS':
      return { ...state, feeding: { ...state.feeding, Number_of_Items: action.payload } };
    case 'SET_ITEM_FIELD':
      return {
        ...state,
        feeding: {
          ...state.feeding,
          Number_of_Items: state.feeding.Number_of_Items.map((item, itemIndex) => (
            itemIndex === action.payload.index
              ? { ...item, [action.payload.field]: action.payload.value }
              : item
          )),
        },
      };
    case 'SET_TIME_ARRIVE':
      return { ...state, feeding: { ...state.feeding, Time_Arrive: action.payload, Time_Depart: '' } };
    case 'SET_TIME_DEPART':
      return { ...state, feeding: { ...state.feeding, Time_Depart: action.payload } };
    case 'SET_COMMENT':
      return { ...state, feeding: { ...state.feeding, Comment: action.payload } };
    case 'SET_INDEX':
      return { ...state, index: action.payload };
    case 'SET_NINDEX':
      return { ...state, nIndex: action.payload };
    case 'SET_FEEDING_TEMP':
      return { ...state, feedingTemp: action.payload };
    case 'BATCH_UPDATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

