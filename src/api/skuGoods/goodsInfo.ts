import { defHttp } from '/@/utils/http/axios';

enum Api {
  goodsInfoSearch = '/api/skuGoods/goodsInfoSearch',
  getGoodsInfoCode = '/api/skuGoods/getGoodsInfoCode',
  goodsInfoAdd = '/api/skuGoods/goodsInfoAdd',
  goodsInfoDelete = '/api/skuGoods/goodsInfoDelete',
  changeGoodsStatus = '/api/skuGoods/changeGoodsStatus',
  getGoodsInfo = '/api/skuGoods/getGoodsInfo',
  addPictrue = '/api/skuGoods/addPictrue',
  addNetPictrue = '/api/skuGoods/addNetPictrue',
  delPictrue = '/api/skuGoods/delPictrue',
  goodsInfoChange = '/api/skuGoods/goodsInfoChange',
  getSpuCode = '/api/skuGoods/getSpuCode',
  uploadExcel = '/api/uploadGoods/uploadExcel',
  uploadWarehouseExcel = '/api/uploadGoods/uploadWarehouseExcel',
  uploadAllExcel = '/api/uploadGoods/uploadAllExcel',
  editWarehouse = '/api/skuGoods/editWarehouse',
}

/**
 * @description: 查询
 */
export function goodsInfoSearch(params:any) {
  return defHttp.request({
    url: Api.goodsInfoSearch,
    method: 'post',
    params,
  });
}

/**
 * @description: 获取商品编码
 */
export function getGoodsInfoCode(params:any) {
  return defHttp.request({
    url: Api.getGoodsInfoCode,
    method: 'get',
    params,
  });
}

/**
 * @description: 上传图片
 */
export function addPictrue(params:any) {
  return defHttp.request({
    url: Api.addPictrue,
    method: 'post',
    params,
  });
}

/**
 * @description: 上传商品信息
 */
export function uploadExcel(params:any) {
  return defHttp.request({
    url: Api.uploadExcel,
    method: 'post',
    params,
  });
}

/**
 * @description: 上传商品仓库信息
 */
export function uploadWarehouseExcel(params:any) {
  return defHttp.request({
    url: Api.uploadWarehouseExcel,
    method: 'post',
    params,
  });
}

/**
 * @description: 初次上传商品仓库信息
 */
export function uploadAllExcel(params:any) {
  return defHttp.request({
    url: Api.uploadAllExcel,
    method: 'post',
    params,
  });
}

/**
 * @description: 上传网络图片
 */
export function addNetPictrue(params:any) {
  return defHttp.request({
    url: Api.addNetPictrue,
    method: 'post',
    params,
  });
}

/**
 * @description: 删除图片
 */
export function delPictrue(params:any) {
  return defHttp.request({
    url: Api.delPictrue,
    method: 'post',
    params,
  });
}

/**
 * @description: 新增商品信息
 */
export function goodsInfoAdd(params:any) {
  return defHttp.request({
    url: Api.goodsInfoAdd,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改商品信息
 */
export function goodsInfoChange(params:any) {
  return defHttp.request({
    url: Api.goodsInfoChange,
    method: 'post',
    params,
  });
}

/**
 * @description: 删除商品信息
 */
export function goodsInfoDelete(params:any) {
  return defHttp.request({
    url: Api.goodsInfoDelete,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改商品状态
 */
export function changeGoodsStatus(params:any) {
  return defHttp.request({
    url: Api.changeGoodsStatus,
    method: 'post',
    params,
  });
}

/**
 * @description: 获取商品详情
 */
export function getGoodsInfo(params:any) {
  return defHttp.request({
    url: Api.getGoodsInfo,
    method: 'post',
    params,
  });
}

/**
 * @description: 获取商品spu编码
 */
export function getSpuCode(params:any) {
  return defHttp.request({
    url: Api.getSpuCode,
    method: 'get',
    params,
  });
}

/**
 * @description: 编辑仓库信息
 */
export function editWarehouse(params:any) {
  return defHttp.request({
    url: Api.editWarehouse,
    method: 'post',
    params,
  });
}