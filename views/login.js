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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios'

import { setToken } from "../storage"

const queryString = require('query-string');
 

import Constants from '../constants'
import LoginHeader from '../components/login_header'


import {AuthContext} from '../context'

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


const Login = ({navigation}) => {
  const {signin} = React.useContext(AuthContext)
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
        signin()
      }
  }

  function goToSignup() {
    navigation.push('register')
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
                        <TextInput
                          style={styles.field}
                          onChangeText={(text) => onChangeEmail(text)}
                          value={emailvalue}
                          placeholder="البريد الالكتروني"
                          editable
                        />
                      </View>
                    <View style={styles.input} >
                        <TextInput
                          style={styles.field}
                          onChangeText={(text) => onChangePassword(text)}
                          value={passwordvalue}
                          editable
                          secureTextEntry={true}
                          placeholder="كلمة المرور"
                          
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
                          onPress={() => {navigation.navigate('forget_pswd')}}
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
    left: 0,
    top: 0,
    zIndex: 2,
    borderRadius: 10,
  },
  field: {
    borderColor: '#ccc',
    borderWidth: 1,
    width: 300,
    paddingLeft: 20,
    color: '#000',
    fontSize: 18,
    marginBottom: 20,
    borderRadius: 10,
    textAlign: 'right'
  },
});

export default Login;
