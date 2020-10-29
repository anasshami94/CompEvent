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
  TouchableOpacity
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker'

import Icon from 'react-native-vector-icons/AntDesign'

import {Colors} from 'react-native/Libraries/NewAppScreen';

import Constants from '../constants'
import LoginHeader from '../components/login_header'

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
console.log(width)


const Register = () => {
  const [uservalue, onChangeUsername] = React.useState('');
  const [passwordvalue, onChangePassword] = React.useState('');
  const [mailvalue, onChangeMail] = React.useState('');
  const [bdatevalue, onChangeBdate] = React.useState(new Date());
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);
  const image = Constants.BLURED_BG_IMG;


  async function registerUser() {
    console.log(uservalue, passwordvalue)
    var response = await fetch('https://reqres.in/api/register', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body:  JSON.stringify({
        username: username,
        password: passwordvalue
      })
    })
    var res_str = await response.json()
    console.log(res_str)
  }

  const onChange = (event, selectedDate) => {
    console.log(selectedDate)
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

  const showTimepicker = () => {
    showMode('time');
  };
  return (
    <>
      <ScrollView style={styles.body}>
        <KeyboardAvoidingView
          behavior='scroll' style={{maxHeight: height}}>
              <ImageBackground source={image} style={styles.image}>
                <View style={styles.formContainer}>
                  <LoginHeader/>
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
                      onChangeText={(text) => onChangeMail(text)}
                      value={mailvalue}
                      editable
                      secureTextEntry={true}
                      
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
                  <TouchableHighlight
                    onPress={registerUser}
                    underlayColor='#0000'
                  >
                    <View style={{backgroundColor: Constants.GREEN_COLOR, padding: 10, marginTop: 15, borderRadius: 5}}>
                      <Text style={{textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
                        إنشاء
                      </Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </ImageBackground>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
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
    backgroundColor: '#ddd',
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
