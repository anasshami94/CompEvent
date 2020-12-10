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
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import moment from 'moment';
import ar from 'moment/locale/ar';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Card from '../components/card';

import Constants from '../constants';
import { getToken, getConstants } from '../storage';

const queryString = require('query-string');

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    flexDirection: 'column',

  },
  header: {
    flex: 1,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: 200,
  },
  flatcard: {
    display: 'flex',
    width: '90%',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    margin: 3,
    borderColor: '#aaa',
    alignSelf: 'center',
    flexDirection: 'column',

  },

});

moment.locale('ar', ar);

const Dashboard = ({ navigation }) => {
  const [featuredOffers, setFeaturedOffers] = React.useState([]);
  const [interestedOffers, setInterestedOffers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [constantsState, setConstants] = React.useState({});
  const getFeatured = (data) => axios.post(`${Constants.API_HOST}common/featured_events.php`, queryString.stringify({
    usermobile_id: data.usermobile_id,
    auth_code: data.auth_key,
    start: 0,
    limit: 10,
    language_id: Constants.ARABIC,
  }));
  const getInterested = (data) => axios.post(`${Constants.API_HOST}common/intersted_events.php`, queryString.stringify({
    usermobile_id: data.usermobile_id,
    auth_code: data.auth_key,
    language_id: Constants.ARABIC,
  }));
  const refreshData = () => {
    setIsLoading(true);
    getToken().then((data) => {
      data = JSON.parse(data);
      getFeatured(data).then((data) => {
        const featuredList = [];
        Object.keys(data.data).forEach((key) => {
          const element = data.data[key];
          const DAYS_ARR = element.remaining_days.split('<->');
          featuredList.push({
            id: key,
            ...element,
            remaining_days: moment(DAYS_ARR[1]).locale('ar').fromNow(),
            image_url: `${constantsState.image_directory}/${element.image}`,
          });
        });
        setFeaturedOffers(featuredList);
        getInterested(data).then(() => {
          const interstedList = [];
          Object.keys(data.data).forEach((key) => {
            const ELEMENT = data.data[key];
            const DAYS_ARR = ELEMENT.remaining_days.split('<->');
            interstedList.push({
              id: key,
              ...data.data[key],
              remaining_days: moment(DAYS_ARR[1]).locale('ar').fromNow(),
              image_url: `${constantsState.image_directory}/${ELEMENT.image}`,
            });
          });
          setInterestedOffers(interstedList);
          setIsLoading(false);
        }).catch((err) => console.log(err));
      }).catch((err) => console.log(err));
    });
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getConstants().then(async (constants) => {
        await setConstants(JSON.parse(constants));
        await refreshData();
      });
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = React.useCallback(() => {
    refreshData();
    setRefreshing(false);
  }, []);
  return (
    <>
      <SafeAreaView style={styles.container}>
        { isLoading
          ? (
            <View style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
              <ActivityIndicator size="large" color="#00ff00" />
            </View>
          )
          : (
            <ScrollableTabView
              tabBarActiveTextColor={Constants.GREEN_COLOR}
              tabBarPosition="top"
              renderTabBar={() => <ScrollableTabBar backgroundColor="rgb(255, 255, 255)" />}
              tabBarUnderlineStyle={{ backgroundColor: '#ffff' }}
            >
              <ScrollView
                tabLabel="الحملات المميزة"
                contentContainerStyle={{ marginTop: 10 }}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
              >
                <View style={{ flex: 1, marginBottom: 5 }}>
                  {featuredOffers.map((offer) => <Card key={`special${offer.event_id}`} offer={offer} type="flat" style={styles.flatcard} navigation_function={navigation.navigate} />)}
                </View>
              </ScrollView>
              <ScrollView
                tabLabel="حملات قد تهمك"
                contentContainerStyle={{ marginTop: 10 }}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
              >
                <View style={{ flex: 1, marginBottom: 5 }}>
                  {interestedOffers.map((offer) => <Card key={`interesting${offer.event_id}`} offer={offer} style={styles.flatcard} type="flat" navigation_function={navigation.navigate} />)}
                </View>
              </ScrollView>
            </ScrollableTabView>
          )}

      </SafeAreaView>
    </>
  );
};

export default Dashboard;
