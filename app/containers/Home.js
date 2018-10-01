import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import pxToDp from '../utils/pxToDp';

import { NavigationActions, createAction } from '../utils';

@connect(({ auth, regularInvest, coinPurse }) => ({ auth, regularInvest, coinPurse }))
class Home extends Component {
  static navigationOptions = {
    header: null,
    title: '首页',
    tabBarLabel: '首页',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/home-gray.png')}
      />
    ),
  };

  // componentWillMount() {
  //   const { dispatch } = this.props;
  //   dispatch(
  //     createAction('auth/checkLogin')({
  //       callback: () => {
  //         dispatch(createAction('regularInvest/regularRate')());
  //         dispatch(createAction('coinPurse/currentRate')());
  //         dispatch(createAction('auth/notice')());
  //       },
  //     })
  //   );
  // }

  gotoCoinPurse = () => {
    // const { coinPurse } = this.props;
    // if (coinPurse.currentRate !== '') {
    //   this.props.dispatch(NavigationActions.navigate({ routeName: 'CoinPurse' }));
    // }
  };

  gotoInvest = () => {
    // const { regularInvest } = this.props;
    // if (regularInvest.regularRate !== '') {
    //   this.props.dispatch(NavigationActions.navigate({ routeName: 'Invest' }));
    // }
  };

  gotoCityList = () => {
    // this.props.dispatch(NavigationActions.navigate({ routeName: 'CityList' }));
  };

  render() {
    const { auth, regularInvest, coinPurse } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.gotoCityList}
            style={styles.companyName}
          >
            <Text style={styles.cityTitle}>{auth.user.companyName}</Text>
            <View>
              <Image style={styles.change} source={require('../images/change-up.png')} />
              <Image style={styles.change} source={require('../images/change-down.png')} />
            </View>
          </TouchableOpacity>
          <Image style={styles.image} source={require('../images/banner.png')} />
          {Array.isArray(auth.noticeList) && auth.noticeList.length > 1 ? (
            <View style={styles.notice}>
              <Image style={styles.vicon} source={require('../images/volume.png')} />
              <Text style={styles.rate}>{auth.noticeList.map(i => i.content).join(' ')}</Text>
            </View>
          ) : null}
          <View style={styles.cardWrap}>
            <TouchableOpacity style={styles.content} activeOpacity={1} onPress={this.gotoInvest}>
              <View style={styles.financialWrap}>
                <Text style={styles.financial}>定期理财</Text>
                <Text style={styles.income}>收益稳健</Text>
              </View>
              <View style={styles.percent}>
                <View>
                  <Text style={styles.info}>
                    <Text style={{ fontSize: pxToDp(60) }}>敬请期待</Text>
                  </Text>
                  <Text
                    style={{
                      fontSize: pxToDp(28),
                      color: 'rgb(170,170,170)',
                    }}
                  >
                    {'平均年化率高达'}
                  </Text>
                </View>
                <Image style={styles.ficon} source={require('../images/financing.png')} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={styles.content} onPress={this.gotoCoinPurse}>
              <View style={styles.financialWrap}>
                <Text style={styles.financial}>企惠宝零钱包</Text>
                <Text style={styles.income}>资金灵活</Text>
              </View>
              <View style={styles.percent}>
                <View>
                  <Text style={styles.info}>
                    <Text style={{ fontSize: pxToDp(60) }}>敬请期待</Text>
                  </Text>
                  <Text
                    style={{
                      fontSize: pxToDp(28),
                      color: 'rgb(170,170,170)',
                    }}
                  >
                    {'7日年化率高达'}
                  </Text>
                </View>
                <Image style={styles.ficon} source={require('../images/qihuibao-package.png')} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f3f3',
  },
  icon: {
    width: pxToDp(48),
    height: pxToDp(48),
  },
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  companyName: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? pxToDp(60) : pxToDp(40),
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  change: {
    width: pxToDp(32),
    height: pxToDp(16),
    marginLeft: pxToDp(10),
  },
  cityTitle: {
    color: '#fff',
    fontSize: pxToDp(36),
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flexDirection: 'row',
    flex: 1,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    height: pxToDp(98),
    paddingLeft: pxToDp(26),
    backgroundColor: '#fff',
  },
  vicon: {
    width: pxToDp(42),
    height: pxToDp(42),
    marginRight: pxToDp(26),
  },
  rate: {
    fontSize: pxToDp(36),
    color: 'rgb(51,51,51)',
  },
  cardWrap: {
    padding: pxToDp(26),
  },
  content: {
    backgroundColor: '#fff',
    paddingLeft: pxToDp(26),
    paddingTop: pxToDp(26),
    marginBottom: pxToDp(26),
  },
  financialWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftColor: 'rgb(54,177,255)',
    borderLeftWidth: pxToDp(6),
    borderRadius: pxToDp(4),
  },
  financial: {
    fontSize: pxToDp(36),
    color: 'rgb(51,51,51)',
    marginLeft: pxToDp(10),
  },
  income: {
    color: 'rgb(54,177,255)',
    marginLeft: pxToDp(20),
  },
  ficon: {
    width: pxToDp(150),
    height: pxToDp(150),
  },
  percent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: pxToDp(26),
    paddingLeft: pxToDp(26),
    paddingRight: pxToDp(60),
    paddingBottom: pxToDp(80),
  },
  info: {
    paddingBottom: pxToDp(20),
    color: 'rgb(255,106,110)',
  },
});

export default Home;
