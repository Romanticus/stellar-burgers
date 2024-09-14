import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  getUserOrders,
  selectUser,
  selectUserOrder
} from '../../services/slices/userSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  // const orders: TOrder[] = [];
  const userOrder = useSelector(selectUserOrder);
  useEffect(() => {
    dispatch(getUserOrders());
  }, []);
  return <ProfileOrdersUI orders={userOrder} />;
};
