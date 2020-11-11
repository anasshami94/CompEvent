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
  ActivityIndicator,
  RefreshControl,
  SafeAreaView
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'

import {Rating, AirbnbRating } from "react-native-elements"
import axios from 'axios'

import {getToken} from '../storage'

import Constants from '../constants'

const queryString = require('query-string');

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


const Card = ({navigation, route}) => {
  const query_offer = route.params.offer
  var [offer, setOffer] = React.useState(query_offer)
  var [isLoading, setIsloading] = React.useState(false)
  var [refreshing, setRefreshing] = React.useState(false)
  const loadData= ()=> {

    setIsloading(true)
      getToken().then((token) => {
            token = JSON.parse(token)
            axios.post(Constants.API_HOST + 'common/event.php', queryString.stringify({
                usermobile_id: token.usermobile_id,
                auth_code: token.auth_key,
                event_id: query_offer.event_id,
                language_id: Constants.ARABIC
            })).then(async data => {
                let offer_api = data.data
                await setOffer({...offer, 
                    compony_id: offer_api.company_id, 
                    views: offer_api.views, 
                    reward: offer_api.reward,
                    reviews_count: offer_api.reviews_count,
                    event_options: offer_api.event_options,
                    images: offer_api.images,
                    event_attributes: offer_api.event_attributes,

                    })
                setIsloading(false)
            }).catch(err => {})
        }).catch((err)=>console.log(err))
  }
  const onRefresh = React.useCallback(async() => {
    await loadData()
  }, []);
  React.useEffect(() => {
        loadData()
    return ()=> {
        setOffer({})
    }
  },[])
  
  return (
        <SafeAreaView style={{flex: 1}}>
        {isLoading ? (
        <View style={{display: 'flex', flex: 1, justifyContent:'center'}}> 
          <ActivityIndicator size="large" color="#00ff00" /> 
      </View>
      ) : 
        (
        <ScrollView
        contentContainerStyle={{flex: 1}}
        alwaysBounceVertical={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >  
                <View style={{height: '60%'}}>
                    <Image 
                        source={{uri: offer.image ? offer.image_url: 
                                "https://freepikpsd.com/wp-content/uploads/2019/10/empty-image-png-7-Transparent-Images.png"}}
                        style={{width: '100%', height: "100%", borderRadius: 10, borderWidth: 1, borderColor: '#ccc'}}/>
                </View>
                <View style={{flexDirection:'column', width: '100%'}}>
                    <View style={{flexDirection: "row", alignItems: 'center'}}>
                        <Ionicons name="chevron-back-outline" size={20}/>
                        <Text style={{padding: 10,}}>{offer.name}</Text>
                    </View>
                    <View>
                        <Text style={{color: '#0d3', fontWeight: '600', fontSize: 19, margin: 10}}>{offer.company_name}</Text>
                    </View>
                </View>
                <View style={{color: '#fff', flexGrow: 1, flexDirection:'row', flexWrap: 'wrap'}}>
                     <View style={styles.tagWrapper}>
                        <Ionicons
                                name='calendar'
                                color='#0c3'
                                style={styles.icon}
                                size={20}
                            />
                        <Text style={styles.tag}>
                            {offer.remaining_days}
                        </Text> 
                     </View>
                     <View style={styles.tagWrapper}>
                        <Ionicons
                            name='eye'
                            style={styles.icon}
                            size={20}
                        />
                        <Text style={styles.tag}>
                            {offer.views}
                        </Text>
                    </View>
                     <View style={styles.tagWrapper}>
                        <Ionicons
                            name='star'
                            style={styles.icon}
                            size={20}
                        />
                        <Text style={styles.tag}>
                            {offer.reward}
                        </Text>
                    </View>
                    
                    <TouchableNativeFeedback>
                        <View style={{...styles.tagWrapper, backgroundColor: "#0c3"}}>
                            <Ionicons
                                name='bookmark'
                                color="#fff"
                                size={20}
                            />
                            <Text style={{...styles.tag, color: '#fff'}}>
                                حفظ
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback>
                        <View style={{...styles.tagWrapper, backgroundColor: "#0c3"}}>
                            <Ionicons
                                name='cart'
                                size={20}
                                color="#fff"
                            />
                            <Text style={{...styles.tag, color: '#fff'}}>
                                الاستفادة من الحملة
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback>
                        <View style={{...styles.tagWrapper, backgroundColor: "#0c3"}}>
                            <Ionicons
                                name='send-sharp'
                                color="#fff"
                                size={20}
                            />
                            <Text style={{...styles.tag, color: '#fff'}}>
                                اضافة تعليق
                            </Text>

                        </View>
                    </TouchableNativeFeedback>
                     <View style={{...styles.tagWrapper, maxWidth: '60%', alignSelf: 'center'}}>
                        <Text style={styles.tag}>{offer.avg_rating || 0} / 5</Text>
                        <Text style={styles.tag}>
                            <Rating imageSize={15}
                            readonly
                            ratingColor='#3498db'
                            type='custom'
                            ratingCount={5} fractions={1} startingValue={offer.avg_rating || 0}
                            tintColor="#ccc"
                             />
                        </Text>
                        <Text style={styles.tag}>(143567) تقييم</Text>
                    </View>
                </View>
        </ScrollView>
    )}
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tag: {
        fontSize: 10,
        padding: 10,
        color: '#555',
        fontWeight: 'bold',
    },
    tagWrapper: {
        borderWidth: 1,
        borderColor: Constants.GREEN_COLOR,
        color: '#fff' , 
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        flexGrow: 1,
        margin: 5,
        borderRadius: 10,
     },
    icon: {
        marginLeft: 5,
        color: '#0c3',
    }
});

export default Card;
