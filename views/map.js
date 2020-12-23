import MapboxGL from '@react-native-mapbox-gl/maps';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import axios from 'axios';
import { getToken } from '../storage';

import Constants from '../constants';

const queryString = require('query-string');
MapboxGL.setAccessToken(Constants.MAPBOX_TOKEN);

const Map = () => {
  const route = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [
              11.953125,
              39.436192999314095,
            ],
            [
              18.896484375,
              46.37725420510028,
            ],
          ],
        },
      },
    ],
  };
  const [
    hasPermision,
    setHasPermision,
  ] = useState(false);
  const [
    currentLongitude,
    setCurrentLongitude,
  ] = useState(null);
  const [
    currentLatitude,
    setCurrentLatitude,
  ] = useState(null);

  useEffect(() => {
    const askPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Permission',
            message: 'App needs access to your Location .',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the Location');
          setHasPermision(true);
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    askPermission();
  }, []);
  useEffect(() => {
    const getAround = async () => {
      let token = await getToken();
      token = JSON.parse(token);
      const data = await axios.post(`${Constants.API_HOST}common/map.php`,
        queryString.stringify({
          usermobile_id: token.usermobile_id,
          auth_code: token.auth_key,
          current_lat: `${currentLatitude}`,
          current_long: `${currentLongitude}`,
          range: 10000,
        }));
      console.log({
        usermobile_id: token.usermobile_id,
        auth_code: token.auth_key,
        current_lat: `${currentLatitude}`,
        current_long: `${currentLongitude}`,
        range: 10000,
      });
      console.log(data.data);
    };
    getAround();
  }, [currentLongitude, currentLatitude]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        { currentLatitude != null && currentLongitude != null
          ? <ActivityIndicator size="large" color="#00ff00" />
          : (
            <>
              <MapboxGL.MapView
                showUserLocation
                zoomLevel={12}
                userTrackingMode={MapboxGL.UserTrackingModes.Follow}
                style={{
                  width: '100%', height: '100%', display: 'flex', flex: 1,
                }}
              >

                <MapboxGL.ShapeSource id="line1" shape={route}>
                  <MapboxGL.LineLayer id="linelayer1" style={{ lineColor: 'red' }} />
                </MapboxGL.ShapeSource>
                {
                  hasPermision && (
                  <MapboxGL.UserLocation
                    visible
                    onUpdate={(location) => {
                      setCurrentLongitude(location.coords.longitude);
                      setCurrentLatitude(location.coords.latitude);
                    }}
                  />
                  )
                }
              </MapboxGL.MapView>
            </>
          )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boldText: {
    fontSize: 25,
    color: 'red',
    marginVertical: 16,
  },
});
export default Map;
