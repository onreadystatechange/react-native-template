import Toast from 'react-native-root-toast';
import { createAction, NavigationActions, Storage } from '../utils';
import {
  getCurrentUser,
  login,
  logout,
  resetpwd,
  pwd,
  coSave,
  coList,
  noticeList,
} from '../services/auth';

export default {
  namespace: 'auth',
  state: {
    logined: false,
    loading: false,
    fetching: false,
    user: {},
    companyList: [],
    noticeList: [],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    updateUser(state, { payload }) {
      return {
        ...state,
        ...payload,
        logined: !!(payload && payload.user && payload.user.id),
        loading: true,
      };
    },
  },
  effects: {
    *resetpwd({ payload }, { put, call }) {
      try {
        yield put(createAction('updateState')({ fetching: true }));
        const data = yield call(resetpwd, payload);
        if (data && data.succeed) {
          yield put(
            createAction('updateState')({
              fetching: false,
            })
          );
          yield put(NavigationActions.navigate({ routeName: 'ModifyPwdStatus' }));
        } else {
          yield put(
            createAction('updateState')({
              fetching: false,
            })
          );
          if (data && data.errorMsg) {
            Toast.show(data.errorMsg);
          }
        }
      } catch (err) {
        console.error(err);
        yield put(
          createAction('updateState')({
            fetching: false,
          })
        );
      }
    },

    *pwd({ payload }, { put, call }) {
      try {
        yield put(createAction('updateState')({ fetching: true }));
        const data = yield call(pwd, payload);
        if (data.succeed) {
          yield put(
            createAction('updateState')({
              fetching: false,
            })
          );
          Toast.show('密码修改成功，请重新登录!');
          yield put(createAction('updateUser')({}));
          yield put(createAction('gotoLogin')());
        } else {
          yield put(
            createAction('updateState')({
              fetching: false,
            })
          );
          if (data && data.errorMsg) {
            Toast.show(data.errorMsg);
          }
        }
      } catch (err) {
        console.error(err);
        yield put(
          createAction('updateState')({
            fetching: false,
          })
        );
      }
    },

    *login({ payload }, { call, put }) {
      yield put(createAction('updateState')({ fetching: true }));
      try {
        const data = yield call(login, payload);
        if (data && data.succeed) {
          // eslint-disable-next-line no-underscore-dangle
          yield call(Storage.set, 'token', data.data._token);
          yield call(Storage.set, 'username', payload.username);
          yield put(
            createAction('updateState')({
              fetching: false,
            })
          );
          yield put(createAction('getCurrentUser')({ routeName: 'Main' }));
        } else {
          yield put(
            createAction('updateState')({
              fetching: false,
            })
          );
          if (data && data.errorMsg) {
            Toast.show(data.errorMsg);
          }
        }
      } catch (err) {
        console.error(err);
        yield put(
          createAction('updateState')({
            fetching: false,
          })
        );
      }
    },

    *getCurrentUser({ payload }, { call, put }) {
      let user = {};
      try {
        const data = yield call(getCurrentUser);
        if (data && data.data) {
          user = data.data;
        }
      } catch (err) {
        console.error(err);
      }
      try {
        yield put(createAction('updateUser')({ user }));
        console.log('----');
        console.log(user);
        if (user && user.token) {
          console.log('******');
          console.log(payload);
          yield call(Storage.set, 'token', user.token);
          if (payload && payload.callback) {
            payload.callback();
          }
          if (payload && payload.routeName) {
            yield put(NavigationActions.navigate({ routeName: payload.routeName }));
          }
        } else {
          yield put(createAction('gotoLogin')());
        }
      } catch (err) {
        console.error(err);
      }
    },

    *logout(action, { call, put }) {
      try {
        yield call(logout);
        yield put(createAction('updateUser')({}));
        yield put(createAction('gotoLogin')());
      } catch (err) {
        console.error(err);
      }
    },

    *gotoLogin(action, { call, put }) {
      const username = yield call(Storage.get, 'username');
      if (username && typeof username === 'string') {
        yield put(NavigationActions.navigate({ routeName: 'Login' }));
      } else {
        yield put(NavigationActions.navigate({ routeName: 'ModifyAccount' }));
      }
    },

    *checkLogin({ payload }, { take, call, put, select }) {
      const { loading } = yield select(state => state.auth);
      if (!loading) {
        yield put(createAction('getCurrentUser')(payload));
      } else {
        const { logined } = yield select(state => state.auth);
        if (!logined) {
          yield put(createAction('gotoLogin')());
        } else if (payload.callback) {
          payload.callback();
        } else if (payload && payload.routeName) {
          yield put(NavigationActions.navigate({ routeName: payload.routeName }));
        }
      }
    },

    /**
     * 我的公司列表
     * @param payload
     * @param call
     * @param put
     */
    *coList({ payload }, { call, put }) {
      try {
        const data = yield call(coList, payload);
        if (data && data.succeed) {
          yield put(createAction('updateState')({ companyList: data.data }));
        }
      } catch (err) {
        console.log(err);
      }
    },

    /**
     *保存所在公司
     * @param payload
     * @param call
     * @param put
     */
    *coSave({ payload }, { call, put }) {
      try {
        const data = yield call(coSave, payload);
        if (data && data.succeed) {
          yield put(createAction('getCurrentUser')({ routeName: 'Home' }));
        }
      } catch (err) {
        console.log(err);
      }
    },

    *notice(_, { call, put }) {
      try {
        const data = yield call(noticeList);
        if (data && data.succeed) {
          yield put(createAction('updateState')({ noticeList: data.data }));
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
