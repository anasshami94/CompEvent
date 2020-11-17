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
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
  SafeAreaView,
  Picker,
  Modal
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'

import DateTimePicker from '@react-native-community/datetimepicker'
import {Rating, AirbnbRating, Divider, ListItem } from "react-native-elements"
import axios from 'axios'

import {getToken} from '../storage'

import Constants from '../constants'
import { FlatList } from 'react-native-gesture-handler';

import {CommentModal, CompanyModal} from '../components/modals'

const queryString = require('query-string');

import moment from 'moment';
import ar from 'moment/locale/ar'
moment.locale("ar", ar);

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height



const Card = ({navigation, route}) => {
  const query_offer = route.params.offer
  var [offer, setOffer] = React.useState(query_offer)
  var [option, setOption] = React.useState("")
  var [optionList, setOptionList] = React.useState([])
  var [isLoading, setIsloading] = React.useState(false)
  var [refreshing, setRefreshing] = React.useState(false)
  const [modalVisible, setModalVisible] = React.useState(false);
  const [companyModalVisible, setCompanyModalVisible] = React.useState(false);
  var [show_date, setShowDate] = React.useState(false) 
  var [date, setDate] = React.useState(new Date())
  let scrollViewRef = React.createRef()

  var end_scroll = 0

  const saveEvent = async () => {
        let token = await getToken()
        token = JSON.parse(token)
        let data = await axios.post(Constants.API_HOST + 'common/saved_events.php', queryString.stringify({
            usermobile_id: token.usermobile_id,
            auth_code: token.auth_key,
            action: "add",
            event_id: offer.event_id
        }))
        if(data.data.call_status) {
            ToastAndroid.showWithGravity("تم اضافة الحملة للمحفوظات", ToastAndroid.LONG, ToastAndroid.CENTER)
        } else {
            
            ToastAndroid.showWithGravity("لا يمكن اضافة الحملة للمحفوظات", ToastAndroid.LONG, ToastAndroid.CENTER)
        }
  }
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS === 'ios');
        setDate(currentDate);
    };
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
                console.log(offer_api)
                let days_arr = offer_api.remaining_days.split("<->")
                await setOffer({
                    ...offer_api,
                    company_id: offer_api.company_id, 
                    company_name: offer_api.company_name,
                    images: offer_api.images,
                    remaining_days:  moment(days_arr[1]).locale('ar').fromNow(),
                    image: query_offer.image
                    })
                
                //for testing
                /*
                await setOffer({
                    ...offer,
                    event_attributes: [
                        {
                            attribute_group_id: 10,
                            name: "حملة 1",
                            attribute: [{
                                attribute_id: 11,
                                name: "الصفة الاولى",
                                text: "قيمة الصفة"
                            },
                            {
                                attribute_id: 12,
                                name: "الصفة الثانية",
                                text: "قيمة الصفة"
                            }]
                        },
                        {
                            attribute_group_id: 15,
                            name: "حملة 2",
                            attribute: [{
                                attribute_id: 13,
                                name: "الصفة الاولى",
                                text: "قيمة الصفة"
                            }]
                        },
                        {
                            attribute_group_id: 20,
                            name: "حملة 3",
                            attribute: [{
                                attribute_id: 15,
                                name: "الصفة الاولى",
                                text: "قيمة الصفة"
                            },
                            {
                                attribute_id: 22,
                                name: "الصفة العاشرة",
                                text: "قيمة الصفة"
                            },
                        ]
                        }
                    ]
                })*/
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
        isLoading ? (
        <View style={{display: 'flex', flex: 1, justifyContent:'center'}}> 
          <ActivityIndicator size="large" color="#00ff00" /> 
      </View>
      ) : 
        (
                <>
                <ScrollView
                contentContainerStyle={{flexGrow:1}}
                onContentSizeChange={(width, height) => {end_scroll = height}}
                refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} 
                />
                }
                ref={scrollViewRef}
                > 
                <CommentModal modalVisible={modalVisible} setModalVisible={setModalVisible} event_id={offer?.event_id}/>
                <CompanyModal modalVisible={companyModalVisible} setModalVisible={setCompanyModalVisible} company_id={offer.company_id} navigation={navigation}/>
                <View style={{padding: 5}}>
                    <View style={{height: 300}}>
                        <Image 
                            source={{uri: offer.image ? offer.image_url: 
                                    "https://freepikpsd.com/wp-content/uploads/2019/10/empty-image-png-7-Transparent-Images.png"}}
                            style={{width: '100%', height: "100%", borderRadius: 10, borderWidth: 1, borderColor: '#ccc'}}/>
                    </View>
                    
                    <View style={{width: '100%', flex: 1, marginBottom: 30}}>
                        <View style={{flexDirection: "row", alignItems: 'center'}}>
                            <Ionicons name="chevron-back-outline" size={20}/>
                            <Text style={{padding: 10,}}>{offer.name}</Text>
                        </View>
                        <TouchableNativeFeedback onPress={()=> setCompanyModalVisible(true)}>
                            <View style={{backgroundColor: "#fff", width: "90%", marginLeft:10 }}>
                                <Text style={{color: '#0d3', fontWeight: '600', fontSize: 19, margin: 10}}>{offer.company_name}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={{color: '#fff', flex: 1,  flexWrap:'wrap', flexDirection: 'row'}}>
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
                    
                    <TouchableNativeFeedback
                        onPress={async () => {await saveEvent()}}>
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
                    <TouchableNativeFeedback onPress={() => {scrollViewRef.current.scrollTo({x: 0, y: end_scroll, animated: true})}}>
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
                    <TouchableNativeFeedback onPress={() => setModalVisible(true)}>
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
                     <View style={{...styles.tagWrapper , maxWidth: '60%', alignSelf: 'center'}}>
                        <Text style={styles.tag}>{parseInt(offer.avg_rating) || 0} / 5</Text>
                        <Rating imageSize={20}
                                readonly 
                                startingValue={parseInt(offer.avg_rating) || 0}
                                tintColor="#ddd"
                            />
                        <Text style={styles.tag}>({offer.reviews_count}) تقييم</Text>
                    </View>
                </View>
                   {offer?.event_attributes?.length ? 
                   (<View style={{display: 'flex', flex: 1, alignItems: 'center'}}>
                       <View style={{flex: 1}}>   
                        <Text style={{
                            padding: 15,
                            marginTop: 15,
                            borderRadius: 5,
                            backgroundColor: Constants.GREEN_COLOR,
                            textAlign: 'center'
                        }}>بيانات الحملة</Text>
                        { 
                        offer.event_attributes.map((event_attribute) => (
                            <View key={event_attribute.attribute_group_id}>
                                <View style={{borderWidth: 1, borderColor: "#ddd"}}>

                                    <Text style={{
                                        padding: 15,
                                        textAlign: 'center'
                                    }}>{event_attribute.name}</Text>
                                </View>
                                {event_attribute.attribute.map((attribute)=>
                                <View style={{flexDirection: 'row', borderWidth: 1, borderColor: "#ddd"}} key={attribute.attribute_id}>
                                    <View style={styles.key}><Text>{attribute.name}</Text></View>
                                <View style={styles.value}><Text>{attribute.text}</Text></View>
                                </View>
                                )}
                            </View>
                        ))
                        }
                       </View>
                       
                   </View>) : <></>
                   }
                   <Divider style={{ backgroundColor: '#aaa', marginTop: 25, marginBottom: 25}} />
                    <View style={{display: 'flex', flex: 1, padding: 15}}>
                        <View style={{display: 'flex', flex: 1, flexDirection:'row', marginBottom: 15}}>
                            <Ionicons name="list" size={20} color={Constants.GREEN_COLOR}/>
                            <Text style={{paddingRight: 15, fontWeight: "bold"}}>
                                خيارات الاستفادة من الحملة
                            </Text>
                        </View>
                        <View>
                            <TextInput placeholder="اسم الاستفادة" style={{borderWidth: 1, borderColor: "#ddd", 
                        borderRadius: 10}}/>
                            <View style={{ marginTop: 10, width: '100%', borderWidth: 1, borderRadius: 10, borderColor: '#888'}}>
                                <Picker selectedValue={option}
                                    onValueChange={(itemValue, itemIndex) => setCat(itemValue)} 
                                    >

                                    { optionList.map((item, key)=>(
                                        <Picker.Item label={item.label} value={item.value} key={key} />)
                                    )}

                                </Picker>
                            </View>
                            <View style={{ marginTop: 10, marginBottom: 10, width: '100%'}}>
                                {show_date && (
                                <DateTimePicker
                                testID="dateTimePicker"
                                timeZoneOffsetInMinutes={0}
                                value={date}
                                mode="datetime"
                                is24Hour={false}
                                display="spinner"
                                onChange={onChangeDate}
                                />
                            )}
                            <TouchableOpacity onPress={() => setShowDate(true)} 
                                                style={{padding: 10, width: 130, borderRadius: 15,
                                                        backgroundColor: '#fafafa', borderWidth: 1,
                                                        height: 45,
                                                        borderColor: '#cfcfcf', width: "100%"}}> 
                                <Text style = {{color: '#333', fontSize: 15, textAlign:'left'}}> 
                                <Ionicons name="calendar" size={15}/> {date.toLocaleString('ar-EG')}
                                </Text>
                            </TouchableOpacity >
                            </View>

                        </View>
                        <TouchableNativeFeedback>
                            <Text style={{textAlign: 'center', padding: 15, backgroundColor: Constants.GREEN_COLOR, 
                                        borderRadius: 10, color: 'white'}}>متابعة</Text>
                        </TouchableNativeFeedback>
                    </View>
                    
                </View>
         </ScrollView>
         </>
    )
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
        flexGrow: 1,
        margin: 5,
        borderRadius: 10,
     },
    icon: {
        marginLeft: 5,
        color: '#0c3',
    },
    key :{
        width: '35%',
        borderRightWidth: 1,
        padding: 20,
        borderColor: "#ddd"
    },
    value :{
        width: '55%',
        padding: 20
    }
});

export default Card;
