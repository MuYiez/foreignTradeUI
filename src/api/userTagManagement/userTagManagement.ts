import { defHttp } from '/@/utils/http/axios';

enum Api {
  addTag = '/tag/addTag',
  tagList = '/tag/list',
  editTag = '/tag/editTag',
  delTag = '/tag/delTag',
  queryUser = '/user/queryUser',
  editUser = '/user/editUser',
  delUser = '/user/delUser',
  addUser = '/user/addUser',
  export = '/user/export',
}

/**
 * @description: 新增
 */
export function addTag(params:any) {
  return defHttp.request({
    url: Api.addTag,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改
 */
export function editTag(params:any) {
  return defHttp.request({
    url: Api.editTag,
    method: 'post',
    params,
  });
}

/**
 * @description: 删除
 */
export function delTag(params:any) {
  return defHttp.request({
    url: Api.delTag,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询
 */
export function tagList(params:any) {
  return defHttp.request({
    url: Api.tagList,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询用户
 */
export function queryUser(params:any) {
  return defHttp.request({
    url: Api.queryUser,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改用户
 */
export function editUser(params:any) {
  return defHttp.request({
    url: Api.editUser,
    method: 'post',
    params,
  });
}

/**
 * @description: 删除用户
 */
export function delUser(params:any) {
  return defHttp.request({
    url: Api.delUser,
    method: 'post',
    params,
  });
}

/**
 * @description: 新增用户
 */
export function addUser(params:any) {
  return defHttp.request({
    url: Api.addUser,
    method: 'post',
    params,
  });
}


/**
 * @description: 导出订单
 */
 export function orderExport(params:any) {
  return defHttp.request({
    url: Api.export,
    method: 'post',
    params,
    responseType:'blob'
  });
}

