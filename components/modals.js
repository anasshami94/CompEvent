/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  StyleSheet,
  Image,
  Picker,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'

import {Rating, AirbnbRating, ListItem, Divider, CheckBox } from "react-native-elements"
import axios from 'axios'

import {getConstants, getToken} from '../storage'

import Constants from '../constants'
import Card from '../components/card';
import moment from 'moment';
import ar from 'moment/locale/ar'
moment.locale("ar", ar);
const queryString = require('query-string');



export const CommentModal = ({modalVisible, setModalVisible, event_id}) => {
    var [reviews, setReviews] = React.useState([])
    var [review, setReview] = React.useState({})
    var [loading, setLoading] = React.useState(true)

    const loadReviews = React.useCallback(async() => {
        await setLoading(true)
        var token = await getToken()
        token = JSON.parse(token)
        var data = await axios.post(Constants.API_HOST + 'common/reviews.php', queryString.stringify({
            usermobile_id: token.usermobile_id,
            auth_code: token.auth_key,
            event_id: event_id,
            language_id: Constants.ARABIC,
            action: "get_list",
            start: 0,
            limit: 5
        }))
        await setReviews(data.data)
        await setLoading(false)

    },[])

    var addReview = async () => {
        var token = await getToken()
        token = JSON.parse(token)
        if(!review.text || review.text == "") {
            ToastAndroid.showWithGravity("الرجاء كتابة نص التقييم", ToastAndroid.SHORT, ToastAndroid.CENTER)
            return
        }
        if(!review.rating || review.rating == 0) {
            ToastAndroid.showWithGravity("الرجاء ادخال التقييم", ToastAndroid.SHORT, ToastAndroid.CENTER)
            return
        }
        var data = await axios.post(Constants.API_HOST + 'common/reviews.php', queryString.stringify({
            usermobile_id: token.usermobile_id,
            auth_code: token.auth_key,
            event_id: event_id,
            action: "add",
            text: review.text,
            rating: review.rating
        }))
        if(data.data.call_status == true){
         ToastAndroid.showWithGravity("تم اضافة التقييم", ToastAndroid.SHORT, ToastAndroid.CENTER)
        } else {
            
         ToastAndroid.showWithGravity("لم يتم اضافة التقييم", ToastAndroid.SHORT, ToastAndroid.CENTER)
        }
        await setReview({})
        await loadReviews();
        
    }

    React.useEffect(() => {
        loadReviews()
        return () => {
            setReviews([])
        }
    },[loadReviews])
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            transparent={true}
            onDismiss={()=>{setModalVisible(false);}}
        >
            <View 
            style={{
                display: 'flex',
                justifyContent: 'center',
                height: '85%',
                margin: 5,
                marginTop: 60,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10
            }}>
            { loading ? (
                    <View style={{display: 'flex', flex: 1, justifyContent:'center'}}> 
                        <ActivityIndicator size="large" color="#00ff00" /> 
                    </View>) :  
            (<View style={{display: 'flex', flex: 1, flexDirection:'column', padding: 0}}>
                <Text style={{backgroundColor: Constants.GREEN_COLOR, padding: 15, 
                            borderTopEndRadius: 10,
                            borderTopStartRadius: 10,
                            textAlign: 'center', color: '#fff'}}>اضافة تعليق</Text>
                <ScrollView visible>
                <View style={{flex: 1}}>
                    <View>
                        <AirbnbRating
                            count={5}
                            reviews={[
                                "سيء",
                                "متوسط",
                                "جيد",
                                "جيد جدا",
                                "ممتاز"
                            ]}
                            defaultRating={0}
                            onFinishRating={(rating)=>{setReview({...review, rating: rating})}}
                            size={20}
                            />
                    </View>
                    <View style={{borderWidth: 1, margin: 5, padding: 15, 
                                borderColor: "#aaa", borderRadius:10}}>
                        <TextInput placeholder="اضف نص التعليق" 
                        style={{justifyContent:'flex-start', height: 150, textAlignVertical: 'top',}}
                        underlineColorAndroid="transparent"       
                        multiline = {true}
                        numberOfLines = {5}
                        placeholderTextColor="grey"
                        value={review?.text}
                        onChangeText={(text)=> setReview({...review, text: text})}
                        />
                    </View>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <TouchableOpacity
                        style={{flex: 1, }}
                        onPress={async() => {
                            await addReview();
                        }}
                        >
                        <Text 
                        style={{ padding: 15, backgroundColor: Constants.GREEN_COLOR, color: '#fff', 
                                margin: 15, textAlign: 'center', borderRadius: 10}}
                        >اضافة</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => {
                            setModalVisible(!modalVisible);
                        }}
                        >
                        <Text 
                        style={{ padding: 15, backgroundColor: "#2196F3", color: '#fff', 
                                margin: 15, textAlign: 'center', borderRadius: 10 }}
                        >الرجوع</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    {
                        reviews.map((l, i) => (
                        <ListItem key={i} bottomDivider>
                            <ListItem.Content>
                                <ListItem.Title>{l.usermobile_name}</ListItem.Title>
                                <ListItem.Subtitle>
                                {l.date_added}
                                </ListItem.Subtitle>
                                <View>
                                    <Rating
                                        readonly
                                        startingValue={parseInt(l.rating) || 0}
                                        size={10} 
                                    />
                                </View>
                                <Text>{l.text}</Text>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                        ))
                    }
                </View>
                </ScrollView>
            </View>
            ) }
            </View>
        </Modal>
    )
}


