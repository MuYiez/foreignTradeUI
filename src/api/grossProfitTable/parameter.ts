import { defHttp } from '/@/utils/http/axios';

enum Api {
  search = '/api/parameter/search',
  change = '/api/parameter/change',
}

/**
 * @description: 查询
 */
export function search(params:any) {
  return defHttp.request({
    url: Api.search,
    method: 'post',
    params,
  });
}

/**
 * @description: 查询
 */
export function change(params:any) {
  return defHttp.request({
    url: Api.change,
    method: 'post',
    params,
  });
}

