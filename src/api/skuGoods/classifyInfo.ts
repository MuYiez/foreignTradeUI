import { defHttp } from '/@/utils/http/axios';

enum Api {
  classifyInfoSearch = '/api/skuGoods/classifyInfoSearch',
  classifyInfoAdd = '/api/skuGoods/classifyInfoAdd',
  classifyInfoUpdate = '/api/skuGoods/classifyInfoUpdate',
  classifyInfoDelete = '/api/skuGoods/classifyInfoDelete',
}

/**
 * @description: 查询
 */
export function classifyInfoSearch(params:any) {
  return defHttp.request({
    url: Api.classifyInfoSearch,
    method: 'get',
    params,
  });
}

/**
 * @description: 添加
 */
export function classifyInfoAdd(params:any) {
  return defHttp.request({
    url: Api.classifyInfoAdd,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改
 */
export function classifyInfoUpdate(params:any) {
  return defHttp.request({
    url: Api.classifyInfoUpdate,
    method: 'post',
    params,
  });
}

/**
 * @description: 删除
 */
export function classifyInfoDelete(params:any) {
  return defHttp.request({
    url: Api.classifyInfoDelete,
    method: 'post',
    params,
  });
}

