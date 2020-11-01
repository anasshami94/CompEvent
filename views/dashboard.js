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
  Dimensions,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import {Header, ListItem} from 'react-native-elements'

import CardSlider from '../components/card_slider'
import Card from '../components/card'

import {
  Actions
} from 'react-native-router-flux';

import Constants from '../constants'

var width = Dimensions.get('window').width; //full width
const Dashboard = () => {
  var [lastOffers, setLastOffers] = React.useState([])
  var [isLoading, setIsLoading] = React.useState(true)
  var [refreshing, setRefreshing] = React.useState(false)

  React.useEffect(() => {
    setIsLoading(true)
      setTimeout(() =>{     
        let response = require('../mock.json')
        setLastOffers(response)
        setIsLoading(false)
      }, 1000);
      return () => {
        setLastOffers([]) // cleanup
      }
  }, [])
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 4000);
  }, []);
  return (
    <>
      { isLoading ? 
      (<View style={{display: 'flex', flex: 1, justifyContent:'center'}}> 
          <ActivityIndicator size="large" color="#00ff00" /> 
      </View>) :
      (<SafeAreaView style={styles.container}>

        <Header
            containerStyle={{backgroundColor: Constants.GREEN_COLOR}}
            centerComponent={{ text: 'القائمة الرئيسية', style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff', onPress: () => {Actions.replace('dashboard')} }}
            />
        <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
        <View style={styles.header}>
            <Text style={{margin: 10, fontSize: 25}}>العروض المميزة</Text>
            <CardSlider>
                {lastOffers.map((offer, index) =>
                    <Card key={offer.offer_name + index.toString()} offer={offer} style={styles.card}/>
                    )
                }
            </CardSlider>
        </View>
        <View style={{flex: 1, display: 'flex'}}>
            <Text style={{fontSize: 25, margin: 10}}>عروض قد تهمك</Text>
            {lastOffers.map((offer, index) => 
                (<ListItem>
                    <Card offer={offer} key={index} style={styles.flatcard} type='flat'/>    
                </ListItem>))
            }
        </View>
        </ScrollView>

      </SafeAreaView>)
    }
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

export default Dashboard;
