import { feedingReducer } from '../domain/feedingReducer';

describe('feeding reducer', () => {
  test('updates one item immutably', () => {
    const item = { Recipient: '', Prey_Item: '', Prey_Size: '' };
    const state = {
      feeding: { Number_of_Items: [item], Plot_Status: 'Outside Plot' },
      feedingTemp: null,
      index: 0,
      nIndex: 0,
    };

    const next = feedingReducer(state, {
      type: 'SET_ITEM_FIELD',
      payload: { index: 0, field: 'Recipient', value: 'A' },
    });

    expect(state.feeding.Number_of_Items[0].Recipient).toBe('');
    expect(next.feeding.Number_of_Items[0].Recipient).toBe('A');
    expect(next.feeding.Number_of_Items).not.toBe(state.feeding.Number_of_Items);
  });
});
