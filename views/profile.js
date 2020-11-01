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
import { getToken } from '../token';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
const Profile = () => {
  
  var [refreshing, setRefreshing] = React.useState(false)
  var [profile, setProfile] = React.useState({})
  var [fileUri, SetFileuri] = React.useState('')

  
  const [bdatevalue, onChangeBdate] = React.useState(new Date());
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  let phone_ref = null;

 /* Promises */
  React.useEffect(()=>{
    setRefreshing(true)
    getToken().then((token) => {
      let json_profile = JSON.parse(token)
      json_profile['gender'] = 'female';
      setProfile(json_profile);
      onChangeBdate(new Date('1994-10-18'))
      setRefreshing(false);
    })

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
        <SafeAreaView style={styles.Container}>
            <Header
            containerStyle={{backgroundColor: Constants.GREEN_COLOR}}
            centerComponent={{ text: 'صفحتك', style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff', onPress: () => {Actions.replace('dashboard')} }}
            />
            <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            >
            
              <KeyboardAvoidingView behavior='position'>
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

                    <Grid style={{margin: 10, marginTop: 50}}>
                      <Row style={styles.row}>
                        <Col>
                          <Text style={{fontSize: 15, fontWeight: 'bold'}}>الجنس</Text>
                        </Col>
                        <Col>
                          <DropDownPicker
                            items={[
                                {label: 'ذكر', value: 'male', icon: () => <Icon name="man" size={18} color="#0cf" />},
                                {label: 'أنثى', value: 'female', icon: () => <Icon name="woman" size={18} color="#0cf" />},
                            ]}
                            defaultValue={profile.gender}
                            containerStyle={{height: 40, margin: 0}}
                            style={{backgroundColor: '#fafafa'}}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{backgroundColor: '#fafafa'}}
                            onChangeItem={item => {
                              setProfile({...profile, gender: item.value})
                              ToastAndroid.showWithGravity("تم تغير الجنس بنجاح", ToastAndroid.LONG, ToastAndroid.BOTTOM)
                            }
                          }
                        />



                        </Col>
                      </Row>
                      <Row style={styles.row}>
                        <Col>
                          <Text style={{fontSize: 15, fontWeight: 'bold'}}>تاريخ الميلاد</Text>
                        </Col>
                        <Col>  
                          <TouchableOpacity onPress={showDatepicker} 
                                            style={{padding: 10, width: 130, borderRadius: 15,
                                                    backgroundColor: '#fafafa', borderWidth: 1,
                                                    borderColor: '#cfcfcf'}}> 
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
                        </Col>
                      </Row>
                      <Row style={styles.row}>
                      <Col><Text style={{fontSize: 15, fontWeight: 'bold'}}>الايميل</Text></Col>
                        <Col>
                          <Text style={{textAlign: 'left'}}>
                             {profile?.email} <Icon name="mail" size={20}/>
                          </Text>
                        </Col>
                      </Row>
                      <Row style={styles.row}>
                      <Col><Text style={{fontSize: 15, fontWeight: 'bold'}}>رقم الهاتف</Text></Col>
                        <Col>
                          <PhoneInput value={profile?.telephone} ref={(ref) => phone_ref = ref} style={{width: 180, padding: 5, height: 40, borderWidth: 1, borderColor: "#ccc"}}/>
                          
                        </Col>
                      </Row>
                    </Grid>
              </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    flexDirection: 'column'

  },
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
  }
  
});

export default Profile;
