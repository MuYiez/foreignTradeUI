import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const userTagManagement: AppRouteModule = {
  path: '/authorityManage',
  name: 'AuthorityManage',
  component: LAYOUT,
  // redirect: '/userTagManagement/index',
  meta: {
    icon: 'ant-design:usergroup-add-outlined',
    title: t('routes.dashboard.authorityManage'),
    orderNo: 6, //菜单排序
  },
  children: [
    {
      path: 'myCrew',
      name: 'MyCrew',
      component: () => import('/@/views/authorityManage/myCrew/index.vue'),
      meta: {
        affix: false,
        hideChildrenInMenu: true,
        title: t('routes.dashboard.myCrew'),
      },
    },
  ],
};

export default userTagManagement;
