import React from 'react';
import { StyleSheet, Text } from 'react-native';

import pxToDp from '../utils/pxToDp';
import Touchable from './Touchable';

export const Button = ({ text, children, style, textStyle, ...rest }) => (
  <Touchable style={[styles.button, style]} {...rest}>
    <Text style={[styles.text, textStyle]}>{text || children}</Text>
  </Touchable>
);

const styles = StyleSheet.create({
  button: {
    height: pxToDp(100),
    borderRadius: 4,
    backgroundColor: 'rgb(54,177,255)',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgb(54,177,255)',
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: pxToDp(36),
    color: '#fff',
  },
});

export default Button;
