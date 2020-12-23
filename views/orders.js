import axios from 'axios';
import React from 'react';
import {
  ScrollView,
  View,
  SafeAreaView,
} from 'react-native';
import {
  ListItem, Icon,
} from 'react-native-elements';
import moment from 'moment';
import ar from 'moment/locale/ar';
import Constants from '../constants';

import { getToken } from '../storage';
import { OrderModal } from '../components/modals';
const queryString = require('query-string');

moment.locale('ar', ar);

const Orders = ({ navigation }) => {
  const [orders, setOrders] = React.useState([]);
  const [activeOrder, setActiveOrder] = React.useState(0);
  const [visibleOrder, setVisibleOrder] = React.useState(false);
  const getOrders = React.useCallback(async () => {
    let token = await getToken();
    token = JSON.parse(token);
    const data = await axios.post(`${Constants.API_HOST}common/orders.php`, queryString.stringify({
      usermobile_id: token.usermobile_id,
      auth_code: token.auth_key,
      action: 'get_list',
      language_id: Constants.ARABIC,
      start: 0,
      limit: 10,
    }));
    setOrders(data.data);
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => getOrders());
    return unsubscribe;
  }, [navigation]);
  return (
    <>
      <SafeAreaView>
        <View>
          <ScrollView>
            <OrderModal
              orderId={activeOrder}
              setModalVisible={setVisibleOrder}
              modalVisible={visibleOrder}
            />
            <View>
              {orders.map((item, i) => (
                <ListItem key={`order_${item.order_id}`} bottomDivider onPress={() => console.log('replace this with navigation :3')}>
                  <ListItem.Content>

                    <ListItem.Title>
                      #
                      {item.order_id}
                    </ListItem.Title>
                    <ListItem.Subtitle>
                      {item.date_added}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle>
                      {item.status}
                    </ListItem.Subtitle>
                    <Icon
                      raised
                      name="eye"
                      type="font-awesome"
                      color="#f50"
                      onPress={() => {
                        setActiveOrder(item.order_id);
                        setVisibleOrder(true);
                      }}
                      containerStyle={{ flex: 1, alignSelf: 'flex-end' }}
                    />
                  </ListItem.Content>
                </ListItem>
              ))}

            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Orders;
