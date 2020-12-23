import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Picker,
} from 'react-native';

import { SearchBar } from 'react-native-elements';

import axios from 'axios';
import moment from 'moment';
import ar from 'moment/locale/ar';
import Card from '../components/card';
import Constants from '../constants';
import { getToken, getConstants } from '../storage';

const queryString = require('query-string');

moment.locale('ar', ar);

const Search = ({ navigation }) => {
  const [results, setResults] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [cat, setCat] = React.useState(0);
  const [catList, setCatList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [constants_state, setConstants] = React.useState({});

  const getElements = () => {
    setIsLoading(true);
    getToken().then((data) => {
      data = JSON.parse(data);
      if (!data) navigation.navigate('login');

      axios.post(`${Constants.API_HOST}common/search_events.php`, queryString.stringify({
        usermobile_id: data.usermobile_id,
        auth_code: data.auth_key,
        language_id: Constants.ARABIC,
        start: 0,
        limit: 20,
        category_id: cat,
        search_words: query,
      })).then((data) => {
        const result_list = [];
        Object.keys(data.data).forEach((key) => {
          const element = data.data[key];
          const days_str = element.remaining_days;
          const days_arr = days_str.split('<->');
          result_list.push({
            id: key,
            ...element,
            remaining_days: moment(days_arr[1]).fromNow(),
            image_url: `${constants_state.image_directory}/${element.image}`,

          });
        });

        console.log('From Search -------');
        console.log(result_list);
        setResults(result_list);
        setIsLoading(false);
      }).catch((err) => console.log(err));
    });
  };
  const loadCat = () => {
    setIsLoading(true);
    getToken().then((data) => {
      data = JSON.parse(data);
      axios.post(`${Constants.API_HOST}common/categories_list.php`, queryString.stringify({
        usermobile_id: data.usermobile_id,
        auth_code: data.auth_key,
        language_id: Constants.ARABIC,
      })).then((data) => {
        const catListAPI = [];
        data.data.forEach((cat) => {
          if (cat.parent_id != 0) {
            catListAPI.push({
              label: cat.name,
              value: cat.category_id,
            });
          }
        });
        setCatList(catListAPI);
        setIsLoading(false);
      });
    });
  };
  React.useEffect(() => {
    getConstants().then((constants) => {
      setConstants(JSON.parse(constants));
      loadCat();
    });
    return () => {
      setResults([]); // cleanup
    };
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

            <ScrollView>
              <SearchBar
                placeholder="اكتب هنا للبحث عن حملة"
                onChangeText={(text) => setQuery(text)}
                value={query}
                lightTheme
                round
              />
              {/*
            <DropDownPicker
                items={catList}
                defaultValue={cat}
                containerStyle={{height: 40, margin: 0}}
                style={{backgroundColor: '#fafafa'}}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                onChangeList={(items, callback) => {
                    new Promise((resolve, reject) => resolve(setCatList(items)))
                        .then(() => callback())
                        .catch(() => {});
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={item => {
                    setCat(item.value)
                }
                }
            />
            */}
              <View style={{
                margin: 15, width: '92%', borderWidth: 1, borderRadius: 10, borderColor: '#888',
              }}
              >
                <Picker
                  selectedValue={cat}

                  onValueChange={(itemValue, itemIndex) => setCat(itemValue)}
                  style={{ }}
                >

                  { catList.map((item, key) => (
                    <Picker.Item label={item.label} value={item.value} key={key} />))}

                </Picker>
              </View>
              <TouchableOpacity onPress={() => getElements()}>
                <Text style={{
                  margin: 30, padding: 15, borderRadius: 10, backgroundColor: Constants.GREEN_COLOR, textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold',
                }}
                >
                  بحث
                </Text>
              </TouchableOpacity>
              <View style={{ display: 'flex', width: '100%' }}>
                {
                    results && results.map((result) => <Card type="flat" offer={result} key={`card_${result.event_id}`} style={styles.flatcard} navigation_function={navigation.navigate} />)
                }
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
    </>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
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

export default Search;
