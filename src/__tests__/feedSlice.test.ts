import { configureStore } from '@reduxjs/toolkit';

import { TOrdersData } from '@utils-types';
import { getFeedsApi, TFeedsResponse } from '@api';
import {
  feedReducer,
  fetchFeed,
  selectOrdersData
} from '../services/slices/feedSlice';

jest.mock('@api');

describe('ТЕСТ работы feedSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feed: feedReducer
      }
    });
    jest.clearAllMocks();
  });

  it('должен обработать fetchFeed.fulfilled', async () => {
    const mockData: TOrdersData = {
      orders: [],
      total: 1,
      totalToday: 1
    };

    (getFeedsApi as jest.Mock).mockResolvedValue(mockData);

    await store.dispatch(fetchFeed());

    const state = store.getState().feed;
    expect(state.orders).toEqual(mockData.orders);
    expect(state.total).toBe(mockData.total);
    expect(state.totalToday).toBe(mockData.totalToday);
  });

  it('должен обрабатывать fetchFeed.rejected', async () => {
    (getFeedsApi as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    await store.dispatch(fetchFeed());

    const state = store.getState().feed;

    expect(state.orders).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
  });
  it('должен правильно возвращать данные через селектор selectOrdersData', async () => {
    const mockData: TOrdersData = {
      orders: [],
      total: 1,
      totalToday: 1
    };

    (getFeedsApi as jest.Mock).mockResolvedValue(mockData);
    await store.dispatch(fetchFeed());

    const selectedData = selectOrdersData(store.getState());

    expect(selectedData).toEqual(store.getState().feed);
  });
});
