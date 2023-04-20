import { defHttp } from '/@/utils/http/axios';

enum Api {
  search = '/api/crew/search',
  getMyCrew = '/api/crew/getMyCrew',
  getCrewMenu = '/api/crew/getCrewMenu',
  editCrew = '/api/crew/editCrew',
  addCrew = '/api/crew/addCrew',
  getHomePage = '/api/crew/getHomePage',
  getMenu = '/api/getMenu',
  complexity = '/api/chatgpt/complexity',
}

/**
 * @description: 查询
 */
export function search(params: any) {
  return defHttp.request({
    url: Api.search,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询成员
 */
export function getMyCrew(params: any) {
  return defHttp.request({
    url: Api.getMyCrew,
    method: 'get',
    params,
  });
}

/**
 * @description: 查询路由菜单
 */
export function getMenu(params: any) {
  return defHttp.request({
    url: Api.getMenu,
    method: 'get',
    params,
  });
}

/**
 * @description: 获取主页列表
 */
export function getHomePage(params: any) {
  return defHttp.request({
    url: Api.getHomePage,
    method: 'get',
    params,
  });
}

/**
 * @description: 查询成员路由菜单
 */
export function getCrewMenu(params: any) {
  return defHttp.request({
    url: Api.getCrewMenu,
    method: 'post',
    params,
  });
}

/**
 * @description: 编辑成员
 */
export function editCrew(params: any) {
  return defHttp.request({
    url: Api.editCrew,
    method: 'post',
    params,
  });
}

/**
 * @description: 新增成员
 */
export function addCrew(params: any) {
  return defHttp.request({
    url: Api.addCrew,
    method: 'post',
    params,
  });
}

/**
 * @description: 新增成员
 */
export function complexity(params: any) {
  return defHttp.request({
    url: Api.complexity,
    method: 'post',
    params,
  });
}
