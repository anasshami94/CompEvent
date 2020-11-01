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
import {getToken} from './token'

const App = () => {
    
    
    var [is_auth, setIsAuth] = React.useState(false)
    React.useEffect(() => {
        var token = getToken().then((token) => {
            console.log(token)
            setIsAuth(token != undefined);
        })
    }, [])
  
    I18nManager.forceRTL(true);

    return (<Routes is_auth={is_auth}/>)
};

export default App;
