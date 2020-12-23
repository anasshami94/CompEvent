import React from 'react';

import {
  StyleSheet, Text, TouchableOpacity,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommonActions, NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './views/login';
import Register from './views/register';
import ForgetPassword from './views/forget-password';
import Dashboard from './views/dashboard';
import Profile from './views/profile';
import Map from './views/map';
import Categories from './views/categories';
import SubCategory from './views/subcategory';
import Search from './views/search';
import Post from './views/post';
import SavedPosts from './views/saved-posts';
import Settings from './views/settings';
import Orders from './views/orders';
import Rewards from './views/rewards';
import Rules from './views/rules';
import ContactUs from './views/contact-us';
import Constants from './constants';
import Sidebar from './components/sidebar';

const Stack = createStackNavigator();
const StackTab = createStackNavigator();
const DashStack = createStackNavigator();
const CatStack = createStackNavigator();
const ContactUsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const RulesStack = createStackNavigator();
const OrdersStack = createStackNavigator();
const RewardsStack = createStackNavigator();
const SavedStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  header: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'Helvetica',
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
});

const headerOption = ({ navigation }, name) => ({
  headerTitle: name,
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Text style={{ marginLeft: 10 }}>
        <Ionicons name="list" size={16} color="white" />
      </Text>
    </TouchableOpacity>
  ),
  headerRight: () => (name && name !== 'الرئيسية' && (
  <TouchableOpacity onPress={() => navigation.dispatch(CommonActions.goBack())}>
    <Text style={{ marginRight: 10 }}>
      <Ionicons name="arrow-back-outline" size={16} color="white" />
    </Text>
  </TouchableOpacity>
  )),
  headerTitleStyle: styles.header,
  headerStyle: {
    backgroundColor: Constants.GREEN_COLOR,
  },
});

function getHeaderTitle(route) {
  const routename = getFocusedRouteNameFromRoute(route);
  switch (routename) {
    case 'map':
      return 'الخريطة';
    case 'search':
      return 'بحث';
    default:
      return 'الرئيسية';
  }
}

function DashboardStack() {
  return (
    <DashStack.Navigator>
      <DashStack.Screen
        name="home"
        component={Dashboard}
        options={(props) => headerOption(props, 'الرئيسية')}
      />
      <DashStack.Screen
        name="post"
        component={Post}
        options={(props) => headerOption(props, 'الحملة')}
      />
    </DashStack.Navigator>
  );
}

function CategoriesStack() {
  return (
    <CatStack.Navigator>
      <CatStack.Screen
        name="categories"
        component={Categories}
        options={(props) => headerOption(props, 'مجموعات')}
      />
      <CatStack.Screen
        name="subcategory"
        component={SubCategory}
        options={(props) => headerOption(props, 'مجموعة فرعية')}
      />
    </CatStack.Navigator>
  );
}

function TabsNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: getHeaderTitle(route),
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          if (route.name === 'dashboard') {
            iconName = focused
              ? 'ios-earth'
              : 'ios-earth-outline';
          } else if (route.name === 'categories') {
            iconName = focused ? 'layers' : 'layers-outline';
          } else if (route.name === 'search') {
            iconName = focused ? 'search-circle' : 'search-circle-outline';
          } else {
            iconName = focused ? 'ios-map' : 'ios-map-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={Constants.GREEN_COLOR} />;
        },
      })}
    >
      <Tab.Screen
        name="dashboard"
        component={DashboardStack}
        options={{
          title: 'الرئيسية',
          headerTitleStyle: styles.header,
          headerStyle: { backgroundColor: Constants.GREEN_COLOR },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="categories"
        component={CategoriesStack}
        options={{
          title: 'مجموعات',
          headerTitleStyle: styles.header,
          headerStyle: { backgroundColor: Constants.GREEN_COLOR },
        }}
      />
      <Tab.Screen
        name="search"
        component={Search}
        options={{
          title: 'البحث',
          headerTitleStyle: styles.header,
          headerStyle: { backgroundColor: Constants.GREEN_COLOR },
        }}
      />
      <Tab.Screen
        name="map"
        component={Map}
        options={{
          title: 'الخريطة',
          headerTitleStyle: styles.header,
          headerStyle: { backgroundColor: Constants.GREEN_COLOR },
        }}
      />
    </Tab.Navigator>
  );
}
function StackTabNav() {
  return (
    <StackTab.Navigator>
      <StackTab.Screen
        name="homestack"
        component={TabsNav}
        options={({ route, navigation }) => {
          const title = getFocusedRouteNameFromRoute(route);
          const MUST_HIDDEN = ['dashboard', 'post', 'categories', 'subcategory', undefined];
          const IS_HIDDEN = !!MUST_HIDDEN.includes(title);
          return {
            headerTitle: getHeaderTitle(route),
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Text style={{ marginLeft: 10 }}>
                  <Ionicons name="list" size={16} color="white" />
                </Text>
              </TouchableOpacity>
            ),
            headerTitleStyle: styles.header,
            headerStyle: {
              backgroundColor: Constants.GREEN_COLOR,
            },
            headerShown: !IS_HIDDEN,
          };
        }}
      />
    </StackTab.Navigator>
  );
}

