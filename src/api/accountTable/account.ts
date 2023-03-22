import { defHttp } from '/@/utils/http/axios';

enum Api {
  parameterSearch = '/api/account/parameterSearch',
  parameterAdd = '/api/account/parameterAdd',
  parameterDel = '/api/account/parameterDel',
  parameterEdit = '/api/account/parameterEdit',
  accountAdd = '/api/account/accountAdd',
  accountSearch = '/api/account/accountSearch',
  accountEdit = '/api/account/accountEdit',
  accountDelete = '/api/account/accountDelete',
  changePaymentReady = '/api/account/changePaymentReady',
}

/**
 * @description: 查询
 */
export function parameterSearch(params: any) {
  return defHttp.request({
    url: Api.parameterSearch,
    method: 'get',
    params,
  });
}

/**
 * @description: 参数新增
 */
export function parameterAdd(params: any) {
  return defHttp.request({
    url: Api.parameterAdd,
    method: 'post',
    params,
  });
}

/**
 * @description: 参数删除
 */
export function parameterDel(params: any) {
  return defHttp.request({
    url: Api.parameterDel,
    method: 'post',
    params,
  });
}

/**
 * @description: 参数编辑
 */
export function parameterEdit(params: any) {
  return defHttp.request({
    url: Api.parameterEdit,
    method: 'post',
    params,
  });
}

/**
 * @description: 新增账单
 */
export function accountAdd(params: any) {
  return defHttp.request({
    url: Api.accountAdd,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询账单
 */
export function accountSearch(params: any) {
  return defHttp.request({
    url: Api.accountSearch,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改账单
 */
export function accountEdit(params: any) {
  return defHttp.request({
    url: Api.accountEdit,
    method: 'post',
    params,
  });
}

/**
 * @description: 删除账单
 */
export function accountDelete(params: any) {
  return defHttp.request({
    url: Api.accountDelete,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改付款情况
 */
export function changePaymentReady(params: any) {
  return defHttp.request({
    url: Api.changePaymentReady,
    method: 'post',
    params,
  });
}
