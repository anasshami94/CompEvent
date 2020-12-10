import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import axios from 'axios';

import { FiltersModal } from '../components/modals';
import Constants from '../constants';
import { getToken, getConstants } from '../storage';
import 'moment-precise-range-plugin';

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
    justifyContent: 'flex-end',

  },

});

const Categories = ({ navigation }) => {
  const [catList, setCatList] = React.useState([]);
  const [filtersData, setFiltersData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [constantState, setConstants] = React.useState({});
  const [isOpenedFilter, setOpenFilters] = React.useState(false);

  const refreshData = () => {
    setIsLoading(true);
    getToken().then((data) => {
      data = JSON.parse(data);
      axios.post(`${Constants.API_HOST}common/categories_list.php`, queryString.stringify({
        usermobile_id: data.usermobile_id,
        auth_code: data.auth_key,
        language_id: Constants.ARABIC,
      })).then((data) => {
        setCatList(data.data);
        setIsLoading(false);
      });
    });
  };

  const getElementsByCat = (id) => {
    setIsLoading(true);
    getToken().then((data) => {
      data = JSON.parse(data);
      if (!data) navigation.navigate('login');

      axios.post(`${Constants.API_HOST}common/category.php`, queryString.stringify({
        usermobile_id: data.usermobile_id,
        auth_code: data.auth_key,
        language_id: Constants.ARABIC,
        action: 'category_data',
        category_id: id,
      })).then((data) => {
        setFiltersData(data.data);
        setOpenFilters(true);
        setIsLoading(false);
      }).catch((err) => console.log(err));
    });
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getConstants().then((constants) => {
        setConstants(JSON.parse(constants));
        refreshData();
      });
      refreshData();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refreshData();
    }, 1000);
  }, []);
  return (
    <>
      { isLoading
        ? (
          <View style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        )
        : (
          <SafeAreaView style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.scrollView}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
            >
              <View style={{ flex: 1, display: 'flex' }}>
                <FiltersModal
                  modalVisible={isOpenedFilter}
                  setModalVisible={setOpenFilters}
                  filtersData={filtersData}
                  invokeGetEvents={(filter) => {
                    if (filter.length === 0) return;
                    navigation.push('subcategory', { filters: filter });
                  }}
                />
                <Text style={{ fontSize: 25, margin: 10 }}>الاقسام</Text>
                <View style={{ alignItems: 'center' }}>
                  {
            catList.map((item, index) => (item.parent_id === '0'
              ? (
                <View style={{ marginTop: 30, padding: 0 }} key={`category${index.toString()}`}>
                  <Text style={{
                    padding: 15,
                    backgroundColor: Constants.GREEN_COLOR,
                    width: 250,
                    color: 'white',
                  }}
                  >
                    {item.name}
                  </Text>
                </View>
              )
              : (
                <View style={{ margin: 0, padding: 0 }} key={`subcategory${index.toString()}`}>
                  <TouchableOpacity onPress={() => { getElementsByCat(item.category_id); }}>
                    <Text style={{
                      padding: 15,
                      backgroundColor: '#eee',
                      width: 250,
                      marginTop: 0,
                      textAlign: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                    }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              )))
            }
                </View>
              </View>
            </ScrollView>

          </SafeAreaView>
        )}
    </>
  );
};

export default Categories;
