/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { I18nManager, AppRegistry } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import axios from 'axios';
import Routes from './routes';
import { getToken, setToken, setConstants } from './storage';
import Constants from './constants';
import { name as appName } from './app.json';
import { AuthContext } from './context';

const queryString = require('query-string');

const App = () => {
  const [IS_AUTH, setIsAuth] = React.useState(false);
  const authContext = React.useMemo(() => ({
    signin: () => {
      getToken().then((token) => {
        setIsAuth(token !== undefined);
      });
    },
    signout: () => {
      setToken(null);
      setIsAuth(false);
    },
  }));

  React.useEffect(() => {
    axios.post(`${Constants.API_HOST}helper.php`, queryString.stringify({ access_code: '1020304050', action: 'general' })).then((data) => {
      setConstants(JSON.stringify(data.data));
    });
    return () => {
    };
  }, []);

  I18nManager.forceRTL(true);

  return (
    <AuthContext.Provider value={authContext}>
      <Routes IS_AUTH={IS_AUTH} />
    </AuthContext.Provider>
  );
};
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
export default App;
