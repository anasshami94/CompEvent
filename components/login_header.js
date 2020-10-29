import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

export default LoginHeader = () => {
    return (
        <View style={styles.header}>
            <Image style={{width: 120, height: 120}}
            source={{uri:'https://www.ird.lk/wp-content/uploads/2018/11/acd-festival-photo-gallery.png'}}/>
            
            <Text style={styles.title}>
                CompEvent
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    color: '#ccc',
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontWeight: '100',
  }
});