import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const userTagManagement: AppRouteModule = {
  path: '/accountTable',
  name: 'AccountTable',
  component: LAYOUT,
  // redirect: '/userTagManagement/index',
  meta: {
    icon: 'ant-design:account-book-outlined',
    title: t('routes.dashboard.accountTable'),
    orderNo: 5, //菜单排序
  },
  children: [
    {
      path: 'accountParameter',
      name: 'AccountParameter',
      component: () => import('/@/views/accountTable/accountParameter/index.vue'),
      meta: {
        affix: false,
        hideChildrenInMenu: true,
        title: t('routes.dashboard.accountParameter'),
      },
    },
    {
      path: 'accountInfo',
      name: 'AccountInfo',
      component: () => import('/@/views/accountTable/accountInfo/index.vue'),
      meta: {
        affix: false,
        hideChildrenInMenu: true,
        title: t('routes.dashboard.accountInfo'),
      },
    },
  ],
};

export default userTagManagement;
