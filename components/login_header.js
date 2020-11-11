import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

import Constants from '../constants'

export default LoginHeader = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>
                CompEvent
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 45,
    color: Constants.GREEN_COLOR,
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontWeight: '100',
    marginTop: 60,
    marginBottom: 50
  }
});