export const CompanyModal = ({modalVisible, setModalVisible, company_id, navigation}) => {
    var [company, setCompany] = React.useState({})
    var [company_events, setEvents] = React.useState([])
    var [loading, setLoading] = React.useState(true)
    const isMountedRef = React.useRef(null);
    const loadCompany = React.useCallback(async() => {
        await setLoading(true)
        var token = await getToken()
        token = JSON.parse(token)
        var constants = await getConstants();
        constants = JSON.parse(constants)
        var data = await axios.post(Constants.API_HOST + 'common/company.php', queryString.stringify({
            usermobile_id: token.usermobile_id,
            auth_code: token.auth_key,
            company_id: company_id,
            language_id: Constants.ARABIC,
            action: "company_data"
        }))
        data.data['image_uri'] = constants.image_directory + '/' + data.data['image']
        await setCompany(data.data)
        await setLoading(false)

    },[])

    const loadCompEvents = React.useCallback(async() => {
        await setLoading(true)
        var token = await getToken()
        token = JSON.parse(token)
        var data = await axios.post(Constants.API_HOST + 'common/company.php', queryString.stringify({
            usermobile_id: token.usermobile_id,
            auth_code: token.auth_key,
            company_id: company_id,
            language_id: Constants.ARABIC,
            action: "company_events",
            start: 0,
            limit: 5,
        }))
        
        let events = data.data.map((element) => {
            let days_str = element.remaining_days;
            let days_arr = days_str.split('<->');
            return {
            ...element,
            remaining_days:  moment(days_arr[1]).locale('ar').fromNow(),
            }
        });
        await setEvents(events)
        await setLoading(false)

    },[])

    React.useEffect(() => {
        isMountedRef.current = true;
        if(isMountedRef) {
            loadCompany()
            loadCompEvents()
        }
        return () => {
            setCompany({})
            setEvents([])
            setLoading(false)
            isMountedRef.current = false;
        }
    },[loadCompany, loadCompEvents])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            transparent={true}
            onDismiss={()=>{setModalVisible(false);}}
        >
            <View 
            style={{
                display: 'flex',
                justifyContent: 'center',
                height: '85%',
                margin: 5,
                marginTop: 60,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10
            }}>
            { loading ? (
                    <View style={{display: 'flex', flex: 1, justifyContent:'center'}}> 
                        <ActivityIndicator size="large" color="#00ff00" /> 
                    </View>) :  
            (<View style={{display: 'flex', flex: 1, flexDirection:'column', padding: 0}}>
                            <View style={{backgroundColor: Constants.GREEN_COLOR, padding: 15, 
                                          borderTopEndRadius: 10,
                                          borderTopStartRadius: 10, flexDirection:'row', justifyContent: 'center',
                                          alignItems: 'center'}}>
                                <Text style={{color: '#fff', flex: 2, textAlign: 'center'}}>
                                    معلومات الشركة
                                </Text>
                                <Ionicons name="close" size={20}  style={{alignSelf: 'flex-end'}} onPress={()=>setModalVisible(false)}/>
                            </View>
                <ScrollView visible>
                <View style={{flex: 1}}>
                    <View>
                        <Image source={{uri: company.image ? company.image_uri : "https://freepikpsd.com/wp-content/uploads/2019/10/empty-image-png-7-Transparent-Images.png"}}
                                style={{width: "100%", height: 200}}/>
                    </View>
                    <View style={{margin: 5, padding: 15, borderRadius:10}}>
                       <Text style={{fontSize: 20}}>{company.company_name || "اسم الشركة"}</Text>
                    </View>
                    <View style={{margin: 5, padding: 10, borderRadius:10}}>
                       <Text style={{color: "#aaa", fontSize: 16}}>{company.about || "معلومات عن الشركة"}</Text>
                    </View>
                    <View style={{margin: 5, padding: 15, borderRadius:10, justifyContent:'flex-start', flexDirection: 'row', alignItems: 'center'}}>
                       <Ionicons name="call" size={20} style={{backgroundColor: Constants.GREEN_COLOR, color: "white", marginRight: 10, borderRadius: 2}}/>
                       <Text style={{fontSize: 16}}>{company.phone || "059000000"}</Text>
                    </View>
                    { 
                    company.shipping ? (
                     <View style={{margin: 5, padding: 15, borderRadius:10, justifyContent:'flex-start', flexDirection: 'row', alignItems: 'center'}}>
                       <Ionicons name="bus" size={25} color={Constants.GREEN_COLOR} style={{ marginRight: 10}}/>
                       <Text style={{fontSize: 16}}>خدمة الطلب اونلاين والتوصيل</Text>
                    </View>) : <></> 
                    }
                     <View style={{margin: 5, padding: 15, borderRadius:10, justifyContent:'flex-start', flexDirection: 'row', alignItems: 'center'}}>
                       <Ionicons name="location" size={25} color={Constants.GREEN_COLOR} style={{ marginRight: 10}}/>
                       <Text style={{fontSize: 16}}>{company.address || "نابلس - جامعة النجاح"}</Text>
                    </View>
                    <View style={{margin: 5, padding: 15, borderRadius:10, justifyContent:'flex-start', flexDirection: 'row', alignItems: 'center'}}>
                       <Ionicons name="time" size={25} color={Constants.GREEN_COLOR} style={{ marginRight: 10}}/>
                       <Text style={{fontSize: 16}}>{company.working_time || "لا يعمل في اي وقت"}</Text>
                    </View>
                    <View style={{margin: 5, padding: 15, borderRadius:10, justifyContent:'flex-start', flexDirection: 'row', alignItems: 'center'}}>
                       <Ionicons name="star" size={25} color={Constants.GREEN_COLOR} style={{ marginRight: 10}}/>
                       <Text>(تقييم {company.reviews_count})</Text>
                       <Rating 
                        startingValue={company.avg_rating || 0}
                        readonly
                        size={10}
                        
                       />
                       <Text>{company.avg_rating}/5</Text>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <Divider style={{flex: 1, color: "#aaa", margin: 30}}/>
                    <View style={{flexDirection: "row", marginLeft: 15, }}>
                        <Ionicons  name="caret-back" size={25} color={Constants.GREEN_COLOR}/>
                        <Text style={{fontSize: 18, textAlign:'left'}}>الحملات الحالية </Text>
                    </View>
                    {
                        company_events.map((event, i) => (
                            <Card offer={event} key={`event_${event.event_id}`} style={styles.flatcard} type='flat' navigation_function={navigation.replace}/>
                        ))
                    }
                </View>
                </ScrollView>
            </View>
            ) }
            </View>
        </Modal>
    )
}


