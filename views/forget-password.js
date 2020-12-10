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
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';
import Constants from '../constants';

const { width } = Dimensions.get('window'); // full width
const { height } = Dimensions.get('window'); // full height

const styles = StyleSheet.create({
  image: {
    display: 'flex',
    resizeMode: 'cover',
    width,
    height,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },
  body: {
    backgroundColor: '#fff',
    display: 'flex',
    flex: 1,
    fontFamily: 'Roboto',
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    backgroundColor: '#aaa',
    color: '#fff',
    padding: 9,
    position: 'absolute',
    left: 2,
    top: 2,
    zIndex: 2,
  },
  field: {
    borderColor: '#0000',
    borderBottomColor: '#444',
    borderWidth: 1,
    width: 300,
    paddingLeft: 55,
    color: '#3388ff',
    backgroundColor: '#ddd',
    fontSize: 18,
    marginBottom: 20,
    borderRadius: 5,
  },
});

const ForgetPassword = () => {
  const [uservalue, onChangeUser] = React.useState('');
  const [keyValue, onChangekey] = React.useState('');
  const [isRecieved, onChangeRecieved] = React.useState(false);
  const image = Constants.BLURED_BG_IMG;
  return (
    <>
      <ScrollView style={styles.body}>
        <KeyboardAvoidingView
          behavior="padding"
          style={{ maxHeight: height }}
        >
          <ImageBackground source={image} style={styles.image}>

            { !isRecieved
              ? (
                <View style={styles.formContainer}>
                  <Text style={{ fontSize: 19, padding: 5 }}>الرجاء ادخال البريد الالكتروني</Text>
                  <View style={styles.input}>
                    <Icon
                      name="user"
                      color="#000"
                      style={styles.icon}
                      size={30}
                    />
                    <TextInput
                      style={styles.field}
                      onChangeText={(text) => onChangeUser(text)}
                      value={uservalue}
                      placeholder="البريد الالكتروني"
                      editable
                    />
                  </View>
                  <View style={{ flex: 1, flexDirection: 'column', display: 'flex' }}>
                    <TouchableHighlight
                      underlayColor="#0000"
                      onPress={() => onChangeRecieved(true)}
                    >
                      <View style={{
                        backgroundColor: Constants.GREEN_COLOR,
                        padding: 10,
                        marginTop: 20,
                        borderRadius: 5,
                      }}
                      >
                        <Text style={{
                          textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold',
                        }}
                        >
                          ارسل الرمز
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              )
              : (
                <View style={styles.container}>

                  <Text style={{ fontSize: 19, padding: 5 }}>
                    تم ارسال الرمز اليك الرجاء ادخاله هنا
                  </Text>
                  <View style={styles.input}>
                    <Icon
                      name="key"
                      color="#000"
                      style={styles.icon}
                      size={30}
                    />
                    <TextInput
                      style={styles.field}
                      onChangeText={(text) => onChangekey(text)}
                      value={keyValue}
                      placeholder="رمز التحقق"
                      editable
                    />
                  </View>
                  <View style={{ flex: 1, flexDirection: 'column', display: 'flex' }}>
                    <TouchableHighlight
                      underlayColor="#0000"
                    >
                      <View style={{
                        backgroundColor: Constants.GREEN_COLOR,
                        padding: 10,
                        marginTop: 20,
                        borderRadius: 5,
                      }}
                      >
                        <Text style={{
                          textAlign: 'center',
                          color: '#fff',
                          fontSize: 20,
                          fontWeight: 'bold',
                        }}
                        >
                          تحقق
                        </Text>
                      </View>
                    </TouchableHighlight>

                    <TouchableHighlight
                      underlayColor="#0000"
                    >
                      <View style={{
                        backgroundColor: Constants.GREEN_COLOR,
                        padding: 10,
                        marginTop: 20,
                        borderRadius: 5,
                      }}
                      >
                        <Text style={{
                          textAlign: 'center',
                          color: '#fff',
                          fontSize: 20,
                          fontWeight: 'bold',
                        }}
                        >
                          ارسل الرمز مرة اخرى
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              )}
          </ImageBackground>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};

export default ForgetPassword;
