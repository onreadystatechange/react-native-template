import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { NavigationActions, createAction } from '../utils';
import { HasNoInfo } from '../components';
import pxToDp from '../utils/pxToDp';

@connect(({ auth, regularInvest }) => ({ auth, regularInvest }))
class Invest extends Component {
  static navigationOptions = {
    title: '定期理财',
    tabBarLabel: '投资',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/invest-gray.png')}
      />
    ),
  };

  // componentWillMount() {
  //   const { auth, dispatch } = this.props;
  //   dispatch(
  //     createAction('auth/checkLogin')({
  //       callback: () => {
  //         dispatch(createAction('regularInvest/productList')());
  //       },
  //     })
  //   );
  // }

  gotoInvestDetail = product => {
    const { dispatch } = this.props;
    dispatch(
      createAction('regularInvest/productInfo')({
        id: product.id,
        callback: () => {
          dispatch(
            NavigationActions.navigate({
              routeName: 'InvestDetail',
              params: { title: product.name },
            })
          );
        },
      })
    );
  };

  gotoLogin = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Login' }));
  };

  render() {
    const { regularInvest } = this.props;
    if (regularInvest && regularInvest.fetching) {
      return null;
    }
    return (
      <View style={styles.container}>
        {Array.isArray(regularInvest.productList) && regularInvest.productList.length > 0 ? (
          <View style={styles.content}>
            <FlatList
              data={regularInvest.productList}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.itemContent}>
                    <View style={styles.itemTitleWrap}>
                      <View style={styles.circle} />
                      <Text style={styles.itemTitle}>{item.name}</Text>
                    </View>
                    <View style={styles.itemCount}>
                      <View style={styles.itemText}>
                        <Text style={styles.textTitle}>
                          {numeral(item.annualRate * 100).format('0,0.00')}
                        </Text>
                        <Text style={styles.textInfo}>%</Text>
                      </View>
                      <View style={styles.itemText}>
                        <Text style={styles.textTitle}>{item.term}</Text>
                        <Text style={styles.textInfo}>个月</Text>
                      </View>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={styles.btn}
                        onPress={() => {
                          this.gotoInvestDetail(item);
                        }}
                      >
                        <Text style={styles.btnText}>投资</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.info}>年化率</Text>
                      <Text style={styles.info}>投资期限</Text>
                      <TouchableOpacity activeOpacity={1} style={[styles.btn, styles.hidden]}>
                        <Text>投资</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        ) : (
          <HasNoInfo />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingTop: pxToDp(26),
    paddingLeft: pxToDp(26),
    paddingRight: pxToDp(26),
  },
  itemContent: {
    backgroundColor: '#fff',
    paddingTop: pxToDp(26),
    paddingLeft: pxToDp(26),
    marginBottom: pxToDp(20),
    borderRadius: pxToDp(4),
  },
  itemTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: pxToDp(32),
    color: 'rgb(51,51,51)',
  },
  itemCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: pxToDp(30),
  },
  itemText: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: pxToDp(180),
  },
  textTitle: {
    color: 'rgb(255,106,110)',
    fontSize: pxToDp(50),
    marginBottom: pxToDp(-8),
  },
  textInfo: {
    color: 'rgb(255,106,110)',
    fontSize: pxToDp(30),
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: pxToDp(20),
    height: pxToDp(80),
  },
  circle: {
    width: pxToDp(12),
    height: pxToDp(12),
    borderRadius: pxToDp(6),
    marginRight: pxToDp(12),
    backgroundColor: '#41b2fc',
  },
  info: {
    color: 'rgb(170,170,170)',
    fontSize: pxToDp(28),
    width: pxToDp(180),
  },
  btn: {
    width: pxToDp(140),
    height: pxToDp(66),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8b431',
    // opacity: .5,
    marginRight: pxToDp(50),
    borderRadius: pxToDp(33),
  },
  btnText: {
    color: '#fff',
  },
  hidden: {
    opacity: 0,
  },
});

export default Invest;
