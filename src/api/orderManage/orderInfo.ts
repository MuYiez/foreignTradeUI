import { defHttp } from '/@/utils/http/axios';

enum Api {
  getShoplineOrder = '/api/order/getShoplineOrder',
  getOrder = '/api/order/getOrder',
  searchShop = '/api/order/searchShop',
  searchOrderSku = '/api/order/searchOrderSku',
  matchSku = '/api/order/matchSku',
}

/**
 * @description: 同步shopline订单
 */
export function getShoplineOrder(params: any) {
  return defHttp.request({
    url: Api.getShoplineOrder,
    method: 'post',
    params,
  });
}

/**
 * @description: 获取订单
 */
export function getOrder(params: any) {
  return defHttp.request({
    url: Api.getOrder,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询店铺
 */
export function searchShop(params: any) {
  return defHttp.request({
    url: Api.searchShop,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询sku
 */
export function searchOrderSku(params: any) {
  return defHttp.request({
    url: Api.searchOrderSku,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改sku
 */
export function matchSku(params: any) {
  return defHttp.request({
    url: Api.matchSku,
    method: 'post',
    params,
  });
}