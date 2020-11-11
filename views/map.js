import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Button,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';


import {Header} from 'react-native-elements'
import {
  Actions
} from 'react-native-router-flux';

import Constants from '../constants'

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';

const Map = () => {
  const [
    currentLongitude,
    setCurrentLongitude
  ] = useState(null);
  const [
    currentLatitude,
    setCurrentLatitude
  ] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            subscribeLocationLocation();
          } else {
            ToastAndroid.showWithGravity('تم منع التطبيق من الوصول لمنطقتك، الرجاء السماح له بذلك', ToastAndroid.LONG, ToastAndroid.BOTTOM);
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);


  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {

        //getting the Longitude from the location json        
        const currentLongitude = position.coords.longitude;

        //getting the Latitude from the location json
        const currentLatitude = position.coords.latitude;

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        ToastAndroid.showWithGravity(error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        { currentLatitude == null && currentLongitude == null ? 
        <ActivityIndicator size="large" color="#00ff00" /> :
            (<MapView style={{width: width, height: height-65}} initialRegion={{            
                latitude: currentLatitude,
                longitude: currentLongitude,
                latitudeDelta: 1,
                longitudeDelta: 0.0421,
                }}  
                showsUserLocation = {true}
                mapType="hybrid"
                followUserLocation = {true} zoomEnabled provider={PROVIDER_GOOGLE}/>)
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  boldText: {
    fontSize: 25,
    color: 'red',
    marginVertical: 16,
  },
});
export default Map
