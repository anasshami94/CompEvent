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
  FlatList,
  Image,
  RefreshControl,
  ToastAndroid
} from 'react-native';

import {Header} from 'react-native-elements'

import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker'

import PhoneInput from 'react-native-phone-input'
import {
  Actions
} from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';

import {Row, Col, Grid} from 'react-native-easy-grid';

import Icon from 'react-native-vector-icons/AntDesign'
import Constants from '../constants'
import { getToken } from '../storage';
import axios from 'axios'
let queryString = require('query-string')
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
const Profile = ({navigation}) => {
  
  var [refreshing, setRefreshing] = React.useState(false)
  var [profile, setProfile] = React.useState({})
  var [fileUri, SetFileuri] = React.useState('')

  
  const [bdatevalue, onChangeBdate] = React.useState(new Date());
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  let phone_ref = null;

  let getProfile = React.useCallback(async() => {
    
    setRefreshing(true)
    let token = await getToken();
    token = JSON.parse(token)
    let data = await axios.post(Constants.API_HOST + 'common/update_account.php', queryString.stringify({
      usermobile_id: token.usermobile_id,
      auth_code: token.auth_key,
      action: "get_data"
    }))
    console.log(data.data)
    await setProfile(data.data)
    
      setRefreshing(false);
  }, [])
 /* Promises */
  React.useEffect(()=>{
    getProfile()
  }, [])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  /* Methods */
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || bdatevalue;
    setShow(Platform.OS === 'ios');
    onChangeBdate(currentDate);
    ToastAndroid.showWithGravity('تم تغيير تاريخ الميلاد بنجاح',ToastAndroid.LONG, ToastAndroid.BOTTOM);
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
  const chooseImage = () => {
    let options = {
      title: 'Select Avatar', 
      cameraType: 'front',
      mediaType: 'photo' ,
      storageOptions: {
        skipBackup: true,
        path: 'images',
        },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        SetFileuri(response.uri) //update state to update Image
      }
    });
  }



  
  return (
    <>
        <SafeAreaView>
            <Header
              containerStyle={{backgroundColor: Constants.GREEN_COLOR}}
              leftComponent={{ icon: 'menu', color: '#fff', onPress: ()=> navigation.openDrawer()}}
              centerComponent={{ text: 'تعديل الصفحة الشخصية', style: { color: '#fff' } }}
              rightComponent={{ icon: 'home', color: '#fff', onPress: ()=> navigation.navigate("home") }}
            />
            <ScrollView
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            >
              
              <KeyboardAvoidingView behavior='position' 
            contentContainerStyle={{  flexGrow: 1, justifyContent: 'space-around', padding: 30, flexDirection: 'column', flex: 1, height: height-50}}>
              {/* image
              <View style={{display: 'flex', flex: 1}}>
                  <ImageBackground source={{uri: Constants.BLURED_BG_IMG_2}} style={{display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20}}>
                    <View style={{
                                alignSelf: 'center',
                                marginTop: 30,
                                }}>
                      <Image
                      style={{ height: 120, width: 120, borderRadius: 50}}
                      source={fileUri ? { uri: fileUri } : // if clicked a new img
                      {uri:profile?.avatar || "https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png"}} //else show random
                      />
                      <TouchableOpacity style={styles.addPictureIcon} onPress={
                        chooseImage
                        }>
                        <Icon name="camera" size={20} />
                      </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 20, marginTop: 10, color: "#fff", fontWeight: "bold"}}><Icon name="user" size={25} style={{color: "#0cda"}}/> {profile?.name} </Text>
                    <Text style={{fontSize: 20, marginTop: 10, color: "#fff", fontWeight: "bold"}}><Icon name="flag" size={25} style={{color: "#0cda"}}/> فلسطين - رام الله</Text>
                </ImageBackground>
              </View>
               */}
                      <View>
                          <TextInput style={styles.t_field} 
                                    placeholder="بريد الكتروني" value={profile?.email} onChangeText={(name)=>setProfile({...profile, email: name})}/>
                      </View>
                      <View>
                          <TextInput style={styles.t_field} 
                                    placeholder="اسم المستخدم" value={profile?.name} onChangeText={(name)=>setProfile({...profile, name: name})}/>
                      </View>
                      <View>
                          <TextInput style={styles.t_field} 
                                    placeholder="كلمة السر" 
                                    value={profile?.password} 
                                    onChangeText={(pass)=>setProfile({...profile, password: pass})}
                                    secureTextEntry={true}/>
                      </View>
                      <View>
                          <TextInput style={styles.t_field} 
                                    placeholder="تأكيد كلمة السر" 
                                    value={profile?.passwordConfirm} 
                                    onChangeText={(pass_confirm) =>setProfile({...profile, passwordConfirm: pass_confirm})}
                                    secureTextEntry={true}
                                    />
                      </View>
                      <View>
                          <TextInput style={styles.t_field} 
                                    placeholder="الشارع" value={profile?.street} onChangeText={(name)=>setProfile({...profile, street: name})}/>
                      </View>
                      <View>
                          <TextInput style={styles.t_field} 
                                    placeholder="المدينة" value={profile?.city} onChangeText={(name)=>setProfile({...profile, city: name})}/>
                      </View>
                      <View> 
                          <DropDownPicker
                            items={[
                                {label: 'استقبال ايميلات', value: '1', icon: () => <Icon name="email" size={18} color="#0cf" />},
                                {label: 'عدم استقبال ايميلات', value: '0', icon: () => <Icon name="" size={18} color="#0cf" />},
                            ]}
                            defaultValue={profile.newsletter}
                            containerStyle={{height: 40, margin: 0}}
                            style={{backgroundColor: '#fafafa'}}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{backgroundColor: '#fafafa'}}
                            onChangeItem={item => {
                              setProfile({...profile, newsletter: item.value})
                            }
                          }
                        />
                      </View>

                      <View> 
                          <DropDownPicker
                            items={[
                                {label: 'استقبال ايميلات', value: '11', icon: () => <Icon name="email" size={18} color="#0cf" />},
                                {label: 'عدم استقبال ايميلات', value: '0', icon: () => <Icon name="" size={18} color="#0cf" />},
                            ]}
                            placeholder="اختر الدولة"
                            containerStyle={{height: 40, margin: 0}}
                            style={{backgroundColor: '#fafafa'}}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{backgroundColor: '#fafafa'}}
                            onChangeItem={item => {
                              setProfile({...profile, newsletter: item.value})
                            }
                          }
                        />
                      </View>
                      <View> 
                          <DropDownPicker
                            items={[
                                {label: 'استقبال ايميلات', value: '11', icon: () => <Icon name="email" size={18} color="#0cf" />},
                                {label: 'عدم استقبال ايميلات', value: '0', icon: () => <Icon name="" size={18} color="#0cf" />},
                            ]}
                            placeholder="اختر المدينة"
                            containerStyle={{height: 40, margin: 0}}
                            style={{backgroundColor: '#fafafa'}}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{backgroundColor: '#fafafa'}}
                            onChangeItem={item => {
                              setProfile({...profile, newsletter: item.value})
                            }
                          }
                        />
                      </View>
                      <View style={{height: 50}}>
                          <TouchableOpacity onPress={showDatepicker} 
                                            style={{padding: 10, width: 130, borderRadius: 15,
                                                    backgroundColor: '#fafafa', borderWidth: 1,
                                                    borderColor: '#cfcfcf', width: "100%"}}> 
                            <Text style = {{color: '#333', fontSize: 15, textAlign:'left'}}> 
                              <Icon name="calendar" size={15}/> {bdatevalue.toISOString().substring(0, 10)}
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
                      <View style={{height: 50}}>
                        <PhoneInput value={profile?.telephone} ref={(ref) => phone_ref = ref} style={{width: "99%", padding: 5, height: 40, borderWidth: 1, borderColor: "#ccc"}}/>
                       </View>
                       <View style={{height: 50}}>
                          <TouchableOpacity onPress={()=> {}}>
                            <View style={{backgroundColor: Constants.GREEN_COLOR, padding: 10}}>
                              <Text style={{color: "#fff", textAlign: "center", fontSize: 16}}>تحديث الحساب</Text>
                            </View>
                          </TouchableOpacity>
                       </View>
              </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  

 addPictureIcon: {
      height: 40,
      width: 40,
      backgroundColor: "#fff",
      borderRadius: 50,
      position: 'absolute',
      left: 65,
      top: 75,
      justifyContent: 'center',
      alignItems: 'center',
      alignItems: 'center',
  },
  row: {
    marginBottom: 50,
  },
  t_field: {width: "100%", borderWidth: 1, borderRadius: 10, borderColor:'#aaa',textAlign:'right'}
  
});

export default Profile;
