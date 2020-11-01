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
  Platform,
  TouchableOpacity,
  SafeAreaView,
  ToastAndroid
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker'

import Icon from 'react-native-vector-icons/AntDesign'

import {Colors} from 'react-native/Libraries/NewAppScreen';

import Constants from '../constants'
import LoginHeader from '../components/login_header'

import axios from 'axios'
import PhoneInput from 'react-native-phone-input'
const queryString = require('query-string');
 

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


const Register = () => {
  const [uservalue, onChangeUsername] = React.useState('');
  const [passwordvalue, onChangePassword] = React.useState('');
  const [mailvalue, onChangeMail] = React.useState('');
  const [bdatevalue, onChangeBdate] = React.useState(new Date());
  const [signup_code, setSignupCode] = React.useState('');
  const [is_passed_verify, setisPassed] = React.useState(false);
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true)
  const [error, setError] = React.useState('')
  const image = Constants.BLURED_BG_IMG;

  let phone_ref = null;

  React.useEffect(() => {
    const REGEX_MAIL = '.+@.+\..+'
    if(mailvalue.match(REGEX_MAIL)) {
      setDisabled(false);
      setError('')
    }
  }, [mailvalue])


  async function verifyUser() {
    if(error != '' && !disabled) {
      return;
    }
    console.log(Constants.API_HOST + 'account/signup.php')
    try{
    let response = await axios.post(Constants.API_HOST + 'account/signup.php',
    queryString.stringify({
        email: mailvalue,
        action: "verify"       
      }), {
        headers: Constants.REQ_HEADER})

    if(response.status != 200) {
      ToastAndroid.showWithGravity("خطأ في الشبكة او في السيرفر الداخلي، الرجاء التاكد من الشبكة", ToastAndroid.LONG, ToastAndroid.CENTER);
    } else if(response.data['call_status'] == 'Error'){
      ToastAndroid.showWithGravity("الايميل المدخل مسجل مسبقاً", ToastAndroid.LONG, ToastAndroid.BOTTOM)
    } else {
      ToastAndroid.showWithGravity("تم ارسال الكود اليك", ToastAndroid.LONG, ToastAndroid.BOTTOM)
      setisPassed(true)
    }
  } catch(e){
    ToastAndroid.showWithGravity("خطأ في الشبكة او في السيرفر الداخلي، الرجاء التاكد من الشبكة", ToastAndroid.LONG, ToastAndroid.CENTER);
  }
  }


  function validateInput() {
    let is_valid = false;
    if(uservalue == '')
      ToastAndroid.showWithGravity("الرجاء ادخال اسم المستخدم",ToastAndroid.SHORT, ToastAndroid.CENTER)
    else if(passwordvalue == '') 
      ToastAndroid.showWithGravity("الرجاء ادخال كلمة السر",ToastAndroid.SHORT, ToastAndroid.CENTER)
    else if(!phone_ref.isValidNumber())
      ToastAndroid.showWithGravity("الرجاء ادخال رقم هاتف صحيح",ToastAndroid.SHORT, ToastAndroid.CENTER)
    else
      is_valid = true;
    return is_valid;
  }

  async function registerUser() {
    let is_valid = validateInput()

    if(!is_valid) return;
    try{
      var response = await axios.post(Constants.API_HOST + 'account/signup.php',
        queryString.stringify({
          email: mailvalue,
          password: passwordvalue,
          name: uservalue,
          telephone: phone_ref.getValue(),
          signup_code: signup_code,
          action: 'register'       
        }),
      {headers: {  "Content-Type": "application/x-www-form-urlencoded"  }})
      console.log("register", response)
      if(response.status != 200) {
        ToastAndroid.showWithGravity("خطأ في الشبكة او في السيرفر الداخلي، الرجاء التاكد من الشبكة", ToastAndroid.LONG, ToastAndroid.CENTER);
      } else if(response.data['call_status'] == 'Error'){
        ToastAndroid.showWithGravity("خطأ في الكود المرسل والمعلومات", ToastAndroid.LONG, ToastAndroid.BOTTOM)
      } else {
        ToastAndroid.showWithGravity("تم تسجيلك بنجاح !", ToastAndroid.LONG, ToastAndroid.BOTTOM)
        Actions.replace('login')
      }
      } catch(e) {
        ToastAndroid.showWithGravity("خطأ في الشبكة او في السيرفر الداخلي، الرجاء التاكد من الشبكة", ToastAndroid.LONG, ToastAndroid.CENTER);
      }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || bdatevalue;
    setShow(Platform.OS === 'ios');
    onChangeBdate(currentDate);
  };
  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };
  return (
    <SafeAreaView style={styles.body}>
      <ScrollView>
        <KeyboardAvoidingView
          behavior='scroll' style={{maxHeight: height}}>
              <ImageBackground source={image} style={styles.image}>
                <View style={styles.formContainer}>
                  <LoginHeader/>

                  { !is_passed_verify ? 
                  (
                  <>
                  <View style={styles.input} >
                    { error != '' && <Text>{error}</Text> }
                    <Icon
                      name='mail'
                      color='#000'
                      style={styles.icon}
                      size={30}
                    />
                        <TextInput
                          style={styles.field}
                          onChangeText={(text) => onChangeMail(text)}
                          value={mailvalue}
                        />
                    </View>
                  <View>
                      <TouchableOpacity onPress={() => {verifyUser()}} 
                                        underlayColor="#000" disabled={disabled}> 
                        <View style={disabled ? {backgroundColor: "#ccc", padding: 10, marginTop: 15, borderRadius: 5} : {backgroundColor: Constants.GREEN_COLOR, padding: 10, marginTop: 15, borderRadius: 5}}>
                          <Text style={{textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
                              متابعة
                          </Text>
                        </View>
                      </TouchableOpacity >
                     <Text>{disabled}</Text> 
                  </View>
                  </>
                  ) :
                  ( <>
                    <View style={styles.input}>
                    <Icon
                      name='user'
                      color='#000'
                      style={styles.icon}
                      size={30}
                    />
                    <TextInput
                      style={styles.field}
                      onChangeText={(text) => onChangeUsername(text)}
                      value={uservalue}
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
                  <View style={styles.input} >
                  <Icon
                    name='mail'
                    color='#000'
                    style={styles.icon}
                    size={30}
                  />
                    <TextInput
                      style={styles.field}
                      value={mailvalue}
                      editable={false}
                    />
                  </View>
                  <View style={styles.input} >
                  <Icon
                    name='calendar'
                    color='#000'
                    style={styles.icon}
                    size={30}
                  />

                    <View>
                    
                    <TouchableOpacity onPress={showDatepicker} 
                                      style={{width: 250, height: 50,  marginLeft: 50, 
                                              display: 'flex', justifyContent: 'center',
                                              backgroundColor: '#eee3', padding: 15}}> 
                      <Text style = {{color: '#55e', fontSize: 18}}>
                          {bdatevalue.toISOString().substring(0, 10)}
                      </Text>
                    </TouchableOpacity >

                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={bdatevalue}
                        mode={mode}
                        is24Hour={true}
                        display="spinner"
                        onChange={onChange}
                      />
                    )}
                  </View>
                  </View>

                  <View style={styles.input} >
                    <Icon
                      name='phone'
                      color='#000'
                      style={styles.icon}
                      size={30}
                    />
                    <View>
                      <PhoneInput ref={(ref) => phone_ref = ref} style={{width: 200, padding: 13, height: 40, borderWidth: 1,}}/>
                    </View>
                  </View>
                  
                  <View style={styles.input} >
                    <Icon
                      name='key'
                      color='#000'
                      style={styles.icon}
                      size={30}
                    />
                    <View>
                      <TextInput 
                      style={styles.field}
                      value={signup_code}
                      onChangeText={(text) => setSignupCode(text)}
                      placeholder="الرمز السري من بريدك الخاص" />
                    </View>
                  </View>

                  <TouchableHighlight
                    onPress={registerUser}
                    underlayColor='#0000'
                  >
                    <View style={{backgroundColor: Constants.GREEN_COLOR, padding: 10, marginTop: 15, borderRadius: 5}}>
                      <Text style={{textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
                        إنشاء حساب جديد
                      </Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() => setisPassed(true)}
                    underlayColor='#0000'
                  >
                    <View style={{backgroundColor: Constants.GREEN_COLOR, padding: 10, marginTop: 15, borderRadius: 5}}>
                      <Text style={{textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
                        رجوع
                      </Text>
                    </View>
                  </TouchableHighlight>
                  
                    </>
                  )
                  }
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
    width: width,
    height: height,
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    color: Colors.white,
    display: 'flex',
    textAlign: 'center',
    marginBottom: 50,
    fontFamily: 'sans-serif',
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
    marginTop: 5,
    marginBottom: 5
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
    borderWidth: 2,
    width: 300,
    paddingLeft: 55,
    color: '#3388ff',
    backgroundColor: '#efefef',
    fontSize: 18,
    marginBottom: 20,
    borderRadius: 5
  },
  button: {
    marginBottom: 10,
    backgroundColor: '#ddd',
    padding: 10,
    textAlign: 'center'
  },
  formContainer: {},
});

export default Register;
