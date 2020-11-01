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
  SafeAreaView,
  ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  Actions
} from 'react-native-router-flux';

import axios from 'axios'

import { setToken } from "../token"

const queryString = require('query-string');
 

import Constants from '../constants'
import LoginHeader from '../components/login_header'
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


const Login = () => {
  const [emailvalue, onChangeEmail] = React.useState('');
  const [passwordvalue, onChangePassword] = React.useState('');
  const image = Constants.BLURED_BG_IMG;

  async function doLogin() {
     let response = await axios.post(Constants.API_HOST + 'account/login.php', 
          queryString.stringify({
            email: emailvalue,
            password: passwordvalue
          }), 
          {headers: Constants.REQ_HEADER})
      console.log(response.data);
      /*{"auth_key": 55339313,
       "call_status": true,
       "email": "walas0518@gmail.com",
       "name": "Walaa",
       "telephone": "+970591111111",
       "usermobile_group_id": "1",
       "usermobile_id": "10"} */
      if(response.data['call_status'] == false) {
        ToastAndroid.showWithGravity("خطأ في تسجيل الدخول حاول مرة اخرى", ToastAndroid.SHORT, ToastAndroid.CENTER);
      } else {
        await setToken(JSON.stringify(response.data)); // store all info about this user
        Actions.replace('home')
      }
  }

  function goToSignup() {
    Actions.push('register')
  }

  return (
    <SafeAreaView style={styles.body}>
          <ScrollView>
            <KeyboardAvoidingView
              behavior='padding' style={{maxHeight: height}}>
                  <ImageBackground source={image} style={styles.image}>
                    <View style={styles.formContainer}>
                      <LoginHeader/>
                      
                      <View style={styles.input}>
                        <Icon
                          name='mail'
                          color='#000'
                          style={styles.icon}
                          size={30}
                        />
                        <TextInput
                          style={styles.field}
                          onChangeText={(text) => onChangeEmail(text)}
                          value={emailvalue}
                          editable
                        />
                      </View>
                    <View style={styles.input} >
                      <Icon
                        name='key'
                        color='#000'
                        style={styles.icon}
                        size={30}
                      />
                        <TextInput
                          style={styles.field}
                          onChangeText={(text) => onChangePassword(text)}
                          value={passwordvalue}
                          editable
                          secureTextEntry={true}
                          
                        />
                      </View>
                      <View style={{flex: 1, flexDirection: 'column', display: 'flex'}}>
                        <TouchableHighlight
                          onPress={doLogin}
                          underlayColor='#0000'
                        >
                          <View style={{backgroundColor: Constants.GREEN_COLOR, padding: 10, marginTop: 20, borderRadius: 5}}>
                            <Text style={{textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                            تسجيل دخول
                            </Text>
                          </View>
                        </TouchableHighlight>
                        <View>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 20,
                              marginTop: 20
                            }}
                          >أو</Text>
                        </View>
                        <TouchableHighlight
                          onPress={goToSignup}
                          underlayColor='#0000'
                        >
                          <View style={{backgroundColor: '#9955ff', padding: 10, marginTop: 20, borderRadius: 5}}>
                            <Text style={{textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                              انشاء حساب جديد
                            </Text>
                          </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                          underlayColor='#0000'
                          onPress={() => {Actions.push('forget_pswd')}}
                        >
                          <View style={{backgroundColor: 'transparent', padding: 10, marginTop: 5, borderRadius: 5}}>
                            <Text style={{textAlign: 'center', color: '#049', fontSize: 20}}>
                              نسيت كلمة السر ؟
                            </Text>
                          </View>
                        </TouchableHighlight>
                      </View>
                    </View>
                  </ImageBackground>
            </KeyboardAvoidingView>
          </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    display: 'flex',
    resizeMode: "cover",
    justifyContent: "center",
    width: width,
    height: height,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    backgroundColor: Colors.white,
    display: 'flex',
    flex: 1,
    fontFamily: 'Roboto',
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    position: 'relative',
  },
  icon: {
    backgroundColor: '#aaa',
    color: '#fff',
    padding: 9,
    position: 'absolute',
    left: 2,
    top: 2,
    zIndex: 2
  },
  field: {
    borderColor: '#0000',
    borderBottomColor: '#444',
    borderWidth: 1,
    width: 300,
    paddingLeft: 55,
    color: '#3388ff',
    backgroundColor: '#ddd',
    fontSize: 18,
    marginBottom: 20,
    borderRadius: 5
  },
});

export default Login;
