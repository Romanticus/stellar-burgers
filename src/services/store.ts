import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { constructorIngredientSlice } from './slices/constructorIngredientSlice';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { feedsSlice } from './slices/feedSlice';
import { userSlice } from './slices/userSlice';
const rootReducer = combineSlices(
  constructorIngredientSlice,
  ingredientsSlice,
  feedsSlice,
  userSlice
); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
