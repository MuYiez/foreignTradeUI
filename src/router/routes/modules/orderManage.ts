import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const orderManage: AppRouteModule = {
  path: '/orderManage',
  name: 'OrderManage',
  component: LAYOUT,
  // redirect: '/userTagManagement/index',
  meta: {
    icon: 'icon-park-outline:transaction-order',
    title: t('routes.dashboard.orderManage'),
    orderNo: 3, //菜单排序
  },
  children: [
    {
      path: 'shoplineInfo',
      name: 'ShoplineInfo',
      component: () => import('/@/views/orderManage/shoplineInfo/index.vue'),
      meta: {
        affix: false,
        hideChildrenInMenu: true,
        title: t('routes.dashboard.shoplineInfo'),
      },
    },
    {
      path: 'orderList',
      name: 'OrderList',
      component: () => import('/@/views/orderManage/orderList/index.vue'),
      meta: {
        affix: false,
        hideChildrenInMenu: true,
        title: t('routes.dashboard.orderList'),
      },
    },
  ],
};

export default orderManage;
