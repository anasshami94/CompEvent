import React from 'react';
import {Router, Scene} from 'react-native-router-flux';
import Login from './views/login';
import Register from './views/register';
import ForgetPassword from './views/forget-password';
import Dashboard from './views/dashboard';
import Constants from './constants';
import {StyleSheet} from 'react-native'
const Routes = () => (
  <Router
  navigationBarStyle = {{backgroundColor: '#0c3', textAlign: 'center'}}>
    <Scene key="root">
      <Scene key="login" component={Login} initial 
        title="تسجيل دخول"
        titleStyle= {styles.header}/>
      <Scene key="register" component={Register} back={true}
        title="انشاء حساب جديد"
        titleStyle= {styles.header}/>
      <Scene key="forget_pswd" component={ForgetPassword} back={true}
        title="نسيت كلمة السر"
        titleStyle= {styles.header}/>
      <Scene key="dashboard" component={Dashboard} back={false}
       drawer={true} title="القائمة الرئيسية" titleStyle={styles.header} />
      {/*
            <Scene key="dashboard" component={Dashboard} title = "Dashboard" />
            <Scene key="posts" component={Posts} title="Posts" />
            <Scene key="profile" component = {Profile} title="Profile" />
            <Scene key="users" component={Users} title="Users" />
         */}
    </Scene>
  </Router>
);

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
