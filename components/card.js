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
  Image,
  TouchableNativeFeedback,
} from 'react-native';

import IonIcon from 'react-native-vector-icons/Ionicons';

import {
  Rating, Avatar,
} from 'react-native-elements';

import Constants from '../constants';

const Card = ({
  type,
  offer,
  navigation_function,
  style,
  isDashboard,
}) => (
  <>
    {type === 'flat'
      ? (
        <TouchableNativeFeedback onPress={() => {
          console.log(isDashboard, "here !");
          if (isDashboard === true) {
            navigation_function('post', { offer: { ...offer } });
          } else {
            navigation_function('dashboard', {
              screen: 'post',
              params: { offer: { ...offer } },
            });
          }
        }}
        >
          <View style={{
            display: 'flex', flexDirection: 'row', padding: 15, ...style,
          }}
          >
            <Image
              source={{
                uri: offer.image ? offer.image_url
                  : 'https://freepikpsd.com/wp-content/uploads/2019/10/empty-image-png-7-Transparent-Images.png',
              }}
              style={{ width: '100%', height: 300, borderRadius: 10 }}
            />
            <View style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Text style={{
                fontSize: 20, borderBottomWidth: 1, borderBottomColor: '#dfdfdf', marginBottom: 10, padding: 3,
              }}
              >
                {offer.name}
              </Text>
              {offer.company_name
                && (
                <Text style={{
                  backgroundColor: '#0cf', padding: 5, width: '95%', margin: 10, textAlign: 'center', borderRadius: 10, fontSize: 11,
                }}
                >
                  {offer.company_name}
                </Text>
                )}
              <Text style={{ fontSize: 12 }}>
                {' '}
                <Rating
                  imageSize={15}
                  readonly
                  startingValue={offer?.avg_rating === '' ? 0 : offer.avg_rating}
                  style={styles.rating}
                />
                {' '}
                {offer.avg_rating === '' ? 0 : offer.avg_rating}
                /5.0
              </Text>

              <Text style={{ fontSize: 15, fontFamily: 'Helvetica', padding: 5 }}>{offer.offer_description}</Text>
              <Text style={styles.tag}>
                <IonIcon
                  name="time-outline"
                  color="#000"
                  style={styles.icon}
                  size={18}
                />
                {offer.remaining_days}
              </Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      )

      : (
        <TouchableNativeFeedback onPress={() => { navigation_function('post', { offer: offer }); }}>
          <View style={style}>
            <View>
              <Avatar
                source={{
                  uri: offer.image ? offer.image_url
                    : 'https://freepikpsd.com/wp-content/uploads/2019/10/empty-image-png-7-Transparent-Images.png',
                }}
                size="large"
                style={{ width: 200, height: 200 }}
              />
            </View>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              position: 'relative',
              backgroundColor: '#999',
              padding: 10,
            }}
            >
              <View>
                <Text style={styles.tag}>
                  <IonIcon
                    name="time-outline"
                    style={styles.icon}
                    size={20}
                  />
                  {offer.remaining_days}
                </Text>
              </View>
              {/*
                <View>
                    <Text style={styles.tag}>
                        {props.offer.offer_category}
                        <Icon
                            name='tag'
                            color='#cfcfcf'
                            style={styles.icon}
                            size={16}
                        />
                    </Text>
                </View>
                */}
              <View style={{
                position: 'absolute',
                backgroundColor: Constants.GREEN_COLOR,
                padding: 10,
                top: -200,
                left: 0,
                borderRadius: 10,
                width: 200,
                margin: 0,
              }}
              >
                <Text style={{ color: '#000', fontWeight: '900', fontSize: 15 }}>{offer.name.substr(0, 25)}</Text>
              </View>
              <View style={{
                position: 'absolute',
                backgroundColor: '#0cf',
                padding: 5,
                top: -30,
                borderRadius: 10,
                right: 20,
              }}
              >
                <Text style={{ color: '#444', fontWeight: '600', fontSize: 11 }}>{offer.company_name}</Text>
              </View>
            </View>
          </View>

        </TouchableNativeFeedback>
      )}
  </>
);

const styles = StyleSheet.create({

  tag: {
    color: '#000',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 17,
    paddingRight: 10,
  },
  icon: {
    color: '#000',
  },
});

export default Card;
