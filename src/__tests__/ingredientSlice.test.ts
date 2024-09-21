import { configureStore } from '@reduxjs/toolkit';
import {
  ingredientReducer,
  fetchIngredients,
  selectIngredients,
  selectIsLoading
} from '../services/slices/ingredientsSlice'; // Adjust the import path
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

jest.mock('@api');

describe('ingredientsSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingredient: ingredientReducer
      }
    });
    jest.clearAllMocks();
  });

  it('должен иметь начальное состояние', () => {
    const state = store.getState().ingredient;
    expect(state).toEqual({
      isLoading: true,
      error: null,
      data: []
    });
  });

  it('должен обрабатывать fetchIngredients.pending', () => {
    store.dispatch(fetchIngredients.pending(''));
    const state = store.getState().ingredient;
    expect(state.isLoading).toBe(true);
  });

  it('должен обрабатывать fetchIngredients.fulfilled', async () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 10,
        carbohydrates: 10,
        calories: 10,
        price: 100,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      },
      {
        _id: '2',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
      }
    ];

    (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);

    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredient;
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockIngredients);
  });

  it('должен обрабатывать fetchIngredients.rejected', async () => {
    (getIngredientsApi as jest.Mock).mockRejectedValue(new Error('Ошибка'));

    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredient;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('должен возвращать данные через селектор selectIngredients', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 10,
        carbohydrates: 10,
        calories: 10,
        price: 100,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      }
    ];

    store.dispatch(fetchIngredients.fulfilled(mockIngredients, ''));

    const selectedData = selectIngredients(store.getState());

    expect(selectedData).toEqual(mockIngredients);
  });

  it('должен возвращать состояние загрузки через селектор selectIsLoading', () => {
    store.dispatch(fetchIngredients.pending(''));

    const loadingState = selectIsLoading(store.getState());

    expect(loadingState).toBe(true);

    store.dispatch(fetchIngredients.fulfilled([], ''));

    const loadingStateAfterFulfilled = selectIsLoading(store.getState());

    expect(loadingStateAfterFulfilled).toBe(false);
  });
});
