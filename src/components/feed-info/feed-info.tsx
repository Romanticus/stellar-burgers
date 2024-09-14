import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { selectOrdersData } from '../../services/slices/feedSlice';
import { useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);
type TFeed = { total?: number; totalToday?: number };
export const FeedInfo: FC = () => {
  const orderData = useSelector(selectOrdersData);

  const orders: TOrder[] = orderData.orders;
  const feed: TFeed = {};
  feed.total = orderData.total;
  feed.totalToday = orderData.totalToday;
  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
