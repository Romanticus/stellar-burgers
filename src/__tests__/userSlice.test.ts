import { configureStore } from '@reduxjs/toolkit';
import {
  userReducer,
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  updateUser,
  getUserOrders,
  setUser,
  clearUser,
  selectUser,
  selectIsAuthChecked,
  setIsAuthChecked
} from '../services/slices/userSlice';
import {
  getUserApi,
  registerUserApi,
  loginUserApi,
  logoutApi,
  updateUserApi,
  getOrdersApi
} from '@api';
import { setCookie, deleteCookie } from '../utils/cookie';
import { TUser, TOrder } from '../utils/types';

jest.mock('@api');

jest.mock('../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));
describe('userSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer
      }
    });
    jest.clearAllMocks();
  });

  it('должен обрабатывать registerUser.pending', () => {
    store.dispatch(
      registerUser.pending('', { email: '', name: '', password: '' })
    );
    const state = store.getState().user;
    expect(state.success).toBe(false);
  });

  it('должен обрабатывать registerUser.fulfilled', async () => {
    const mockResponse = { success: true, user: { _id: '1', name: '123' } };
    (registerUserApi as jest.Mock).mockResolvedValue(mockResponse);

    await store.dispatch(
      registerUser({ name: '123', email: 'roman@mail', password: '123567899' })
    );

    const state = store.getState().user;
    expect(state.success).toBe(true);
    expect(state.user).toEqual(mockResponse.user);
    expect(state.error).toBe('');
  });

  it('должен обрабатывать registerUser.rejected', async () => {
    (registerUserApi as jest.Mock).mockRejectedValue(
      new Error('Ошибка регистрации')
    );

    await store.dispatch(
      registerUser({
        name: '123',
        email: '123@mail',
        password: 'password123'
      })
    );

    const state = store.getState().user;
    expect(state.success).toBe(false);
    expect(state.error).toBe('Ошибка регистрации');
  });

  it('должен обрабатывать loginUser.pending', () => {
    store.dispatch(loginUser.pending('', { email: '', password: '' }));
    const state = store.getState().user;
    expect(state.success).toBe(false);
    expect(state.error).toBe('');
  });

  it('должен обрабатывать loginUser.fulfilled', async () => {
    const mockResponse = {
      success: true,
      accessToken: 'token123',
      refreshToken: 'refreshToken123',
      user: { _id: '1', name: '123' }
    };
    (loginUserApi as jest.Mock).mockResolvedValue(mockResponse);

    await store.dispatch(
      loginUser({ email: '123@mail', password: 'password123' })
    );

    const state = store.getState().user;
    expect(state.user).toEqual(mockResponse.user);
    expect(state.success).toBe(true);
    expect(state.error).toBe('');

    expect(setCookie).toHaveBeenCalledWith(
      'accessToken',
      mockResponse.accessToken
    );
  });

  it('должен обрабатывать loginUser.rejected', async () => {
    (loginUserApi as jest.Mock).mockRejectedValue(
      new Error('Ошибка авторизации')
    );

    await store.dispatch(
      loginUser({ email: '123@mail', password: 'password123' })
    );

    const state = store.getState().user;
    expect(state.success).toBe(false);
    expect(state.error).toBe('Ошибка авторизации');
  });

  it('должен обрабатывать getUser.pending', () => {
    store.dispatch(getUser.pending(''));

    const state = store.getState().user;

    expect(state.success).toBe(false);
  });

  it('должен обрабатывать getUser.fulfilled', async () => {
    const mockResponse = { user: { _id: '1', name: '123' } };

    (getUserApi as jest.Mock).mockResolvedValue(mockResponse);

    await store.dispatch(getUser());

    const state = store.getState().user;
    expect(state.error).toEqual('');
  });

  it('должен обрабатывать logoutUser.fulfilled', async () => {
    (logoutApi as jest.Mock).mockResolvedValue({});

    await store.dispatch(logoutUser());

    const state = store.getState().user;

    expect(deleteCookie).toHaveBeenCalledWith('accessToken');

    expect(localStorage.getItem('refreshToken')).toBe(null);

    expect(state.user).toBe(null);
  });

  it('должен обрабатывать updateUser.fulfilled', async () => {
    const mockResponse = {
      success: true,
      user: { _id: '1', name: 'roman' }
    };
    (updateUserApi as jest.Mock).mockResolvedValue(mockResponse);

    await store.dispatch(
      updateUser({ name: 'roman', email: '123@maiill', password: '' })
    );

    const state = store.getState().user;

    expect(state.user).toEqual(mockResponse.user);
    expect(state.error).toBe('');
  });

  it('должен обрабатывать getOrders.pending', () => {
    store.dispatch(getUserOrders.pending(''));

    const state = store.getState().user;

    expect(state.request).toBe(true);
  });

  it('должен обрабатывать getOrders.fulfilled', async () => {
    const mockOrders = [{ _id: '1', status: 'done' }];
    (getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

    await store.dispatch(getUserOrders());

    const state = store.getState().user;

    expect(state.userOrders).toEqual(mockOrders);
    expect(state.request).toBe(false);
  });

  it('должен обрабатывать getOrders.rejected', async () => {
    (getOrdersApi as jest.Mock).mockRejectedValue(
      new Error('Ошибка получения заказов')
    );

    await store.dispatch(getUserOrders());

    const state = store.getState().user;

    expect(state.error).toBe('Ошибка получения заказов');
    expect(state.userOrders.length).toBe(0);
  });

  it('должен возвращать пользователя через селектор selectUser', () => {
    const mockResponse = { user: { _id: '1', name: '123', email: '' } };
    store.dispatch(setUser(mockResponse.user));

    const selectedData = selectUser(store.getState());

    expect(selectedData).toEqual(mockResponse.user);
  });

  it('должен возвращать состояние проверки аутентификации через селектор selectIsAuthChecked', () => {
    store.dispatch(setIsAuthChecked(true));

    const selectedData = selectIsAuthChecked(store.getState());

    expect(selectedData).toBe(true);
  });
});