const ProfileStackLayout = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="profile" component={Profile} options={(props) => headerOption(props, 'تعديل الملف الشخصي')} />
  </ProfileStack.Navigator>
);

const OrdersStackLayout = () => (
  <OrdersStack.Navigator>
    <OrdersStack.Screen name="orders" component={Orders} options={(props) => headerOption(props, 'الحملات المستفادة')} />
  </OrdersStack.Navigator>
);

const RewardsStackLayout = () => (
  <RewardsStack.Navigator>
    <RewardsStack.Screen name="rewards" component={Rewards} options={(props) => headerOption(props, 'نقاط الاستفادة')} />
  </RewardsStack.Navigator>
);

const RulesStackLayout = () => (
  <RulesStack.Navigator>
    <RulesStack.Screen name="rules" component={Rules} options={(props) => headerOption(props, 'شروط سرية البيانات')} />
  </RulesStack.Navigator>
);

const ContactUsStackLayout = () => (
  <ContactUsStack.Navigator>
    <ContactUsStack.Screen name="contactUs" component={ContactUs} options={(props) => headerOption(props, 'تواصل معنا !')} />
  </ContactUsStack.Navigator>
);
const SavedStackLayout = () => (
  <SavedStack.Navigator>
    <SavedStack.Screen name="saved_posts" component={SavedPosts} options={(props) => headerOption(props, 'الحملات المحفوظة')} />
  </SavedStack.Navigator>
);

const SettingsStackLayout = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen name="settings" component={Settings} options={(props) => headerOption(props, 'الاعدادات')} />
  </SettingsStack.Navigator>
);

function DashboardDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(probs) => <Sidebar {...probs} />}
      backBehavior="order"
      options={{ headerStyle: styles.header }}
    >
      <Drawer.Screen name="home" component={StackTabNav} />
      <Drawer.Screen name="profile_stack" component={ProfileStackLayout} />
      <Drawer.Screen name="saved_stack" component={SavedStackLayout} />
      <Drawer.Screen name="orders_stack" component={OrdersStackLayout} />
      <Drawer.Screen name="rewards_stack" component={RewardsStackLayout} />
      <Drawer.Screen name="rules_stack" component={RulesStackLayout} />
      <Drawer.Screen name="contact_stack" component={ContactUsStackLayout} />
      <Drawer.Screen name="settings_stack" component={SettingsStackLayout} />
    </Drawer.Navigator>
  );
}
const Routes = ({ IS_AUTH }) => (
  <NavigationContainer>
    {!IS_AUTH
      ? (
        <Stack.Navigator>
          <Stack.Screen
            name="login"
            component={Login}
            options={{
              title: 'تسجيل دخول',
              headerTitleStyle: styles.header,
              headerStyle: {
                backgroundColor: Constants.GREEN_COLOR,
              },
            }}
          />
          <Stack.Screen
            name="register"
            component={Register}
            options={{
              title: 'انشاء حساب جديد',
              headerTitleStyle: styles.header,
              headerStyle: {
                backgroundColor: Constants.GREEN_COLOR,
              },
            }}
          />
          <Stack.Screen
            name="forget_pswd"
            component={ForgetPassword}
            options={{
              title: 'نسيت كلمة السر',
              headerTitleStyle: styles.header,
              headerStyle: {
                backgroundColor: Constants.GREEN_COLOR,
              },
            }}
          />
        </Stack.Navigator>
      )
      : (
        <DashboardDrawer />
      )}

  </NavigationContainer>

);

export default Routes;
