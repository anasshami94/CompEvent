import MapboxGL from '@react-native-mapbox-gl/maps';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ListItem, BottomSheet, Card } from 'react-native-elements';
import axios from 'axios';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { getToken, getConstants } from '../storage';
import Constants from '../constants';

const queryString = require('query-string');

MapboxGL.setAccessToken(Constants.MAPBOX_TOKEN);


const Map = () => {
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

  const [locations, setLocations] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const AnnotationContent = ({com}) => (
    <View style={styles.touchableContainer}>
      <TouchableOpacity style={styles.touchableContainer}
        onPress={() => {
          console.log(com);
          setSelected(com);
        }}
      >
        <View>
          <Text style={{opacity: 0.5}}><IonIcons name="location" size={40} color="green" /></Text>
        </View>
        <Text style={styles.touchableText}>{com.name}</Text>
      </TouchableOpacity>
    </View>
  );
  const Marker = ({
    coordinate,
    com,
  }) => (
    <MapboxGL.MarkerView coordinate={coordinate}>
      <AnnotationContent com={com} />
    </MapboxGL.MarkerView>
  );
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
    if (currentLatitude == null || currentLongitude == null) {
      return;
    }

    const getAround = async () => {
      let token = await getToken();
      token = JSON.parse(token);
      let helper = await getConstants();
      helper = JSON.parse(helper);
      console.log(helper);
      const data = await axios.post(`${Constants.API_HOST}common/map.php`,
        queryString.stringify({
          usermobile_id: token.usermobile_id,
          auth_code: token.auth_key,
          current_lat: `${currentLatitude}`,
          current_long: `${currentLongitude}`,
          range: 100000,
        }));
      setLocations(data.data.map((line) => ({
        ...line,
        image_url: `${helper.image_directory}${line.image}`,
      })));
    };
    getAround();
  }, [currentLongitude, currentLatitude]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      { selected && (
        <View style={{
          width: '100%',
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 20,
          zIndex: 10,
        }}
        >
          <Card>
            <Card.Title>
              <Text>معلومات الشركة</Text>
              <TouchableOpacity onPress={() => setSelected(null)} style={{alignItems: 'center', justifyContent: 'flex-start'}}>
                <Text style={{alignItems: 'center', justifyContent: 'flex-start'}}><IonIcons name="close" size={20} /></Text>
              </TouchableOpacity>
            </Card.Title>
            <Card.Image
              source={{
                uri: selected.image ? selected.image_url
                  : 'https://freepikpsd.com/wp-content/uploads/2019/10/empty-image-png-7-Transparent-Images.png',
              }}
              style={{ width: '100%', height: 150, borderRadius: 10 }}
            />
            <View>
              <Text style={{marginBottom: 10}}>
                {selected.name}
              </Text>
              <Text style={{marginBottom: 10}}>
                {`${selected.distance} متر`}
              </Text>
              <Text style={{marginBottom: 10}}>
                {selected.address}
              </Text>
            </View>
          </Card>
        </View>
      )}
      <View style={styles.container}>
        <View style={{
          width: 30,
          backgroundColor: 'transparent',
          position: 'absolute',
          top: 10,
          right: 20,
          zIndex: 5,
        }}
        >
          <TouchableOpacity onPress={() => setIsVisible(true)}>
            <Text style={{backgroundColor: 'white', borderRadius: 100, padding: 10, width: 50}}><IonIcons name="list" size={25} /></Text>
          </TouchableOpacity>
        </View>
        <MapboxGL.MapView
          showUserLocation
          zoomLevel={50}
          userTrackingMode={MapboxGL.UserTrackingModes.Follow}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <MapboxGL.Camera
            zoomLevel={10}
            centerCoordinate={[currentLongitude || 0, currentLatitude || 0]}
          />
          {
            hasPermision && (
            <MapboxGL.UserLocation
              visible
              onUpdate={(location) => {
                if (Math.abs(location.coords.longitude - currentLongitude) >= 0.001) {
                  setCurrentLongitude(location.coords.longitude);
                }
                if (Math.abs(location.coords.latitude - currentLatitude) >= 0.001) {
                  setCurrentLatitude(location.coords.latitude);
                }
              }}
            />
            )
          }
          {
            locations.map((location) => (
              <Marker
                key={`key${location.company_id}`}
                coordinate={location.location.split(',').reverse().map((s) => parseFloat(s))}
                com={location}
              />
            ))
          }
        </MapboxGL.MapView>
        <BottomSheet
          isVisible={isVisible}
          containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.3)', borderColor: 'green', borderWidth: 2, zIndex: 10 }}
        >
          <View style={{position: 'absolute', top: 10, right: 10, zIndex: 100}}><TouchableOpacity onPress={() => setIsVisible(false)}><Text><IonIcons name="close" size={30} /></Text></TouchableOpacity></View>
          {locations.map((l, i) => (
            <ListItem key={`key${l.company_id}`}>
              <ListItem.Content>
                <ListItem.Title style={{padding: 10}}>{l.name}</ListItem.Title>
                <ListItem.Subtitle>
                  {`المسافة: ${l.distance} متر`}
                  <IonIcons name="location" size={15} />
                </ListItem.Subtitle>
                <ListItem.Subtitle>
                  {`العنوان: ${l.address}`}
                  <IonIcons name="bookmark" size={15} />
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
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
  },
  touchableContainer: {
    alignItems: 'center',
  },
  touchable: {
    backgroundColor: 'blue',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  touchableText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
});
export default Map;
