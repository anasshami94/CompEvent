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
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
  Picker,
  Platform,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Rating, Divider,
} from 'react-native-elements';
import axios from 'axios';

import { SliderBox } from 'react-native-image-slider-box';

import moment from 'moment';
import ar from 'moment/locale/ar';
import { CommentModal, CompanyModal } from '../components/modals';
import Constants from '../constants';
import { getToken, getConstants } from '../storage';

const queryString = require('query-string');

moment.locale('ar', ar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tag: {
    fontSize: 10,
    padding: 10,
    color: '#555',
    fontWeight: 'bold',
  },
  tagWrapper: {
    borderWidth: 1,
    borderColor: Constants.GREEN_COLOR,
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
    margin: 5,
    borderRadius: 10,
  },
  icon: {
    marginLeft: 5,
    color: '#0c3',
  },
  key: {
    width: '35%',
    borderRightWidth: 1,
    padding: 20,
    borderColor: '#ddd',
  },
  value: {
    width: '55%',
    padding: 20,
  },
});

const Post = ({ navigation, route }) => {
  const QUERY_OFFER = route.params.offer;
  const [offer, setOffer] = React.useState(QUERY_OFFER);
  const [attendance, setAttendance] = React.useState({name: '', options: {}});
  const [option, setOption] = React.useState('');
  const [isLoading, setIsloading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [companyModalVisible, setCompanyModalVisible] = React.useState(false);
  const [showDate, setShowDate] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const scrollViewRef = React.createRef();

  let endScroll = 0;

  const saveEvent = async () => {
    let token = await getToken();
    token = JSON.parse(token);
    const data = await axios.post(`${Constants.API_HOST}common/saved_events.php`, queryString.stringify({
      usermobile_id: token.usermobile_id,
      auth_code: token.auth_key,
      action: 'add',
      event_id: offer.event_id,
    }));
    if (data.data.call_status) {
      ToastAndroid.showWithGravity('تم اضافة الحملة للمحفوظات', ToastAndroid.LONG, ToastAndroid.CENTER);
    } else {
      ToastAndroid.showWithGravity('لا يمكن اضافة الحملة للمحفوظات', ToastAndroid.LONG, ToastAndroid.CENTER);
    }
  };
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const loadData = () => {
    setIsloading(true);

    getToken().then(async (token) => {
      const TOKEN = JSON.parse(token);
      let helper = await getConstants();
      helper = JSON.parse(helper);
      axios.post(`${Constants.API_HOST}common/event.php`, queryString.stringify({
        usermobile_id: TOKEN.usermobile_id,
        auth_code: TOKEN.auth_key,
        event_id: QUERY_OFFER.event_id,
        language_id: Constants.ARABIC,
      })).then(async (data) => {
        const OFFER_API = data.data;
        const DAYS_ARR = OFFER_API.remaining_days.split('<->');
        await setOffer({
          ...OFFER_API,
          remaining_days: moment(DAYS_ARR[1]).locale('ar').fromNow(),
          image_url: `${helper.image_directory}/${OFFER_API.image}`,
          images_url: OFFER_API.images.map((image) => `${helper.image_directory}/${image}`),
        });
        console.log(offer.event_options);
        setIsloading(false);
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => console.log(err));
  };
  const onRefresh = React.useCallback(async () => {
    await loadData();
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => loadData());
    return unsubscribe;
  }, [navigation]);

  return (
    isLoading ? (
      <View style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    )
      : (
        <>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            onContentSizeChange={(width, height) => { endScroll = height; }}
            refreshControl={(
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
              )}
            ref={scrollViewRef}
          >
            <CommentModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              event_id={offer?.event_id}
            />
            <CompanyModal
              modalVisible={companyModalVisible}
              setModalVisible={setCompanyModalVisible}
              company_id={offer.company_id}
              navigation={navigation}
            />
            <View style={{ padding: 5 }}>
              <View style={{ height: 300 }}>
                {
                            offer.images_url && offer.images_url.length
                            && offer.images[0].length ? (
                              <SliderBox images={offer.images_url} />
                              ) : (
                                <Image
                                  source={{
                                    uri: offer.image ? offer.image_url
                                      : 'https://freepikpsd.com/wp-content/uploads/2019/10/empty-image-png-7-Transparent-Images.png',
                                  }}
                                  style={{
                                    width: '100%', height: '100%', borderRadius: 10, borderWidth: 1, borderColor: '#ccc',
                                  }}
                                />
                              )
                        }

              </View>

              <View style={{ width: '100%', flex: 1, marginBottom: 30 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="chevron-back-outline" size={20} />
                  <Text style={{ padding: 10 }}>{offer.name}</Text>
                </View>
                <TouchableNativeFeedback onPress={() => setCompanyModalVisible(true)}>
                  <View style={{ backgroundColor: '#fff', width: '90%', marginLeft: 10 }}>
                    <Text style={{
                      color: '#0d3', fontWeight: '600', fontSize: 19, margin: 10,
                    }}
                    >
                      {offer.company_name}
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
              <View style={{
                color: '#fff', flex: 1, flexWrap: 'wrap', flexDirection: 'row',
              }}
              >
                <View style={styles.tagWrapper}>
                  <Ionicons
                    name="calendar"
                    color="#0c3"
                    style={styles.icon}
                    size={20}
                  />
                  <Text style={styles.tag}>
                    {offer.remaining_days}
                  </Text>
                </View>
                <View style={styles.tagWrapper}>
                  <Ionicons
                    name="eye"
                    style={styles.icon}
                    size={20}
                  />
                  <Text style={styles.tag}>
                    {offer.views}
                  </Text>
                </View>
                <View style={styles.tagWrapper}>
                  <Ionicons
                    name="star"
                    style={styles.icon}
                    size={20}
                  />
                  <Text style={styles.tag}>
                    {offer.reward}
                  </Text>
                </View>

                <TouchableNativeFeedback
                  onPress={async () => { await saveEvent(); }}
                >
                  <View style={{ ...styles.tagWrapper, backgroundColor: '#0c3' }}>
                    <Ionicons
                      name="bookmark"
                      color="#fff"
                      size={20}
                    />
                    <Text style={{ ...styles.tag, color: '#fff' }}>
                      حفظ
                    </Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  onPress={() => {
                    scrollViewRef.current.scrollTo({ x: 0, y: endScroll, animated: true });
                  }}
                >
                  <View style={{ ...styles.tagWrapper, backgroundColor: '#0c3' }}>
                    <Ionicons
                      name="cart"
                      size={20}
                      color="#fff"
                    />
                    <Text style={{ ...styles.tag, color: '#fff' }}>
                      الاستفادة من الحملة
                    </Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => setModalVisible(true)}>
                  <View style={{ ...styles.tagWrapper, backgroundColor: '#0c3' }}>
                    <Ionicons
                      name="send-sharp"
                      color="#fff"
                      size={20}
                    />
                    <Text style={{ ...styles.tag, color: '#fff' }}>
                      اضافة تعليق
                    </Text>

                  </View>
                </TouchableNativeFeedback>
                <View style={{ ...styles.tagWrapper, maxWidth: '60%', alignSelf: 'center' }}>
                  <Text style={styles.tag}>
                    {parseInt(offer.avg_rating, 2) || 0}
                    / 5
                  </Text>
                  <Rating
                    imageSize={20}
                    readonly
                    startingValue={parseInt(offer.avg_rating, 2) || 0}
                    tintColor="#ddd"
                  />
                  <Text style={styles.tag}>
                    (
                    {offer.reviews_count}
                    ) تقييم
                  </Text>
                </View>
              </View>
              {offer?.event_attributes?.length
                ? (
                  <View style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        padding: 15,
                        marginTop: 15,
                        borderRadius: 5,
                        backgroundColor: Constants.GREEN_COLOR,
                        textAlign: 'center',
                      }}
                      >
                        بيانات الحملة
                      </Text>
                      {
                        offer.event_attributes.map((eventAttribute) => (
                          <View key={eventAttribute.attribute_group_id}>
                            <View style={{ borderWidth: 1, borderColor: '#ddd' }}>

                              <Text style={{
                                padding: 15,
                                textAlign: 'center',
                              }}
                              >
                                {eventAttribute.name}
                              </Text>
                            </View>
                            {eventAttribute.attribute.map((attribute) => (
                              <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#ddd' }} key={attribute.attribute_id}>
                                <View style={styles.key}><Text>{attribute.name}</Text></View>
                                <View style={styles.value}><Text>{attribute.text}</Text></View>
                              </View>
                            ))}
                          </View>
                        ))
                        }
                    </View>

                  </View>
                ) : <></>}
              <Divider style={{ backgroundColor: '#aaa', marginTop: 25, marginBottom: 25 }} />
              <View style={{ display: 'flex', flex: 1, padding: 15 }}>
                <View style={{
                  display: 'flex', flex: 1, flexDirection: 'row', marginBottom: 15,
                }}
                >
                  <Ionicons name="list" size={20} color={Constants.GREEN_COLOR} />
                  <Text style={{ paddingRight: 15, fontWeight: 'bold' }}>
                    خيارات الاستفادة من الحملة
                  </Text>
                </View>
                <View>
                  <TextInput
                    placeholder="اسم الاستفادة"
                    style={{
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 10,
                    }}
                    value={attendance.name}
                    onChange={(e)=>{setAttendance({...attendance, name: e.target.value})}}
                  />
                  <View style={{
                    marginTop: 10, width: '100%', borderWidth: 1, borderRadius: 10, borderColor: '#888',
                  }}
                  >
                  
                    { offer?.event_options?.map((event_option, key_top) => (
                          <View key={`view_${key_top.toString()}`}>
                            <Text>{event_option.name}</Text>

                            <Picker
                              selectedValue={attendance.options[event_option.option_id]}
                              onValueChange={(itemValue) => setAttendance({...attendance, options: {...attendance.options, [event_option.option_id]: itemValue }})}
                            >

                              { 

                                event_option.option_values.filter((item) => item.length > 0).map((item, key) => (
                                    <Picker.Item label={item.name} value={item.name} key={`option_${key.toString()}`} />
                                ))
                              }
                            </Picker>
                          </View>
                        ))
                      }
                  </View>
                  <View style={{ marginTop: 10, marginBottom: 10, width: '100%' }}>
                    {showDate && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={date}
                        mode="datetime"
                        is24Hour={false}
                        display="spinner"
                        onChange={onChangeDate}
                      />
                    )}
                    <TouchableOpacity
                      onPress={() => setShowDate(true)}
                      style={{
                        padding: 10,
                        borderRadius: 15,
                        backgroundColor: '#fafafa',
                        borderWidth: 1,
                        height: 45,
                        borderColor: '#cfcfcf',
                        width: '100%',
                      }}
                    >
                      <Text style={{ color: '#333', fontSize: 15, textAlign: 'left' }}>
                        <Ionicons name="calendar" size={15} />
                        {date.toLocaleString('ar-EG')}
                      </Text>
                    </TouchableOpacity>
                  </View>

                </View>
                <TouchableNativeFeedback>
                  <Text style={{
                    textAlign: 'center',
                    padding: 15,
                    backgroundColor: Constants.GREEN_COLOR,
                    borderRadius: 10,
                    color: 'white',
                  }}
                  >
                    متابعة
                  </Text>
                </TouchableNativeFeedback>
              </View>

            </View>
          </ScrollView>
        </>
      )
  );
};

export default Post;
