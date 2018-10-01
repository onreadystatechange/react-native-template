import React from 'react';
import { AppRegistry } from 'react-native';

import dva from './utils/dva';
import Router, { routerMiddleware } from './router';

import routerModel from './models/router';
// import accountModel from './models/account';
import authModel from './models/auth';
// import regularInvestModel from './models/regularInvest';
// import coinPurseModel from './models/coinPurse';
// import myInvestModel from './models/myInvest';
// import verifyCodeModel from './models/verifyCode';

console.ignoredYellowBox = [
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillUpdate is deprecated',
];

const app = dva({
  initialState: {},
  models: [
    routerModel,
    // accountModel,
    authModel,
    // regularInvestModel,
    // coinPurseModel,
    // myInvestModel,
    // verifyCodeModel,
  ],
  onAction: [routerMiddleware],
  onError(e) {
    console.log('onError', e);
  },
});

const App = app.start(<Router />);

AppRegistry.registerComponent('CorpFortune', () => App);

export default App;
