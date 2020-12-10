import React from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default () => (
  <View style={{
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: '100%',
  }}
  >
    <View><Ionicons name="logo-facebook" size={50} color="#0000aa" /></View>
    <View><Ionicons name="logo-instagram" size={50} color="#990000" /></View>
    <View><Ionicons name="mail" size={50} color="#ff9900" /></View>
  </View>
);
