import axios from 'axios';
import React from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator, StyleSheet,ScrollView} from 'react-native';
import Card from '../components/card';
import {getToken, getConstants} from '../storage';
import Constants from '../constants';
import {ListItem} from 'react-native-elements'
import moment from 'moment';
import ar from 'moment/locale/ar'
moment.locale("ar", ar);

const queryString = require('query-string');

const SubCategory = ({navigation, route}) => {
    let filters = route.params.filters;
    let filters_arr = Object.keys(filters).map((key) => filters[key]);
    console.log(filters_arr);
    const [cards, setCards] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    

    const getData = React.useCallback(async() => {
        setIsLoading(true);
        let session = await getToken();
        session = JSON.parse(session);
        let constants_state = await getConstants();
        constants_state = JSON.parse(constants_state);
        let data = await axios.post(Constants.API_HOST + 'common/category.php', 
                                    queryString.stringify({
                                        usermobile_id: session.usermobile_id,
                                        auth_code: session.auth_key,
                                        action: "category_events",
                                        category_id: filters_arr[0].category_id,
                                        start: 0,
                                        limit: 20,
                                        filters: filters_arr.map((filter) => filter.filter_id).join(','),
                                        language_id: Constants.ARABIC
                                    }));
         let offers = [];
          Object.keys(data.data).forEach((key) => {
            let element = data.data[key];
            let days_str = element.remaining_days;
            let days_arr = days_str.split('<->');
            offers.push({
              id: key,
              ...element,
              remaining_days:  moment(days_arr[1]).locale('ar').fromNow(),
              image_url: constants_state.image_directory + '/' + element.image
            });
          });
        console.log(offers);
        await setCards(offers);
        setIsLoading(false);
    });

    React.useEffect(() => {
        getData();
    }, [])
    return (
        <>
            {
            isLoading ? 
            (<View style={{display: 'flex', flex: 1, justifyContent:'center'}}> 
                <ActivityIndicator size="large" color="#00ff00" /> 
            </View>) : 
            (
            <View>
                <ScrollView>
                    {cards.map((offer) => 
                        (<ListItem  key={"subcat" + offer.event_id} >
                            <Card offer={offer} style={styles.flatcard} 
                                type='flat' navigation_function={navigation.navigate}/>    
                        </ListItem>))
                    }
                </ScrollView>
            </View>
            )
            }
        </>
    )
}

const styles = StyleSheet.create({
    flatcard: {
      display: 'flex',
      width: "90%",
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      margin: 3,
      borderColor: '#aaa',
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'flex-end'

    }
});


export default SubCategory;