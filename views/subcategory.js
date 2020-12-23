import axios from 'axios';
import React from 'react';
import {
  View, ActivityIndicator, StyleSheet, ScrollView,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import moment from 'moment';
import ar from 'moment/locale/ar';
import Card from '../components/card';
import { getToken, getConstants } from '../storage';
import Constants from '../constants';

moment.locale('ar', ar);

const queryString = require('query-string');

const styles = StyleSheet.create({
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

const SubCategory = ({ navigation, route }) => {
  const { filters } = route.params;
  const FILTER_ARR = Object.keys(filters).map((key) => filters[key]);
  console.log(FILTER_ARR);
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    let session = await getToken();
    session = JSON.parse(session);
    let ConstantsState = await getConstants();
    ConstantsState = JSON.parse(ConstantsState);
    const data = await axios.post(`${Constants.API_HOST}common/category.php`,
      queryString.stringify({
        usermobile_id: session.usermobile_id,
        auth_code: session.auth_key,
        action: 'category_events',
        category_id: FILTER_ARR[0].category_id,
        start: 0,
        limit: 20,
        filters: FILTER_ARR.map((filter) => filter.filter_id).join(','),
        language_id: Constants.ARABIC,
      }));
    const offers = [];
    Object.keys(data.data).forEach((key) => {
      const element = data.data[key];
      const DAYS_STR = element.remaining_days;
      const DAYS_ARR = DAYS_STR.split('<->');
      offers.push({
        id: key,
        ...element,
        remaining_days: moment(DAYS_ARR[1]).locale('ar').fromNow(),
        image_url: `${ConstantsState.image_directory}/${element.image}`,
      });
    });
    console.log(offers);
    await setCards(offers);
    setIsLoading(false);
  });

  React.useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {
            isLoading
              ? (
                <View style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                  <ActivityIndicator size="large" color="#00ff00" />
                </View>
              )
              : (
                <View>
                  <ScrollView>
                    {cards.map((offer) => (
                      <ListItem key={`subcat${offer.event_id}`}>
                        <Card
                          offer={offer}
                          style={styles.flatcard}
                          type="flat"
                          navigation_function={navigation.navigate}
                        />
                      </ListItem>
                    ))}
                  </ScrollView>
                </View>
              )
            }
    </>
  );
};

export default SubCategory;
