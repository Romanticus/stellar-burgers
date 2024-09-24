import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  constructorIngredientSlice,
  constructorReducer
} from '../services/slices/constructorIngredientSlice';
import { feedReducer, feedsSlice } from '../services/slices/feedSlice';
import {
  ingredientReducer,
  ingredientsSlice
} from '../services/slices/ingredientsSlice';
import { userReducer, userSlice } from '../services/slices/userSlice';
import store, { RootState } from '../services/store';

describe('ТЕСТ правильности Root reducer', () => {
  it('Проверка на правильную инициализацию rootReducer', () => {
    const rootReducer = combineSlices(
      constructorIngredientSlice,
      ingredientsSlice,
      feedsSlice,
      userSlice
    );
    const testStore = configureStore({
      reducer: rootReducer,
      devTools: process.env.NODE_ENV !== 'production'
    });

    expect(testStore.getState().constructorIngredient).toBeDefined();
    expect(testStore.getState().feed).toBeDefined();
    expect(testStore.getState().ingredient).toBeDefined();
    expect(testStore.getState().user).toBeDefined();
  });

  it('Должны соответствовать начальному состоянию корневого редуктора', () => {
    const initialState: RootState = store.getState();

    expect(initialState.constructorIngredient).toEqual(
      constructorReducer(undefined, { type: '@@INIT' })
    );

    expect(initialState.feed).toEqual(
      feedReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.ingredient).toEqual(
      ingredientReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.user).toEqual(
      userReducer(undefined, { type: '@@INIT' })
    );
  });
});
