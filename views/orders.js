
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

const Orders = ({navigation}) => {
    var [orders, setOrders] = React.useState([])

    const getOrders = React.useCallback(async() => {
        let token = await getToken()
        token = JSON.parse(token)
        let common_const = await getConstants()
        common_const = JSON.parse(common_const)
        let data = await axios.post(Constants.API_HOST + 'common/orders.php', queryString.stringify({
            usermobile_id: token.usermobile_id,
            auth_code: token.auth_key,
            action: "get_list",
            language_id: Constants.ARABIC,
            start: 0,
            limit: 10
        }))
        console.log(data.data)
        setOrders(data.data)   
    }, [])

    React.useEffect(() => {
        getOrders()
        return () => {
            setOrders([])
        }
    },[])
    return (
    <>
        <SafeAreaView>
            <Header
              containerStyle={{backgroundColor: Constants.GREEN_COLOR}}
              leftComponent={{ icon: 'menu', color: '#fff', onPress: ()=> navigation.openDrawer()}}
              centerComponent={{ text: 'سجل الاستفادة من الاحداث', style: { color: '#fff' } }}
              rightComponent={{ icon: 'home', color: '#fff', onPress: ()=> navigation.navigate("home") }}
            />
            <View>
                <ScrollView>
                    <View>
                        {orders.map((item, i) => (
                            <ListItem key={i} bottomDivider onPress={() => console.log("replace this with navigation :3")}>
                            <ListItem.Content>
                                
                                <ListItem.Title>{item.order_id} الطلب رقم</ListItem.Title>
                                <ListItem.Subtitle>{item.date_added} </ListItem.Subtitle>
                                <ListItem.Subtitle>{item.status} </ListItem.Subtitle>
                                <Icon
                                    raised
                                    name='eye'
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

export default Orders;
