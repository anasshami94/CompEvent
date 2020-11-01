import React from 'react';
import {Scene, Router, TabBar, Route} from 'react-native-router-flux';
import Login from './views/login';
import Register from './views/register';
import ForgetPassword from './views/forget-password';
import Dashboard from './views/dashboard';
import Profile from './views/profile'
import Map from './views/map'
import Constants from './constants';
import {StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
function TabIcon(props){
    const color = `#${Math.floor(Math.random()* 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
    console.log("color", color)
    return (
      <View style={{backgroundColor: '#000', width: '100%', height: '100%', justifyContent: 'center'}}>
        <Icon name="user"/>
        <Text style={{color: this.props.selected ? 'pink' :'white', textAlign: 'center', fontSize :20}}>{this.props.title}</Text>
      </View>
    );
}
const Routes = ({is_auth}) => {
  console.log("insinde", is_auth);
  return (
  <Router
  navigationBarStyle = {{backgroundColor: '#0c3', textAlign: 'center'}}>
  <Scene key="root">
      <Scene key="login" component={Login} initial={!is_auth}
        title="تسجيل دخول"
        titleStyle= {styles.header}/>
      <Scene key="register" component={Register} back={true}
        title="انشاء حساب جديد"
        titleStyle= {styles.header}/>
      <Scene key="forget_pswd" component={ForgetPassword} back={true}
        title="نسيت كلمة السر"
        titleStyle= {styles.header}/>
      <Scene key="home" tabs={true} tabBarPosition="bottom" hideNavBar initial={is_auth}>
        <Scene key='dashboardTab' title='الرئيسية'  >
          <Scene key='dashboard' component={Dashboard} hideNavBar  icon={() => <TabIcon name="user"/>}  name="dashboard" 
          />
        </Scene>
        <Scene key='profileTab' title='صفحتك'>
            <Scene key='profile' component={Profile} hideNavBar icon={() => <TabIcon name="user"/>} name="profile" />
        </Scene>
        <Scene key='mapTab' title='الخريطة'>
            <Scene key='map' component={Map} hideNavBar icon={() => <TabIcon name="map"/>} name="map" />
        </Scene>
      </Scene>
    </Scene>
  </Router>
)
};

var styles = StyleSheet.create({
  header: { 
    color: '#fff', 
    fontSize: 25, 
    fontFamily: 'Helvetica',
    fontWeight: '700',
    position: 'absolute'
    }
})
export default Routes;
