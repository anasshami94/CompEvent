import React from 'react';
import {
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import Constants from '../constants';
import {
  AuthContext,
} from '../context';

export default function Sidebar(props) {
  const {
    signout,
  } = React.useContext(AuthContext);
  const routesList = [{
    route: 'saved_stack',
    title: 'قائمة الحملات المحفوظة',
    icon: 'star',
  }, {

    route: 'orders_stack',
    title: 'قائمة الحملات المستفادة',
    icon: 'tag',
  }, {

    route: 'rewards_stack',
    title: 'نقاط المكافأت',
    icon: 'gift',
  }, {

    route: 'profile_stack',
    title: 'تحديث بيانات الحساب',
    icon: 'user',
  }, {

    route: 'rules_stack',
    title: 'الشروط وسياسات البيانات',
    icon: 'edit',
  }, {

    route: 'contact_stack',
    title: 'تواصل معنا',
    icon: 'phone',
  }, {

    route: '',
    title: 'تقييم التطبيق',
    icon: 'check',
  }, {

    route: '',
    title: 'شارك التطبيق',
    icon: 'link',
  }, {

    route: 'settings_stack',
    title: 'اعدادات التطبيق',
    icon: 'setting',
  },

  {
    route: () => {
      signout();
    },
    title: 'تسجيل خروج',
    icon: 'right',
  },
  ];

  return (
    <View style={
      {
        flex: 1,
        backgroundColor: '#555',
      }
    }
    >
      <DrawerContentScrollView {
      ...props
    }
      >
        {
      routesList.map((item, index) => (
        <DrawerItem
          key={`item_${index.toString()}`}
          icon={
          ({
            focused,
            size,
          }) => (
            <Icon
              name={
            item.icon
          }
              size={
            size
          }
              color={
            focused ? '#0ff' : Constants.GREEN_COLOR
          }
            />
          )
}
          label={
            item.title
          }
          labelStyle={
            {
              color: 'white',
            }
          }
          onPress={
            () => {
              const { route } = item;
              if (typeof route === 'function') route();
              else props.navigation.navigate(route);
            }
          }
        />
      ))
      }

      </DrawerContentScrollView>
    </View>
  );
}
