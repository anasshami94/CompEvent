import axios from 'axios';
import React from 'react';
import {
  ScrollView,
  View,
  SafeAreaView,
  Text,
} from 'react-native';
import moment from 'moment';
import ar from 'moment/locale/ar';
import Constants from '../constants';
import { getToken } from '../storage';

const queryString = require('query-string');

moment.locale('ar', ar);

const Rewards = ({ navigation }) => {
  const [rewards, setRewards] = React.useState([]);
  const getRewards = React.useCallback(async () => {
    let token = await getToken();
    token = JSON.parse(token);
    const data = await axios.post(`${Constants.API_HOST}common/rewards.php`, queryString.stringify({
      usermobile_id: token.usermobile_id,
      auth_code: token.auth_key,
      start: 0,
      limit: 10,
    }));
    console.log(data);
    setRewards(data.data);
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => getRewards());
    return unsubscribe;
  }, [navigation]);
  return (
    <>
      <SafeAreaView>
        <View>
          <ScrollView>
            <View style={{ marginTop: 20, padding: 10 }}>
              <Text style={{ fontSize: 30 }}>
                { `مجموع النقاط : ${rewards?.rewards_balance}` }
              </Text>
              <View style={{ width: '90%', marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ width: '40%', borderWidth: 1, padding: 10, fontWeight: 'bold' }}>
                    تاريخ الحضور
                  </Text>
                  <Text style={{ width: '30%', borderWidth: 1, padding: 10, fontWeight: 'bold' }}>
                    الحركة
                  </Text>
                  <Text style={{ width: '30%', borderWidth: 1, padding: 10, fontWeight: 'bold' }}>
                    النقاط
                  </Text>
                </View>
                {
                  rewards?.rewards?.map((reward) => (
                    <View>
                      <Text style={{ width: '30%' }}>
                        { reward.date_added }
                      </Text>
                      <Text style={{ width: '30%' }}>
                        { reward.description }
                      </Text>
                      <Text style={{ width: '30%' }}>
                        { reward.amount }
                      </Text>
                    </View>
                  ))
                }
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Rewards;
