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

const queryString = require('query-string');

import Constants from '../constants'
import axios from 'axios'
import {getToken} from '../storage'
import moment from 'moment';
import ar from 'moment/locale/ar'
moment.locale("ar", ar);

import {getConstants} from '../storage'


const Dashboard = ({navigation}) => {
  var [featuredOffers, setFeaturedOffers] = React.useState([])
  var [interestedOffers, setInterestedOffers] = React.useState([])
  var [isLoading, setIsLoading] = React.useState(true)
  var [refreshing, setRefreshing] = React.useState(false)
  var [constants_state, setConstants] = React.useState({})
  
  const getFeatured = (data) => {
    console.log(data)
    return axios.post(Constants.API_HOST + "common/featured_events.php",queryString.stringify({
              usermobile_id: data.usermobile_id,
              auth_code: data.auth_key,
              start: 0,
              limit: 10,
              language_id: Constants.ARABIC
            }))
  }
    const getInterested = (data) => {
    return axios.post(Constants.API_HOST + "common/intersted_events.php",queryString.stringify({
              usermobile_id: data.usermobile_id,
              auth_code: data.auth_key,
              language_id: Constants.ARABIC
            }))
  }
  const refreshData = () => {
    setIsLoading(true)
    getToken().then((data)=> {
      data = JSON.parse(data);
        getFeatured(data).then((data) => {
          let featuredList = []
          Object.keys(data.data).forEach((key) => {
            let element = data.data[key];
            let days_str = element.remaining_days
            let days_arr = days_str.split('<->')
            featuredList.push({
              id: key,
              ...element,
              remaining_days:  moment(days_arr[1]).locale('ar').fromNow(),
              image_url: constants_state.image_directory + '/' + element.image
              
            })
          })
          setFeaturedOffers(featuredList)
          getInterested(data).then(()=> {
            var interstedList = [];
            Object.keys(data.data).forEach((key) => {
            let element = data.data[key];
            let days_str = element.remaining_days
            let days_arr = days_str.split('<->')
              interstedList.push({
                id: key,
                ...data.data[key],
              remaining_days:  moment(days_arr[1]).locale('ar').fromNow(),
                image_url: constants_state.image_directory + '/' + element.image
              })
            })
            setInterestedOffers(interstedList)
            setIsLoading(false)
          }).catch((err)=> console.log(err + "here2"))
        }).catch((err) => console.log(err + 'here'))
    });
  }
  React.useEffect(() => {
      
    getConstants().then((constants) => {
      console.log(JSON.parse(constants))
      setConstants(JSON.parse(constants))
      refreshData();
    })
      return () => {
        setFeaturedOffers([]) // cleanup
        setInterestedOffers([]) // cleanup
      }
  }, [])
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false); 
      refreshData();
    }, 1000);
  }, []);
  return (
    <>
      <SafeAreaView style={styles.container}>
      { isLoading ? 
      (<View style={{display: 'flex', flex: 1, justifyContent:'center'}}> 
          <ActivityIndicator size="large" color="#00ff00" /> 
          
        
      </View>) :
      (

        <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
        <View style={styles.header}>
            <Text style={{margin: 10, fontSize: 25}}>العروض المميزة</Text>
            <CardSlider>
                {featuredOffers.map((offer, index) =>
                    <Card key={index} offer={offer} style={styles.card} navigation_function={navigation.navigate}/>
                    )
                }
            </CardSlider>
        </View>
        <View style={{flex: 1}}>
            <Text style={{fontSize: 25, margin: 10}}>عروض قد تهمك</Text>
            {interestedOffers.map((offer, index) => 
                (<ListItem  key={index}>
                    <Card offer={offer} style={styles.flatcard} type='flat' navigation_function={navigation.navigate}/>    
                </ListItem>))
            }
        </View>
        </ScrollView>
      )
    }
    
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

export default Dashboard;
