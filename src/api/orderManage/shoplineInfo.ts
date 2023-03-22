import { defHttp } from '/@/utils/http/axios';

enum Api {
  addShop = '/api/shopline/addShop',
  searchShop = '/api/shopline/searchShop',
  deleteShop = '/api/shopline/deleteShop',
  updateShop = '/api/shopline/updateShop',
}

/**
 * @description: 新增店铺
 */
export function addShop(params: any) {
  return defHttp.request({
    url: Api.addShop,
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
 * @description: 删除店铺
 */
export function deleteShop(params: any) {
  return defHttp.request({
    url: Api.deleteShop,
    method: 'post',
    params,
  });
}

/**
 * @description: 更新店铺
 */
export function updateShop(params: any) {
  return defHttp.request({
    url: Api.updateShop,
    method: 'post',
    params,
  });
}
