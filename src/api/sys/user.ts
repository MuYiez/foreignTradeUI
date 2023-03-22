import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/user/login',
  Logout = '/logout',
  GetUserInfo = '/api/userinfo',
  GetPermCode = '/api/getPermCode',
  allUser = '/api/allUser',
}

/**
 * @description: user login api
 */
// export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
//   return defHttp.post(
//     {
//       url: Api.Login,
//       params,
//     },
//     {
//       errorMessageMode: mode,
//     },
//   );
// }

/**
 * @description: 登录
 */
 export function loginApi(params: LoginParams) {
  return defHttp.request({
    url: Api.Login,
    method: 'post',
    params,
  });
}

/**
 * @description: 获取信息
 */
 export function getUserInfo(params: any) {
  return defHttp.request({
    url: Api.GetUserInfo,
    method: 'get',
    params,
  });
}

/**
 * @description: 获取所有用户信息
 */
 export function allUser(params: any) {
  return defHttp.request({
    url: Api.allUser,
    method: 'get',
    params,
  });
}

/**
 * @description: getUserInfo
 */
// export function getUserInfo() {
//   return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
// }

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}
