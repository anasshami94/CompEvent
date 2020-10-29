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
  Image
} from 'react-native';

import CardSlider from '../components/card_slider'
import Card from '../components/card'

import Icon from 'react-native-vector-icons/AntDesign'

import {Colors} from 'react-native/Libraries/NewAppScreen';

import Constants from '../constants'

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
console.log(width)


const Dashboard = () => {
  var [lastOffers, setLastOffers] = React.useState([])
  var [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    setIsLoading(true)
      setTimeout(() =>{     
        let response = require('../mock.json')
        console.log(response)
        setLastOffers(response)
        setIsLoading(false)
      }, 1000)
  }, [])
  return (
    <>
      { isLoading ? (<Text>Loading...</Text>) :
      (<SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={{margin: 10, fontSize: 25}}>العروض المميزة</Text>
            <CardSlider>
                {lastOffers.map((offer) =>
                    <Card offer={offer} style={styles.card}/>
                    )
                }
            </CardSlider>
        </View>
        <View style={{flex: 1, display: 'flex'}}>
            <Text style={{fontSize: 25, margin: 10}}>عروض قد تهمك</Text>
            <FlatList
                contentContainerStyle= {{display: 'flex', justifyContent: "center", alignItems: "center"}}
                data={lastOffers}
                renderItem={(offer,index) => (
                    <View key={index}>
                        <Card offer={offer.item} style={styles.flatcard} type='flat'/>    
                    </View>
                )}
                keyExtractor={(offer,index)=> index.toString()}
            />
        </View>
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

export default Dashboard;
