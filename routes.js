import React from 'react';

import Login from './views/login';
import Register from './views/register';
import ForgetPassword from './views/forget-password';
import Dashboard from './views/dashboard';
import Profile from './views/profile'
import Map from './views/map'
import Catagories from './views/categories'
import Search from './views/search'
import Post from './views/post'
import Constants from './constants';
import {StyleSheet} from 'react-native'
import {Text, View,TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sidebar from './components/sidebar'


import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer';
const Stack = createStackNavigator();
const StackTab = createStackNavigator();
const DashStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
function getHeaderTitle(route) { 
  let routename = getFocusedRouteNameFromRoute(route);
  switch(routename) {
    case 'dashboard': 
      return "الرئيسية"
    case 'categories': 
      return "المجموعات"
    case 'map': 
      return "الخريطة"
    case 'search': 
      return "بحث"
  }
  return "الرئيسية"
}

function DashboardStack() {
  return (
    <DashStack.Navigator>
      <DashStack.Screen name="dashboard" component={Dashboard}/>
      <DashStack.Screen name="post" component={Post}/>
    </DashStack.Navigator>
  )
}

function TabsNav () {
  return (
      <Tab.Navigator
      
       screenOptions={({ route }) => ({
          headerTitle: getHeaderTitle(route),
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'dashboard') {
              iconName = focused
                ? 'ios-earth'
                : 'ios-earth-outline';
            } else if (route.name === 'categories') {
              iconName = focused ? 'layers' : 'layers-outline';
            } else if (route.name === 'search') {
              
              iconName = focused ? 'search-circle' : 'search-circle-outline';
            } else {
              
              iconName = focused ? 'ios-map' : 'ios-map-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={Constants.GREEN_COLOR} />;
          }
        })}
        >
           <Tab.Screen name="dashboard" component={DashboardStack} 
            options={{
              title:"الرئيسية",
              headerTitleStyle: styles.header, 
              headerStyle: {backgroundColor: Constants.GREEN_COLOR } 
            }}
        />
           <Tab.Screen name="categories" component={Catagories} options={{title:"مجموعات", headerTitleStyle: styles.header, 
          headerStyle: {backgroundColor: Constants.GREEN_COLOR }, }}/>
          <Tab.Screen name="search" component={Search} options={{title:"البحث", headerTitleStyle: styles.header, 
          headerStyle: {backgroundColor: Constants.GREEN_COLOR },}} />
           <Tab.Screen name="map" component={Map} options={{title:"الخريطة", headerTitleStyle: styles.header, 
          headerStyle: {backgroundColor: Constants.GREEN_COLOR },}} />
      </Tab.Navigator>
  )
}
function StackTabNav() {
  return (<StackTab.Navigator>
    <StackTab.Screen name="homestack" component={TabsNav}
      options={({ route, navigation }) => ({
          headerTitle: getHeaderTitle(route),
          headerLeft: ()=> (<TouchableOpacity onPress={()=> navigation.openDrawer()}>
                                      <Text style={{marginLeft: 10}}>
                                          <Ionicons name="list" size={16} color="white" />
                                      </Text>
                            </TouchableOpacity>),
          headerTitleStyle: styles.header,
          headerStyle: {
            backgroundColor: Constants.GREEN_COLOR
          }
      })}
    />
  </StackTab.Navigator>)
}

function DashboardDrawer() {
 return ( 
      <Drawer.Navigator drawerContent={probs => <Sidebar {...probs}/>} backBehavior="order"
       options={{headerStyle: styles.header}}>
        <Drawer.Screen name="home" component={StackTabNav} />
        <Drawer.Screen name="profile" component={Profile} options={{drawerIcon: ({color, size}) => <Icon name="layers" size={size}/>}}/>
      </Drawer.Navigator>
 )
}
const Routes = ({is_auth}) => {
  
  return (
     <NavigationContainer>
      {!is_auth ? 
      (<Stack.Navigator>
        <Stack.Screen name="login" component={Login} options={{title:"تسجيل دخول", headerTitleStyle: styles.header, 
          headerStyle: {
            backgroundColor: Constants.GREEN_COLOR
          }, }}/>
        <Stack.Screen name="register" component={Register} options={{title:"انشاء حساب جديد", headerTitleStyle: styles.header, 
          headerStyle: {
            backgroundColor: Constants.GREEN_COLOR
          }, }}/>
        <Stack.Screen name="forget_pswd" component={ForgetPassword} options={{title:"نسيت كلمة السر", headerTitleStyle: styles.header, 
          headerStyle: {
            backgroundColor: Constants.GREEN_COLOR
          }, }}/>
      </Stack.Navigator>) :
      (
        <DashboardDrawer/>
      )}
      
    </NavigationContainer>
  
)
};

var styles = StyleSheet.create({
  header: { 
    color: '#fff', 
    fontSize: 25, 
    fontFamily: 'Helvetica',
    fontWeight: '700',
    flex: 1,
    textAlign: 'center'
    }
})
export default Routes;
