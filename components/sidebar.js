import React, {Component} from 'react';
import { TouchableOpacity, View, Text, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import {Actions} from 'react-native-router-flux';
import {setToken} from '../storage'
import Icon from 'react-native-vector-icons/AntDesign'
import Constants from '../constants'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';

import {AuthContext} from '../context'

export default function (props) {
    const {signout} = React.useContext(AuthContext)
    const routesList = [{
            route: 'saved_posts',
            title: 'قائمة الحملات المحفوظة',
            icon: 'star'
            }, {

            route: 'orders',
            title: 'قائمة الحملات المستفادة',
            icon: 'tag'
            }, {

            route: 'scorePoints',
            title: 'نقاط المكافأت',
            icon: 'gift'
            }, {

            route: 'profile',
            title: 'تحديث بيانات الحساب',
            icon: 'user'
            }, {

            route: 'conditions',
            title: 'الشروط وسياسات البيانات',
            icon: 'edit'
            }, {

            route: 'contactUs',
            title: 'تواصل معنا',
            icon: 'phone'
            }, {

            route: '',
            title: 'تقييم التطبيق',
            icon: 'check'
            }, {

            route: '',
            title: 'شارك التطبيق',
            icon: 'link'
            }, {

            route: '',
            title: 'اعدادات التطبيق',
            icon: 'setting'
            },
        
        {
            route: () => { signout() },
            title: 'تسجيل خروج',
            icon: 'right'
        }]
        
   
        return (
                <View style={{flex: 1, backgroundColor: '#555'}}>
                <DrawerContentScrollView {...props}>
                        {routesList.map((item) => 
                            <DrawerItem
                                icon= {({ focused, color, size }) => <Icon name={item.icon} size={size} color={focused ? "#0ff" : Constants.GREEN_COLOR} />}
                                label={item.title}
                                labelStyle= {{color: 'white'}}
                                onPress={() => {
                                        var route = item.route
                                        if(typeof route == "function") route()
                                        else props.navigation.navigate(route)
                                    }}
                            />
                        )}
                </DrawerContentScrollView>
                </View>
        );
}