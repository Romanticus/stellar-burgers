import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredients = {
  isLoading: boolean;
  error: null | SerializedError;
  data: TIngredient[];
};

const initialState: TIngredients = {
  isLoading: true,
  error: null,
  data: []
};

export const fetchIngredients = createAsyncThunk(`ingredient/fetch`, async () =>
  getIngredientsApi()
);
export const ingredientsSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.data = action.payload; // Сохраняем загруженные треки
          state.isLoading = false; // Сбрасываем состояние загрузки
        }
      )
      .addCase(fetchIngredients.rejected, (state) => {
        state.isLoading = false; // Сбрасываем состояние загрузки при ошибке
      });
  },
  selectors: {
    selectIngredients: (sliceState) => sliceState.data,
    selectIsLoading: (sliceState) => sliceState.isLoading
  }
});
export const ingredientReducer = ingredientsSlice.reducer;
export const { selectIngredients, selectIsLoading } =
  ingredientsSlice.selectors;
