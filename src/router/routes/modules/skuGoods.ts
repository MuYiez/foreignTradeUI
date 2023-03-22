import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const userTagManagement: AppRouteModule = {
  path: '/skuGoods',
  name: 'SkuGoods',
  component: LAYOUT,
  // redirect: '/userTagManagement/index',
  meta: {
    icon: 'icon-park-outline:commodity',
    title: t('routes.dashboard.skuGoods'),
    orderNo: 2, //菜单排序
  },
  children: [
    {
      path: 'classifySetting',
      name: 'classifySetting',
      component: () => import('/@/views/skuGoods/classifySetting/index.vue'),
      meta: {
        affix: false,
        hideChildrenInMenu:true,
        title: t('routes.dashboard.classifySetting'),
      }
    },
    {
      path: 'skuGoodsList',
      name: 'SkuGoodsList',
      component: () => import('/@/views/skuGoods/skuGoodsList/index.vue'),
      meta: {
        affix: false,
        hideChildrenInMenu:true,
        title: t('routes.dashboard.skuGoodsList'),
      },
      children: [
        {
          path: 'addSimpleSkuGoods',
          name: 'AddSimpleSkuGoods',
          component: () => import('/@/views/skuGoods/skuGoodsList/pages/simple/index.vue'),
          meta: {
            title: t('routes.dashboard.addSimpleSkuGoods'),
            ignoreKeepAlive:true
          },
        },
        {
          path: 'addComplexSkuGoods',
          name: 'AddComplexSkuGoods',
          component: () => import('/@/views/skuGoods/skuGoodsList/pages/complex/index.vue'),
          meta: {
            title: t('routes.dashboard.addComplexSkuGoods'),
            ignoreKeepAlive:true
          },
        },
        {
          path: 'editSimpleSkuGoods',
          name: 'EditSimpleSkuGoods',
          component: () => import('/@/views/skuGoods/skuGoodsList/pages/simple/editSimpleSkuGoods/index.vue'),
          meta: {
            title: t('routes.dashboard.editSimpleSkuGoods'),
            ignoreKeepAlive:true
          },
        },
        {
          path: 'editComplexSkuGoods',
          name: 'EditComplexSkuGoods',
          component: () => import('/@/views/skuGoods/skuGoodsList/pages/complex/editComplexSkuGoods/index.vue'),
          meta: {
            title: t('routes.dashboard.editComplexSkuGoods'),
            ignoreKeepAlive:true
          },
        },
      ],
    },
  ],
};

export default userTagManagement;
