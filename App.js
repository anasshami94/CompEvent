/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import Routes from './routes';
import {I18nManager, AppRegistry } from 'react-native'
import {getToken, setToken, setConstants} from './storage'
import Constants from './constants';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import {name as appName} from './app.json';
const queryString = require('query-string');
import axios from 'axios'
import {AuthContext} from './context'
const App = () => {
    
    
    var [is_auth, setIsAuth] = React.useState(false)
    const authContext = React.useMemo(() => {
        return  {
        signin: () => { 
            getToken().then((token) => {
                console.log(token)
                setIsAuth(token != undefined);
            })
        },
        signout: () => {
            setToken(null)
            setIsAuth(false);
        }
        }
    })

    React.useEffect(() => {
        axios.post(Constants.API_HOST + 'helper.php', queryString.stringify({access_code: "1020304050", action: 'general'})).then((data) => {
            setConstants(JSON.stringify(data.data))
        })
        return () => {
        }
    }, [])
  
    I18nManager.forceRTL(true);

    return (
    <AuthContext.Provider value={authContext}>
        <Routes is_auth={is_auth}/>
    </AuthContext.Provider>
    )
};
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
export default App;
