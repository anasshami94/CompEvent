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
  Image
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign'

import {Rating, AirbnbRating } from "react-native-elements"



import {
  Actions
} from 'react-native-router-flux';

import Constants from '../constants'
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
console.log(width)


const Card = (props) => {
  
  return (
    <>
        {props.type == 'flat' ? 
        (<View style={{display:'flex', flexDirection:'row', padding: 15,...props.style}}>
            <Image 
                source={{uri: props.offer.offer_img || 
                        "https://freepikpsd.com/wp-content/uploads/2019/10/empty-image-png-7-Transparent-Images.png"}}
                style={{width: 150, height: 150, borderRadius: 10}}></Image>
            <View style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                <Text style={{fontSize: 20}}>{props.offer.offer_name}</Text>
                <Text style={{fontSize: 12}}> <Rating imageSize={15} readonly startingValue={props.offer.offer_rate} style={styles.rating} />  {props.offer.offer_rate}/5.0</Text>
                <Text style={{backgroundColor: "#0cf", padding: 5, width: "50%", margin:  10, textAlign: "center", borderRadius: 10}}>{props.offer.offer_price} شيكل</Text>
                <Text>{props.offer.offer_description}</Text>
            </View>
        </View>) : 
        (<View style={props.style}>
            <Image 
                source={{uri: props.offer.offer_img || 
                        "https://freepikpsd.com/wp-content/uploads/2019/10/empty-image-png-7-Transparent-Images.png"}}
                style={{width: 200, height: 200, borderRadius: 10}}></Image>
            
            <View style={{display: 'flex', flexDirection: 'row', alignItems:'center',
                        justifyContent:'space-around', position: 'relative',
                        backgroundColor: '#999', padding: 10}}>
                <View>
                    <Text style={styles.tag}>
                        {props.offer.offer_timeout}
                        <Icon
                            name='calendar'
                            color='#cfcfcf'
                            style={styles.icon}
                            size={16}
                        />
                    </Text>
                </View>
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
                <View style={{position: 'absolute', backgroundColor: Constants.GREEN_COLOR, padding: 10, 
                            top: -200, left: 0, borderRadius: 10, opacity: 0.75, width: 200, margin: 0}}>
                    <Text style={{color: '#000', fontWeight: '600', fontSize: 20}}>{props.offer.offer_name}</Text>
                </View>
                <View style={{position: 'absolute', backgroundColor: "#0cf", padding: 5, 
                            top: -50, borderRadius: 10, opacity: 0.8}}>
                    <Text style={{color: '#444', fontWeight: '600', fontSize: 19}}>{props.offer.offer_price} شيكل</Text>
                </View>
            </View>
        </View>)}
    </>
  );
};

const styles = StyleSheet.create({
  
  tag: {
        color: '#fff',
        display: 'flex',
        justifyContent:'center',
        fontSize: 18
    }
});

export default Card;
