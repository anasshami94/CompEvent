
import axios from 'axios';
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
  SafeAreaView,
  ToastAndroid
} from 'react-native';
import {Header, ListItem, Avatar, Icon} from 'react-native-elements'
import Constants from '../constants'


import {getToken, getConstants} from '../storage'


const queryString = require('query-string');

import moment from 'moment';
import ar from 'moment/locale/ar'
moment.locale("ar", ar);

const SavedPosts = ({navigation}) => {
    var [saved_events, setSavedEvents] = React.useState([])


    
const deleteEvent = async (event_id) => {
    let token = await getToken()
    token = JSON.parse(token)
    let common_const = await getConstants()
    common_const = JSON.parse(common_const)
    let data = await axios.post(Constants.API_HOST + 'common/saved_events.php', queryString.stringify({
        usermobile_id: token.usermobile_id,
        auth_code: token.auth_key,
        action: "delete",
        event_id: event_id
    }))
    if(data.data.call_status) {
        ToastAndroid.showWithGravity("تم الحذف بنجاح", ToastAndroid.LONG, ToastAndroid.BOTTOM)
    } else {

        ToastAndroid.showWithGravity("فشل في حذف الحملة", ToastAndroid.LONG, ToastAndroid.BOTTOM)
    }
    await getSavedEvents()
}

    const getSavedEvents = React.useCallback(async() => {
        let token = await getToken()
        token = JSON.parse(token)
        let common_const = await getConstants()
        common_const = JSON.parse(common_const)
        let data = await axios.post(Constants.API_HOST + 'common/saved_events.php', queryString.stringify({
            usermobile_id: token.usermobile_id,
            auth_code: token.auth_key,
            action: "get_list",
            language_id: Constants.ARABIC
        }))
        setSavedEvents(data.data.map((item) => {
        let end = item.remaining_days.split("<->")[1];
        return {
            ...item,
            image_url: common_const.image_directory + '/' + item.image,
            remaining_days:  moment(end).locale('ar').fromNow(),
            final_date: end
        }
    }))
    }, [])

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => getSavedEvents());
        return unsubscribe
    },[navigation])
    return (
    <>
        <SafeAreaView>
            <View>
                <ScrollView>
                    <View>
                        {saved_events.map((item, i) => (
                            <ListItem key={i} bottomDivider onPress={() => console.log("replace this with navigation :3")}>
                            <Avatar source={{
                                uri: item.image ? 
                                    item.image_url : "https://freepikpsd.com/wp-content/uploads/2019/10/empty-image-png-7-Transparent-Images.png"}} 
                                style={{width: 100, height: 100}} 
                                />
                            <ListItem.Content>
                                
                                <ListItem.Title>{item.name}</ListItem.Title>
                        <ListItem.Subtitle>{item.remaining_days} - اخر يوم {item.final_date}</ListItem.Subtitle>
                                <Icon
                                    raised
                                    name='trash'
                                    type='font-awesome'
                                    color='#f50'
                                    onPress={() => deleteEvent(item.event_id)}
                                    containerStyle={{flex: 1, alignSelf: 'flex-end'}}/>
                            </ListItem.Content>
                        </ListItem>
                        ))}
                       
                        
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    </>
    )
}

export default SavedPosts;
