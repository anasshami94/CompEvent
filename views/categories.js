import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';

import {Header, ListItem} from 'react-native-elements'

import CardSlider from '../components/card_slider'
import Card from '../components/card'

import {
  Actions
} from 'react-native-router-flux';

const queryString = require('query-string');

import Constants from '../constants'
import axios from 'axios'
import {getToken, getConstants} from '../storage'
import moment from 'moment';
import 'moment-precise-range-plugin';

const Catagories = ({navigation}) => {
  var [catList, setCatList] = React.useState([])
  var [cat, setCat] = React.useState([])
  var [isLoading, setIsLoading] = React.useState(true)
  var [refreshing, setRefreshing] = React.useState(false)
  var [constants_state, setConstants] = React.useState({})
  

  const refreshData = () => {
    setIsLoading(true)
    getToken().then((data) => {
        data = JSON.parse(data)
        axios.post(Constants.API_HOST + 'common/categories_list.php', queryString.stringify({
            usermobile_id: data.usermobile_id,
            auth_code: data.auth_key,
            language_id: Constants.ARABIC
        })).then((data)=> {
            console.log(data.data)
            setCatList(data.data)
            setIsLoading(false)
        })
    })
    
  }

  const getElementsByCat = (id) => {
      setIsLoading(true)
      console.log(id)
       getToken().then((data) => {
          data = JSON.parse(data)
          if(!data) navigation.navigate('login')

          axios.post(Constants.API_HOST + 'common/category.php', queryString.stringify({
              usermobile_id: data.usermobile_id,
              auth_code: data.auth_key,
              language_id: Constants.ARABIC,
              action: "category_data",
              category_id: id
          })).then((data)=> {
              console.log(data.data)
              setCat(data.data)
              setIsLoading(false)
        }).catch(err => console.log(err))
    })
  }

  React.useEffect(() => {
      
    getConstants().then((constants) => {
      console.log(JSON.parse(constants))
      setConstants(JSON.parse(constants))
      refreshData();
    })
    refreshData();
    return () => {
    setCatList([]) // cleanup
    }
  }, [])
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false); 
      refreshData();
    }, 1000);
  }, []);
  return (
    <>
      { isLoading ? 
      (<View style={{display: 'flex', flex: 1, justifyContent:'center'}}> 
          <ActivityIndicator size="large" color="#00ff00" /> 
      </View>) :
      (<SafeAreaView style={styles.container}>
        <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
        <View style={{flex: 1, display: 'flex'}}>
            <Text style={{fontSize: 25, margin: 10}}>الاقسام</Text>
            {
            catList.map((item, index) => {
                  return item.parent_id == "0" ?
                  (
                  <ListItem key={index}>
                      <Text style={{padding: 15, backgroundColor: "#eee", width: 250}}>{item.name}</Text>
                  </ListItem>
                  ) :
                  (
                  <ListItem key={index}>
                    <TouchableOpacity onPress={()=>{getElementsByCat(item.category_id)}}>
                      <Text style={{marginLeft: 50, padding: 15, backgroundColor: "#bbb", width: 200}}>{item.name}</Text>
                    </TouchableOpacity>
                  </ListItem>
                  )
                })
            }
        </View>
        </ScrollView>

      </SafeAreaView>)
    }
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
  header: {
    flex: 1
  },
  card: {
      display: 'flex',
      flexDirection: 'column',
      width: 200,
  },
  flatcard: {
      display: 'flex',
      width: 350,
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      margin: 3,
      borderColor: '#aaa'

  }
  
});

export default Catagories;
