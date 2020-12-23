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
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ToastAndroid,
  Picker,
} from 'react-native';

import PhoneInput from 'react-native-phone-input';
import axios from 'axios';
import Constants from '../constants';
import { getToken } from '../storage';

const queryString = require('query-string');

const styles = StyleSheet.create({

  addPictureIcon: {
    height: 40,
    width: 40,
    backgroundColor: '#fff',
    borderRadius: 50,
    position: 'absolute',
    left: 65,
    top: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    marginBottom: 50,
  },
  t_field: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#aaa',
    textAlign: 'right',
    marginBottom: 15,
    paddingLeft: 10,
  },
  dropdown: {
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#aaa',
    backgroundColor: '#fff',
  },
});

const Profile = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [countries, setCountries] = React.useState([]);
  const [zones, setZones] = React.useState([]);

  const setZonesApi = async (countryID) => {
    const zonesApi = await axios.post(`${Constants.API_HOST}helper.php`, queryString.stringify({
      access_code: 1020304050,
      action: 'zone_list',
      country_id: countryID,
    }));
    setZones(zonesApi.data);
  };

  const getProfile = React.useCallback(async () => {
    setRefreshing(true);
    let token = await getToken();
    token = JSON.parse(token);
    const data = await axios.post(`${Constants.API_HOST}common/update_account.php`, queryString.stringify({
      usermobile_id: token.usermobile_id,
      auth_code: token.auth_key,
      action: 'get_data',
    }));
    const COUNTRIES = await axios.post(`${Constants.API_HOST}helper.php`, queryString.stringify({
      access_code: 1020304050,
      action: 'country_list',
    }));
    await setCountries(COUNTRIES.data);
    await setZonesApi(data.data.country_id);
    await setProfile(data.data);
    setRefreshing(false);
  }, []);
  /* Promises */
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => getProfile());
    return unsubscribe;
  }, [navigation]);

  const onRefresh = React.useCallback(async () => {
    await getProfile();
  }, []);

  const updateProfile = async () => {
    let token = await getToken();
    token = JSON.parse(token);
    console.log(token);
    const response = await axios.post(`${Constants.API_HOST}common/update_account.php`,
      queryString.stringify({
        usermobile_id: token.usermobile_id,
        auth_code: token.auth_key,
        action: 'update_data',
        ...profile,
        newsletter: profile.newsletter === '1',
      }));
    if (!response.data.call_status) {
      ToastAndroid.showWithGravity('خطأ في تخزين البيانات', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    } else {
      ToastAndroid.showWithGravity('تم تحديث بياناتك بنجاح!', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          contentContainerStyle={{ padding: 30, flex: 1, flexDirection: 'column' }}
        >

          <KeyboardAvoidingView contentContainerStyle={{ flexGrow: 1 }}>
            <View>
              <TextInput
                style={styles.t_field}
                placeholder="بريد الكتروني"
                value={profile?.email}
                onChangeText={(name) => setProfile({ ...profile, email: name })}
              />
            </View>
            <View>
              <TextInput
                style={styles.t_field}
                placeholder="اسم المستخدم"
                value={profile?.name}
                onChangeText={(name) => setProfile({ ...profile, name })}
              />
            </View>
            <View>
              <TextInput
                style={styles.t_field}
                placeholder="كلمة السر"
                value={profile?.password}
                onChangeText={(pass) => setProfile({ ...profile, password: pass })}
                secureTextEntry
              />
            </View>
            <View>
              <TextInput
                style={styles.t_field}
                placeholder="تأكيد كلمة السر"
                value={profile?.passwordConfirm}
                onChangeText={(passConfirm) => setProfile({
                  ...profile, passwordConfirm: passConfirm,
                })}
                secureTextEntry
              />
            </View>
            <View>
              <Text>الشارع</Text>
              <TextInput
                style={styles.t_field}
                placeholder="الشارع"
                value={profile?.street}
                onChangeText={(name) => setProfile({ ...profile, street: name })}
              />
            </View>
            <View>
              <Text>المدينة</Text>
              <TextInput
                style={styles.t_field}
                placeholder="المدينة"
                value={profile?.city}
                onChangeText={(name) => setProfile({ ...profile, city: name })}
              />
            </View>
            <View>
              <Picker
                selectedValue={profile.newsletter}
                onValueChange={(itemValue) => {
                  setProfile({ ...profile, newsletter: itemValue });
                }}
              >
                <Picker.Item label="عدم استقبال ايميلات" value="0" key="0" />
                <Picker.Item label="استقبال ايميلات" value="1" key="1" />
              </Picker>
            </View>

            <View>
              <Text>أختر دولة</Text>
              <View style={styles.dropdown}>
                <Picker
                  selectedValue={profile.country_id}
                  onValueChange={(itemValue) => {
                    setZonesApi(itemValue);
                    setProfile({ ...profile, country_id: itemValue });
                  }}
                >
                  <Picker.Item label="-----" value={0} key={0} />
                  { countries.map((item, key) => (
                    <Picker.Item label={item.name} value={item.country_id} key={`country_${key.toString()}`} />))}

                </Picker>
              </View>
            </View>
            <View>
              <Text>أختر منطقة</Text>
              <View style={styles.dropdown}>
                <Picker
                  containerStyle={styles.dropdown}
                  style={{ backgroundColor: '#fafafa' }}
                  selectedValue={profile.zone_id}
                  onValueChange={(itemValue) => setProfile({
                    ...profile, zone_id: itemValue,
                  })}
                >
                  <Picker.Item label="-----" value={0} key={0} />
                  { zones.map((item, key) => (
                    <Picker.Item label={item.name} value={item.zone_id} key={`country_${key.toString()}`} />))}

                </Picker>
              </View>
            </View>
            <View style={{ height: 50, marginBottom: 15 }}>
              <PhoneInput
                value={profile?.telephone}
                style={{
                  width: '99%', padding: 5, height: 40, borderWidth: 1, borderColor: '#ccc',
                }}
              />
            </View>
            <View style={{ height: 50 }}>
              <TouchableOpacity onPress={() => updateProfile()}>
                <View style={{ backgroundColor: Constants.GREEN_COLOR, padding: 10 }}>
                  <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>تحديث الحساب</Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Profile;
