import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { fetchFeed, selectOrdersData } from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from 'src/services/slices/ingredientsSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFeed());
  }, []);
  const orderData = useSelector(selectOrdersData);
  const orders = orderData.orders;

  if (!orders.length) {
    return <Preloader />;
  }
  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeed());
      }}
    />
  );
};
