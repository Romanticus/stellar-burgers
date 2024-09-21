import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TOrder, TOrdersData } from '@utils-types';

const initialState: TOrdersData = {
  orders: [],
  total: 0,
  totalToday: 0
};

export const fetchFeed = createAsyncThunk(`feed/fetch`, async () =>
  getFeedsApi()
);

export const feedsSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(
        fetchFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeed.rejected, () => {
        console.log('err');
      });
  },
  selectors: {
    selectOrdersData: (sliceState) => sliceState
  }
});
export const feedReducer = feedsSlice.reducer;
export const { selectOrdersData } = feedsSlice.selectors;
