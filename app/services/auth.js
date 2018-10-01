import request from '../utils/request';
import { Storage } from '../utils';
// import { delay } from '../utils''= 'https://easy-mock.com/mock/5ab7a51a89962b05a31a31cb/api'= 'http://localhost:9080/api/'

export const login = async payload => {
  console.log(payload);
  const data = await request('login', {
    method: 'POST',
    body: payload,
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  });
  console.log(`data:${JSON.stringify(data)}`);
  return data;
};

export const logout = async payload => {
  console.log(payload);
  const data = await request('logout', {
    method: 'POST',
    body: payload,
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  });
  return data;
};

export const getCurrentUser = async () => {
  const data = await request('user/getCurrentUser');
  console.log(`data:${JSON.stringify(data)}`);
  return data;
};

export const resetpwd = async payload => {
  console.log(`send resetpwd${payload}`);
  const data = await request('user/resetpwd', {
    method: 'POST',
    body: payload,
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  });
  console.log(`data:${JSON.stringify(data)}`);
  return data;
};

export const pwd = async payload => {
  const token = await Storage.get('token');
  console.log(`send pwd${payload}`);
  const data = await request(
    'user/pwd',
    {
      method: 'POST',
      body: payload,
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    token
  );
  console.log(`data:${JSON.stringify(data)}`);
  return data;
};

export const checkPwd = async payload => {
  console.log(`send checkPwd${payload}`);
  const data = await request('user/checkPwdExist', {
    method: 'POST',
    body: {
      username: payload,
    },
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  });
  console.log(`data:${JSON.stringify(data)}`);
  return data;
};

/**
 * 查询公司列表
 * @param payload
 * @returns {Promise<*>}
 */
export const coList = async payload => {
  console.log(`send coList${payload}`);
  const token = await Storage.get('token');
  const data = await request(
    'loginCompany/list',
    {
      body: payload,
    },
    token
  );
  console.log(`data:${JSON.stringify(data)}`);
  return data;
};

/**
 * 保存选择的公司
 * @param payload
 * @returns {Promise<*>}
 */
export const coSave = async payload => {
  console.log(`send coSave${JSON.stringify(payload)}`);
  const token = await Storage.get('token');
  const data = await request(
    'loginCompany/save',
    {
      method: 'POST',
      body: payload,
      'Content-Type': 'x-www-form-urlencoded',
    },
    token
  );
  console.log(`data:${JSON.stringify(data)}`);
  return data;
};

/**
 * 查询通知
 * @param payload
 * @returns {Promise<*>}
 */
export const noticeList = async () => {
  console.log(`send noticeList`);
  const token = await Storage.get('token');
  const data = await request('notice/effect', {}, token);
  console.log(`data:${JSON.stringify(data)}`);
  return data;
};
