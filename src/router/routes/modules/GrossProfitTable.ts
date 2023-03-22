import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const userTagManagement: AppRouteModule = {
  path: '/grossProfitTable',
  name: 'GrossProfitTable',
  component: LAYOUT,
  // redirect: '/userTagManagement/index',
  meta: {
    icon: 'uil:money-withdrawal',
    title: t('routes.dashboard.GrossProfitTable'),
    orderNo: 4, //菜单排序
  },
  children: [
    {
      path: 'parameterSetting',
      name: 'ParameterSetting',
      component: () => import('/@/views/grossProfitTable/parameterSetting/index.vue'),
      meta: {
        affix: false,
        hideChildrenInMenu:true,
        title: t('routes.dashboard.parameterSetting'),
      }
    },
    {
      path: 'skuCalculate',
      name: 'SkuCalculate',
      component: () => import('/@/views/grossProfitTable/skuCalculate/index.vue'),
      meta: {
        affix: false,
        hideChildrenInMenu:true,
        title: t('routes.dashboard.skuCalculate'),
      }
    },
    {
      path: 'dailyTable',
      name: 'DailyTable',
      component: () => import('/@/views/grossProfitTable/dailyTable/index.vue'),
      meta: {
        affix: false,
        hideChildrenInMenu:true,
        title: t('routes.dashboard.dailyTable'),
      },
      children: [
        {
          path: 'dailyTableEdit',
          name: 'DailyTableEdit',
          component: () => import('/@/views/grossProfitTable/dailyTable/pages/edit/index.vue'),
          meta: {
            title: t('routes.dashboard.dailyTableEdit'),
          },
        },
      ]
    },
  ],
};

export default userTagManagement;