export const FiltersModal = ({modalVisible, setModalVisible, filtersData, invokeGetEvents}) => {
    const [selectedFilter, setSelectedFilter] = React.useState({})
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onDismiss={()=>setModalVisible(false)}
        >
            <View 
            style={{
                display: 'flex',
                height: '100%',
                marginTop: 55,
                borderWidth: 1,
                borderColor: '#ddd',
            }}>
            <View style={{padding: 10, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row'}}>
                <Ionicons name="square" size={20} color={Constants.GREEN_COLOR}/>
                <Text style={{paddingRight: 5, fontSize: 17}}>
                    قسم فرعي 1
                </Text>
            </View>
            <View style={{backgroundColor: "#0009", flexDirection: 'row-reverse', 
                        justifyContent: 'flex-end', flex: 1}}>
                 <View style={{backgroundColor: '#0008', flex: 2, }}>
                     <TouchableOpacity onPress={()=>{
                         invokeGetEvents(selectedFilter)
                         setModalVisible(false)
                         }}>
                         <Text style={{color: "white", backgroundColor: Constants.GREEN_COLOR, 
                                      textAlign: "center", padding: 5, margin: 5,
                                      borderRadius:15}}>فلتر</Text>
                     </TouchableOpacity>
                    {
                        filtersData.filter_group_data?.map((header_filter, i) => (
                            <View key={`filter_${header_filter.filter_group_id}`}>
                                <Text style={{color: "white", size: 18, fontWeight: "bold", padding: 5}}>{header_filter.name}</Text>
                                <View>
                                {
                                    header_filter.filter?.map((filter, j) => 
                                    (<View key={`filter_${header_filter.filter_group_id}_${filter.filter_id}`}>
                                        <CheckBox
                                            iconLeft
                                            iconType="ionicon"
                                            checkedIcon='checkmark-circle'
                                            uncheckedIcon='ellipse'
                                            checkedColor='green'
                                            color='green'
                                            checked={selectedFilter[`filter_${header_filter.filter_group_id}_${filter.filter_id}`] ? true: false}
                                            title={filter.name}
                                            containerStyle={{backgroundColor: "#555", borderWidth: 0}}
                                            textStyle={{color: "#fff"}}
                                            onPress={()=>{
                                                let name = `filter_${header_filter.filter_group_id}_${filter.filter_id}`;
                                                
                                                if(selectedFilter[name]) {
                                                    let selectedFilterTemp = {...selectedFilter}
                                                    delete selectedFilterTemp[name]
                                                    setSelectedFilter(selectedFilterTemp)
                                                }
                                                else
                                                   setSelectedFilter({...selectedFilter, 
                                                    [name]: {
                                                            filter_id: filter.filter_id,
                                                            group_filter_id: header_filter.filter_group_id,
                                                            name: name,
                                                            category_id: filtersData.category_id
                                                        }
                                                    })
                                            }}
                                            />
                                    </View>)
                                    )
                                }
                                </View>
                            </View>
                        
                        )
                        )
                    }
                </View>
                <View style={{flex: 1}}></View>
            </View>
            </View>
        </Modal>
    )
}

export const AttendaceModal = ({modalVisible, setModalVisible, attendaceInfo, offerInfo, date, navigation}) => {
    var [address, setAddress] = React.useState({})
    var [zones, setZones] = React.useState([])
    var [countries, setCountries] = React.useState([])
    const placeAttendace = async() => {
        var token = await getToken()
        token = JSON.parse(token)
        let options = Object.keys(attendaceInfo.options).map(key => [key, offerInfo.options[key]])
        var data = await axios.post(Constants.API_HOST + 'common/attendance.php', queryString.stringify({
            usermobile_id: token.usermobile_id,
            auth_code: token.auth_key,
            event_id: offerInfo.event_id,
            action: "add_attendance_order",
            options,
            ...address
        }))
        ToastAndroid.showWithGravity("تم اضافة الاستفادة بنجاح", ToastAndroid.LONG, ToastAndroid.CENTER);
        setModalVisible(false);
    }
     const setZonesApi = async (countryID) => {
        const zonesApi = await axios.post(`${Constants.API_HOST}helper.php`, queryString.stringify({
        access_code: 1020304050,
        action: 'zone_list',
        country_id: countryID,
        }));
        setZones(zonesApi.data);
    };
    React.useEffect(() => {
        
        axios.post(`${Constants.API_HOST}helper.php`, queryString.stringify({
        access_code: 1020304050,
        action: 'country_list',
        })).then((data) => {
            setCountries(data.data);
        });
    })
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            transparent={true}
            onDismiss={()=>{setModalVisible(false);}}
        >
            <View 
            style={{
                display: 'flex',
                justifyContent: 'center',
                height: '100%',
                marginTop: 0,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10
            }}>
                <View style={{display: 'flex', flex: 1, flexDirection:'column', padding: 0}}>
                    <View style={{backgroundColor: Constants.GREEN_COLOR, padding: 15, 
                                    borderTopEndRadius: 10,
                                    borderTopStartRadius: 10, flexDirection:'row', justifyContent: 'center',
                                    alignItems: 'center'}}>
                        <Text style={{color: '#fff', flex: 2, textAlign: 'center'}}>
                            الاستفادة من الحملة
                        </Text>
                        <Ionicons name="close" size={20}  style={{alignSelf: 'flex-end'}} onPress={()=>setModalVisible(false)}/>
                    </View>
                    <ScrollView visible>
                        <View style={{flex: 1, alignItems: "center"}}>
                            <View style={{width: "90%", borderColor: "#888", borderWidth: 1, borderRadius: 5, margin: 10, alignItems: "center", paddingBottom: 10}}>
                                <Text style={{width: "100%", fontSize: 22, paddingRight: 10,  color: "#fff", backgroundColor: Constants.GREEN_COLOR, height: 35}}>
                                    العنوان
                                </Text>
                                <TextInput
                                  placeholder="الحي"
                                  style={{borderWidth: 1, borderColor: "#888", borderRadius: 20, width: '90%', marginTop: 15, paddingLeft: 10}}
                                  value={address.street}
                                  onChangeText={(text) => setAddress({...address, street: text})}
                                />
                                <TextInput
                                  placeholder="المدينة"
                                  style={{borderWidth: 1, borderColor: "#888", borderRadius: 20, width: '90%', marginTop: 15, paddingLeft: 10}}
                                  value={address.city}
                                  onChangeText={(text) => setAddress({...address, city: text})}
                                />
                                <View style={{flexDirection: "row", alignItems: "center", marginTop: 10}}>
                                    <Text>أختر دولة</Text>
                                    <View style={{width: "70%", borderWidth: 1, borderRadius: 15, marginLeft: 10}}>
                                        <Picker
                                        selectedValue={address.country_id}
                                        onValueChange={(itemValue) => {
                                            setZonesApi(itemValue);
                                            setAddress({ ...address, country_id: itemValue });
                                        }}
                                        >
                                        <Picker.Item label="-----" value={0} key={0} />
                                        { countries.map((item, key) => (
                                            <Picker.Item label={item.name} value={item.country_id} key={`country_${key.toString()}`} />))}
                                        </Picker>
                                    </View>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center", marginTop: 10}}>
                                    <Text>أختر منطقة</Text>
                                    <View style={{width: "70%", borderWidth: 1, borderRadius: 15, marginLeft: 10}}>
                                        <Picker
                                        containerStyle={styles.dropdown}
                                        style={{ backgroundColor: '#fafafa' }}
                                        selectedValue={address.zone_id}
                                        onValueChange={(itemValue) => setAddress({ ...address, zone_id: itemValue })}
                                        >
                                        <Picker.Item label="-----" value={0} key={0} />
                                        { zones.map((item, key) => (
                                            <Picker.Item label={item.name} value={item.zone_id} key={`country_${key.toString()}`} />))}
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                            <View style={{width: "90%", borderColor: "#888", borderWidth: 1, borderRadius: 5, margin: 10}}>
                                 <Text style={{width: "100%", fontSize: 22, paddingRight: 10,  color: "#fff", backgroundColor: Constants.GREEN_COLOR, height: 35}}>
                                    تفاصيل طلب الاستفادة
                                </Text>
                                <View style={{flexDirection: 'row', borderWidth: 1, borderColor: "#888"}}>
                                    <Text style={{width: "30%", borderLeftWidth: 1, padding: 10}}>عنوان الحملة: </Text>
                                    <Text style={{padding: 10}}>{ offerInfo.name }</Text>
                                </View>
                                <View style={{flexDirection: 'row', borderWidth: 1, borderColor: "#888"}}>
                                    <Text style={{width: "30%", borderLeftWidth: 1, padding: 10}}>خيارات الاستفادة: </Text>
                                    <View style={{padding: 10}}>
                                        <Text>اسم الاستفادة: { attendaceInfo.name }</Text>
                                        {
                                            Object.keys(attendaceInfo.options).map(key => (
                                                <View style={{flexDirection: 'row'}}>
                                                    <Text>{key}:</Text> <Text>{attendaceInfo.options[key]}</Text>
                                                </View>
                                            ))
                                        }
                                        
                                        <Text>وقت الاستلام: { date.toLocaleString('ar-EG') }</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => {
                                console.log(address)
                                if(!address.city || ! address.street || !address.country_id || !address.zone_id) {
                                    ToastAndroid.showWithGravity("ادخل المعلومات المرادة", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                                    return;
                                }
                                placeAttendace()
                            }} style={{width: '80%'}}>
                            <Text style={{
                                textAlign: 'center',
                                padding: 15,
                                backgroundColor: Constants.GREEN_COLOR,
                                borderRadius: 10,
                                color: 'white',
                                width: "100%"
                            }}
                            >
                                متابعة
                            </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

export const OrderModal = ({modalVisible, setModalVisible, orderId}) => {
    const [order, setOrder] = React.useState({})

    React.useEffect(()=> { 
        let getOrder = async() => {
            
            let token = await getToken();
            token = JSON.parse(token);
            let order = await axios.post(Constants.API_HOST + 'common/orders.php', queryString.stringify({
                usermobile_id: token.usermobile_id,
                auth_code: token.auth_key,
                order_id: orderId,
                language_id: Constants.ARABIC,
                action: "order_info"
            }));
            setOrder(order.data);
        }
        getOrder();
     () => {
         setOrder({});
     }
    }, [modalVisible])
    return <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            transparent={true}
            onDismiss={()=>{setModalVisible(false);}}
        >
          <View 
            style={{
                display: 'flex',
                justifyContent: 'center',
                height: '100%',
                marginTop: 0,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10
            }}>
                <View style={{display: 'flex', flex: 1, flexDirection:'column', padding: 0}}>
                    <View style={{backgroundColor: Constants.GREEN_COLOR, padding: 15, 
                                    borderTopEndRadius: 10,
                                    borderTopStartRadius: 10, flexDirection:'row', justifyContent: 'center',
                                    alignItems: 'center'}}>
                        <Text style={{color: '#fff', flex: 2, textAlign: 'center'}}>
                            معلومات الطلب {order?.order_id}
                        </Text>
                        <Ionicons name="close" size={20}  style={{alignSelf: 'flex-end'}} onPress={()=>setModalVisible(false)}/>
                    </View>
                    <ScrollView visible>
                        <View style={{flex: 1, alignItems: "center"}}>
                            <View style={{borderWidth: 1, padding: 10, marginTop: 10}}>
                                <Text>رقم الطلب : {order?.order_id}</Text>
                                <Text>تاريخ الطلب : {order?.date_added}</Text>
                                <Text>العنوان : { order?.payment_street + '-' + order?.payment_city + '-' + order?.payment_zone }</Text>
                                <Text>الشركة : {order?.company}</Text>
                            </View>
                            <View style={{marginTop: 30, width: '90%'}}>
                                <View style={{flexDirection: 'row',}}>
                                    <Text style={{borderWidth: 1, width: '30%', padding: 10}}>رقم الحدث</Text>
                                    <Text style={{borderWidth: 1, width: '70%', padding: 10}}>{order?.event_id}</Text>
                                </View>
                                <View style={{flexDirection: 'row',}}>
                                    <Text style={{borderWidth: 1, width: '30%', padding: 10}}>اسم الحدث</Text>
                                    <Text style={{borderWidth: 1, width: '70%', padding: 10}}>{order?.event_name}</Text>
                                </View>
                                <View style={{flexDirection: 'row',}}>
                                    <Text style={{borderWidth: 1, width: '30%', padding: 10}}>خيارات الاستفادة</Text>
                                    <View style={{borderWidth: 1, width: '70%', padding: 10}}>
                                        {
                                            order?.options?.map((option) => <Text>- {option}</Text>)
                                        }
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row',}}>
                                    <Text style={{borderWidth: 1, width: '30%', padding: 10}}>النقاط</Text>
                                    <Text style={{borderWidth: 1, width: '70%', padding: 10}}>{order?.event_reward}</Text>
                                </View>
                            </View>
                            <View style={{marginTop: 30, width: '90%'}}>
                                <Text style={{paddingBottom: 10, fontSize: 17, fontWeight: 'bold'}}>تحديثات حالة الطلب</Text>
                                <View style={{flexDirection: 'row',}}>
                                    <Text style={{borderWidth: 1, width: '40%', padding: 10}}>الحالة</Text>
                                    <Text style={{borderWidth: 1, width: '30%', padding: 10}}>تاريخ التحديث</Text>
                                    <Text style={{borderWidth: 1, width: '30%', padding: 10}}>ملاحظات</Text>
                                </View>
                                {
                                    order?.history?.map((line)=> (
                                    <View style={{flexDirection: 'row',}}>
                                        <Text style={{borderWidth: 1, width: '40%', padding: 10}}>{line.status}</Text>
                                        <Text style={{borderWidth: 1, width: '30%', padding: 10, fontSize: 11}}>{line.date_added}</Text>
                                        <Text style={{borderWidth: 1, width: '30%', padding: 10}}>{line.comment}</Text>
                                    </View>
                                    ))
                                }
                            </View>
                        </View>
                    </ScrollView>
                </View>
          </View>
        </Modal>
}

const styles = StyleSheet.create({

  flatcard: {
      display: 'flex',
      width: "90%",
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      margin: 3,
      borderColor: '#aaa',
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'flex-end'

    }
  
});