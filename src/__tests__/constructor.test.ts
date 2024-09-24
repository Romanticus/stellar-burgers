import { TIngredient, TOrder } from '@utils-types';
import {
  addIngredient,
  constructorReducer,
  moveDownIngredient,
  moveUpIngredient,
  removeIngredient,
  setBun,
  TconstructorState,
  orderBurger,
  getOrderByNumber
} from '../services/slices/constructorIngredientSlice';
import { configureStore } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '../utils/burger-api';

jest.mock('@api');

beforeEach(() => {
  constructorReducer(undefined, { type: '@@INIT' });
});

describe('ТЕСТ работы конструктора', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        constructorIngredient: constructorReducer
      }
    });
    jest.clearAllMocks();
  });

  it('корректно добавлять булочку в state', () => {
    const initialState: TconstructorState = {
      constructorItems: {
        ingredients: []
      },
      orderRequest: false,
      orderModalData: null
    };
    const ingredient: TIngredient = {
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
    };

    const action = setBun(ingredient);
    const state = constructorReducer(initialState, action);

    expect(state.constructorItems.bun).toEqual(ingredient);
  });

  it('корректно добавлять НЕбулочку в state', () => {
    const initialState: TconstructorState = {
      constructorItems: {
        ingredients: []
      },
      orderRequest: false,
      orderModalData: null
    };
    const ingredient: TIngredient = {
      calories: 30,
      carbohydrates: 40,
      fat: 20,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      name: 'Соус Spicy-X',
      price: 90,
      proteins: 30,
      type: 'sauce',
      _id: '643d69a5c3f7b9001cfa0942'
    };

    const action = addIngredient(ingredient);
    const state = constructorReducer(initialState, action);

    expect(state.constructorItems.ingredients[0]).toEqual(
      expect.objectContaining(ingredient)
    );
  });

  it('корректно удалять ингредиент из state', () => {
    const initialState: TconstructorState = {
      constructorItems: {
        ingredients: [
          {
            calories: 30,
            carbohydrates: 40,
            fat: 20,
            image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
            image_large:
              'https://code.s3.yandex.net/react/code/sauce-02-large.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
            name: 'Соус Spicy-X',
            price: 90,
            proteins: 30,
            type: 'sauce',
            _id: '643d69a5c3f7b9001cfa0942',
            id: '1'
          }
        ]
      },
      orderRequest: false,
      orderModalData: null
    };

    const action = removeIngredient(0);
    const state = constructorReducer(initialState, action);

    expect(state.constructorItems.ingredients.length).toBe(0);
  });

  describe('тестирование на изменения порядка ингредиентов в конструкторе', () => {
    const initialState: TconstructorState = {
      constructorItems: {
        ingredients: [
          {
            calories: 30,
            carbohydrates: 40,
            fat: 20,
            image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
            image_large:
              'https://code.s3.yandex.net/react/code/sauce-02-large.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
            name: 'Соус Spicy-X',
            price: 90,
            proteins: 30,
            type: 'sauce',
            _id: '1',
            id: '1'
          },
          {
            _id: '2',
            name: 'Томат',
            type: 'main',
            proteins: 20,
            fat: 20,
            carbohydrates: 20,
            calories: 20,
            price: 200,
            image: 'https://code.s3.yandex.net/react/code/meat-01.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/meat-01-large.png',
            id: '2'
          }
        ]
      },
      orderRequest: false,
      orderModalData: null
    };

    it('должен перемещать ингредиент выше другого ингредиента', () => {
      const action = moveUpIngredient(1);
      const state = constructorReducer(initialState, action);

      expect(state.constructorItems.ingredients[0].id).toBe('2');
      expect(state.constructorItems.ingredients[1].id).toBe('1');
    });

    it('должен перемещать ингредиент ниже другого ингредиента', () => {
      const action = moveDownIngredient(0);
      const state = constructorReducer(initialState, action);

      expect(state.constructorItems.ingredients[0]._id).toBe('2');
      expect(state.constructorItems.ingredients[1]._id).toBe('1');
    });
  });

  describe('Тесты для асинхронных действий', () => {
    it('должен обрабатывать orderBurger.pending', () => {
      store.dispatch(orderBurger.pending('', ['']));
      const state = store.getState().constructorIngredient;
      expect(state.orderRequest).toBe(true);
    });

    it('должен обрабатывать orderBurger.fulfilled', async () => {
      const mockOrder: TOrder = {
        _id: '1234567890abcdef',
        status: 'done',
        name: 'Delicious Burger',
        createdAt: '2024-09-21T12:34:56.789Z',
        updatedAt: '2024-09-21T12:34:56.789Z',
        number: 42,
        ingredients: ['ingredientId1', 'ingredientId2', 'ingredientId3']
      };
      (orderBurgerApi as jest.Mock).mockResolvedValue({ order: mockOrder });

      await store.dispatch(orderBurger(['mocked-ingredients']));

      const state = store.getState().constructorIngredient;
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.constructorItems).toEqual({
        bun: undefined,
        ingredients: []
      });
    });

    it('должен обрабатывать orderBurger.rejected', async () => {
      (orderBurgerApi as jest.Mock).mockRejectedValue(new Error('Ошибка'));

      await store.dispatch(orderBurger(['mocked-ingredients']));

      const state = store.getState().constructorIngredient;
      expect(state.orderRequest).toBe(false);
    });

    it('должен обрабатывать getOrderByNumber.pending', () => {
      store.dispatch(getOrderByNumber.pending('', 0));
      const state = store.getState().constructorIngredient;
      expect(state.orderByNumber).toBe(null);
    });

    it('должен обрабатывать getOrderByNumber.fulfilled', async () => {
      const mockOrderData = {
        orders: [
          {
            _id: '1234567890abcdef',
            status: 'done',
            name: 'Delicious Burger',
            createdAt: '2024-09-21T12:34:56.789Z',
            updatedAt: '2024-09-21T12:34:56.789Z',
            number: 42,
            ingredients: ['ingredientId1', 'ingredientId2', 'ingredientId3']
          }
        ]
      };
      (getOrderByNumberApi as jest.Mock).mockResolvedValue(mockOrderData);

      await store.dispatch(getOrderByNumber(123));

      const state = store.getState().constructorIngredient;
      expect(state.orderByNumber).toEqual(mockOrderData.orders[0]);
    });

    it('должен обрабатывать getOrderByNumber.rejected', async () => {
      (getOrderByNumberApi as jest.Mock).mockRejectedValue(new Error('Ошибка'));

      await store.dispatch(getOrderByNumber(123));

      const state = store.getState().constructorIngredient;
    });
  });
});
