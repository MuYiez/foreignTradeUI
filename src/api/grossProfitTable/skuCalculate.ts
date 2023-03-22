import { defHttp } from '/@/utils/http/axios';

enum Api {
  autosearch = '/api/skuGoods/autosearch',
  addDailyTable = '/api/skuGoods/addDailyTable',
  searchDailyTable = '/api/skuGoods/searchDailyTable',
  getTableDetail = '/api/skuGoods/getTableDetail',
  editDailyTable = '/api/skuGoods/editDailyTable',
  searchDangerousGoods = '/api/skuGoods/searchDangerousGoods',
  editGrossColumns = '/api/skuGoods/editGrossColumns',
  getGrossColumns = '/api/skuGoods/getGrossColumns',
}

/**
 * @description: 查询
 */
export function autosearch(params:any) {
  return defHttp.request({
    url: Api.autosearch,
    method: 'post',
    params,
  });
}

/**
 * @description: 新增日毛利表
 */
export function addDailyTable(params:any) {
  return defHttp.request({
    url: Api.addDailyTable,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询每日毛利表
 */
export function searchDailyTable(params:any) {
  return defHttp.request({
    url: Api.searchDailyTable,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询每日毛利表详情
 */
export function getTableDetail(params:any) {
  return defHttp.request({
    url: Api.getTableDetail,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改日毛利表
 */
export function editDailyTable(params:any) {
  return defHttp.request({
    url: Api.editDailyTable,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询商品属性
 */
export function searchDangerousGoods(params:any) {
  return defHttp.request({
    url: Api.searchDangerousGoods,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改毛利表栏位排序
 */
export function editGrossColumns(params:any) {
  return defHttp.request({
    url: Api.editGrossColumns,
    method: 'post',
    params,
  });
}

/**
 * @description: 获取毛利表栏位排序
 */
export function getGrossColumns(params:any) {
  return defHttp.request({
    url: Api.getGrossColumns,
    method: 'get',
    params,
  });
}

