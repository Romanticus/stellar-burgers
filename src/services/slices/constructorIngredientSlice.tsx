import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConstructorPageUI } from '@ui-pages';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import { act } from 'react-dom/test-utils';
import { getOrderByNumberApi, orderBurgerApi } from '../../utils/burger-api';

export type TconstructorState = {
  constructorItems: {
    bun?: {
      price: number;
      _id: string;
    };
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderByNumber?: TOrder | null;
};

const initialState: TconstructorState = {
  constructorItems: {
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const getOrderByNumber = createAsyncThunk(
  'constructorIngredient/getOrderByNumber',
  async (data: number) => await getOrderByNumberApi(data)
);

export const orderBurger = createAsyncThunk(
  'constructorIngredient/orderBurger',
  async (data: string[]) => await orderBurgerApi(data)
);

export const constructorIngredientSlice = createSlice({
  name: 'constructorIngredient',
  initialState,

  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare(ingredient: TIngredient) {
        return { payload: { ...ingredient, id: uuidv4() } };
      }
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients.splice(action.payload, 1);
    },
    setBun: (state: TconstructorState, action: PayloadAction<TIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    setOrderRequest: (
      state: TconstructorState,
      action: PayloadAction<boolean>
    ) => {
      state.orderRequest = action.payload;
    },
    setOrderModalData: (
      state: TconstructorState,
      action: PayloadAction<TOrder | null>
    ) => {
      state.orderModalData = action.payload;
    },
    moveDownIngredient: (
      state: TconstructorState,
      action: PayloadAction<number>
    ) => {
      const temp = state.constructorItems.ingredients[action.payload];
      state.constructorItems.ingredients[action.payload] =
        state.constructorItems.ingredients[action.payload + 1];
      state.constructorItems.ingredients[action.payload + 1] = temp;
    },
    moveUpIngredient: (
      state: TconstructorState,
      action: PayloadAction<number>
    ) => {
      const temp = state.constructorItems.ingredients[action.payload];
      state.constructorItems.ingredients[action.payload] =
        state.constructorItems.ingredients[action.payload - 1];
      state.constructorItems.ingredients[action.payload - 1] = temp;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorItems = {
          bun: undefined,
          ingredients: []
        };
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderByNumber = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumber = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, () => {
        console.log('err');
      });
  },
  selectors: {
    selectConstructorItems: (sliceState) => sliceState.constructorItems,
    selectOrderRequest: (sliceState) => sliceState.orderRequest,
    selectOrderModalData: (sliceState) => sliceState.orderModalData,
    selectOrderByNumber: (sliceState) => sliceState.orderByNumber
  }
});
export const constructorReducer = constructorIngredientSlice.reducer;
export const {
  addIngredient,
  removeIngredient,
  setBun,
  setOrderRequest,
  setOrderModalData,
  moveUpIngredient,
  moveDownIngredient
} = constructorIngredientSlice.actions;
export const {
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest,
  selectOrderByNumber
} = constructorIngredientSlice.selectors;
