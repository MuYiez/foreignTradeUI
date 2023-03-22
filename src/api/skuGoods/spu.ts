import { defHttp } from '/@/utils/http/axios';

enum Api {
  addSpuInfo = '/api/spu/addSpuInfo',
  searchSpuInfo = '/api/spu/searchSpuInfo',
  searchSpuInfoDetail = '/api/spu/searchSpuInfoDetail',
  getSpuInfo = '/api/spu/getSpuInfo',
  editSpuInfo = '/api/spu/editSpuInfo',
  deleteSpuInfo = '/api/spu/deleteSpuInfo',
}

/**
 * @description: 新增
 */
export function addSpuInfo(params: any) {
  return defHttp.request({
    url: Api.addSpuInfo,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询
 */
export function searchSpuInfo(params: any) {
  return defHttp.request({
    url: Api.searchSpuInfo,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询变种商品信息
 */
export function searchSpuInfoDetail(params: any) {
  return defHttp.request({
    url: Api.searchSpuInfoDetail,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询spu商品信息
 */
export function getSpuInfo(params: any) {
  return defHttp.request({
    url: Api.getSpuInfo,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改spu信息
 */
export function editSpuInfo(params: any) {
  return defHttp.request({
    url: Api.editSpuInfo,
    method: 'post',
    params,
  });
}

/**
 * @description: 删除spu信息
 */
export function deleteSpuInfo(params: any) {
  return defHttp.request({
    url: Api.deleteSpuInfo,
    method: 'post',
    params,
  });
}
