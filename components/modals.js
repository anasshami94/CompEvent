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
  Image
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
                                        startingValue={parseInt(l.rating)}
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
        loadCompany()
        loadCompEvents()
        return () => {
            setCompany({})
            setEvents([])
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
                        startingValue={company.avg_rating}
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
                            <Card offer={event} style={styles.flatcard} type='flat' navigation_function={navigation.replace}/>
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