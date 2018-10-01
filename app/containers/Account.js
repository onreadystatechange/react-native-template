import React, { Component } from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import numeral from 'numeral';

import { createAction, NavigationActions } from '../utils';
import pxToDp from '../utils/pxToDp';

@connect(({ auth, account }) => ({ auth, account }))
class Account extends Component {
  static navigationOptions = {
    header: null,
    title: '账户',
    tabBarLabel: '账户',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/account-gray.png')}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      openEyes: true,
    };
  }

  componentWillMount() {
    const { auth, dispatch } = this.props;
    dispatch(
      createAction('auth/checkLogin')({
        callback: () => {
          dispatch(createAction('account/accountBalance')());
        },
      })
    );
  }

  gotoMyInvest = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'MyInvest' }));
  };

  gotoCapitalDetails = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'CapitalDetails' }));
  };

  gotoWithdrawal = balance => {
    this.props.dispatch(
      NavigationActions.navigate({ routeName: 'Withdrawal', params: { balance } })
    );
  };

  gotoSetting = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Setting' }));
  };

  gotoAbout = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'About' }));
  };
  formatPhone = phone => phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

  render() {
    const { fetching, logoUrl, account, auth } = this.props;
    return (
      <View style={styles.container}>
        {fetching ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.height}>
            <View>
              <ImageBackground
                style={styles.background}
                source={require('../images/account-bg.png')}
              >
                <View style={styles.topWrap}>
                  {logoUrl ? (
                    <Image style={styles.imgTop} source={{ uri: `https://${logoUrl}` }} />
                  ) : (
                    <Image style={styles.imgTop} source={require('../images/head.png')} />
                  )}
                  <Text style={styles.textTop}>{this.formatPhone(auth.user.mobile)}</Text>
                </View>
                <View style={styles.contentWrap}>
                  <View style={styles.betPacket}>
                    <Text style={styles.betText}> 金额账户(元) </Text>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.contentItem}
                      onPress={() => this.setState({ openEyes: !this.state.openEyes })}
                    >
                      {this.state.openEyes ? (
                        <Image style={styles.betImg} source={require('../images/visual.png')} />
                      ) : (
                        <Image
                          style={styles.betImg}
                          source={require('../images/close-visual.png')}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.contentWrap}>
                  <Text style={styles.lastText}>
                    {this.state.openEyes
                      ? numeral(
                          account.accountMsg.balance + account.accountMsg.receivable || 0
                        ).format('0,0.00')
                      : '****'}
                  </Text>
                  <View style={styles.lastWrap}>
                    <Text style={styles.endText}>
                      在途资金(元):
                      {this.state.openEyes
                        ? numeral(account.turnOutAmount || 0).format('0,0.00')
                        : '****'}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.content}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.wrapper}
                onPress={this.gotoMyInvest}
              >
                <View style={styles.wrapDeatil}>
                  <Image source={require('../images/my-invest.png')} style={styles.imgStyle} />
                  <Text style={styles.sunstance}> 我的投资 </Text>
                </View>
                <Image source={require('../images/enter.png')} style={styles.enter} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.wrapper}
                onPress={this.gotoCapitalDetails}
              >
                <View style={styles.wrapDeatil}>
                  <Image source={require('../images/invest-detail.png')} style={styles.imgStyle} />
                  <Text style={styles.sunstance}> 资金明细 </Text>
                </View>
                <Image source={require('../images/enter.png')} style={styles.enter} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.wrapper}
                onPress={() => {
                  this.gotoWithdrawal(account.accountMsg.balance + account.accountMsg.receivable);
                }}
              >
                <View style={styles.wrapDeatil}>
                  <Image source={require('../images/cash.png')} style={styles.imgStyle} />
                  <Text style={styles.sunstance}> 提现 </Text>
                </View>
                <Image source={require('../images/enter.png')} style={styles.enter} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={styles.wrapper} onPress={this.gotoSetting}>
                <View style={styles.wrapDeatil}>
                  <Image source={require('../images/setting.png')} style={styles.imgStyle} />
                  <Text style={styles.sunstance}> 设置 </Text>
                </View>
                <Image source={require('../images/enter.png')} style={styles.enter} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.wrapper, styles.lastChild]}
                onPress={this.gotoAbout}
              >
                <View style={styles.wrapDeatil}>
                  <Image source={require('../images/about.png')} style={styles.imgStyle} />
                  <Text style={styles.sunstance}> 关于 </Text>
                </View>
                <Image source={require('../images/enter.png')} style={styles.enter} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  height: {
    flex: 1,
  },
  background: {
    height: pxToDp(600),
    width: pxToDp(760),
  },
  topWrap: {
    flexDirection: 'row',
    marginTop: pxToDp(60),
    marginLeft: pxToDp(20),
  },
  imgTop: {
    width: pxToDp(66),
    height: pxToDp(66),
    marginRight: pxToDp(20),
  },
  textTop: {
    fontSize: pxToDp(36),
    color: 'rgb(255,255,255)',
    lineHeight: pxToDp(66),
  },
  contentWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  betPacket: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: pxToDp(100),
  },
  betText: {
    fontSize: pxToDp(32),
    color: 'rgb(255,255,255)',
    textAlign: 'center',
    marginRight: pxToDp(100),
  },
  betImg: {
    width: pxToDp(48),
    height: pxToDp(48),
  },
  lastText: {
    fontSize: pxToDp(68),
    color: 'rgb(255,255,255)',
    marginTop: pxToDp(20),
  },
  lastWrap: {
    borderColor: '#ffffff',
    borderWidth: pxToDp(1),
    height: pxToDp(50),
    width: pxToDp(420),
    borderRadius: pxToDp(24),
    marginTop: pxToDp(60),
  },
  endText: {
    fontSize: pxToDp(28),
    color: 'rgb(255,255,255)',
    textAlign: 'center',
    lineHeight: pxToDp(50),
  },
  icon: {
    width: pxToDp(48),
    height: pxToDp(48),
  },
  content: {
    marginTop: pxToDp(-1),
    paddingLeft: pxToDp(26),
  },
  wrapper: {
    borderTopWidth: pxToDp(1),
    borderTopColor: '#dcdcdc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: pxToDp(26),
    height: pxToDp(88),
  },
  lastChild: {
    borderBottomWidth: pxToDp(1),
    borderBottomColor: '#dcdcdc',
  },
  wrapDeatil: {
    flexDirection: 'row',
  },
  imgStyle: {
    width: pxToDp(42),
    height: pxToDp(42),
    marginRight: pxToDp(26),
  },
  sunstance: {
    fontSize: pxToDp(34),
    color: 'rgb(51,51,51)',
  },
  enter: {
    width: pxToDp(24),
    height: pxToDp(24),
    marginRight: pxToDp(42),
  },
});

export default Account;
