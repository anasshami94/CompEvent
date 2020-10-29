/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import Routes from './routes';
import {I18nManager} from 'react-native'

const App = () => {
    
    I18nManager.forceRTL(true);
    return (<Routes/>)
};

export default App;
