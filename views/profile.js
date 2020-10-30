/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  TouchableHighlight,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';

import {Header, ListItem} from 'react-native-elements'

import CardSlider from '../components/card_slider'
import Card from '../components/card'


import {
  Actions
} from 'react-native-router-flux';

import Constants from '../constants'

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
const Profile = () => {
  
  var [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);
  return (
    <>
        <SafeAreaView style={styles.Container}>
            <Header
            containerStyle={{backgroundColor: Constants.GREEN_COLOR}}
            centerComponent={{ text: 'صفحتك', style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff', onPress: () => {Actions.replace('dashboard')} }}
            />
            <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            >
                <Text>Anas Is here</Text>
            </ScrollView>
        </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    flexDirection: 'column'

  },
  header: {
    flex: 1
  },
  card: {
      display: 'flex',
      flexDirection: 'column',
      width: 200,
  },
  flatcard: {
      display: 'flex',
      width: 350,
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      margin: 3,
      borderColor: '#aaa'

  }
  
});

export default Profile;
