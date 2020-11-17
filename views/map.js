
import MapboxGL from '@react-native-mapbox-gl/maps';
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


MapboxGL.setAccessToken(Constants.MAPBOX_TOKEN);

const Map = () => {
  var route =  {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [
                    11.953125,
                    39.436192999314095
                  ],
                  [
                    18.896484375,
                    46.37725420510028
                  ]
                ]
              }
            }
          ]
        }
  const [
    currentLongitude,
    setCurrentLongitude
  ] = useState(null);
  const [
    currentLatitude,
    setCurrentLatitude
  ] = useState(null);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        { currentLatitude != null && currentLongitude != null ? 
        <ActivityIndicator size="large" color="#00ff00" /> :
            (<>
            <MapboxGL.MapView 
            showUserLocation={true}
            zoomLevel={12}
            userTrackingMode={MapboxGL.UserTrackingModes.Follow}
            style={{width: '100%', height: '100%', display:"flex", flex: 1}}
            
            >
              
            <MapboxGL.ShapeSource id='line1' shape={route}>
              <MapboxGL.LineLayer id='linelayer1' style={{lineColor:'red'}} />
            </MapboxGL.ShapeSource>
              <MapboxGL.UserLocation />
            </MapboxGL.MapView>
          </>)
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
