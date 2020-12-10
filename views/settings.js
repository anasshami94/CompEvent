
import React from "react";
import { View, Text, Switch } from 'react-native';
import Constants from "../constants";
import IonIcons from "react-native-vector-icons/Ionicons"


const Settings = () => {
    const [isEnabled, setIsEnabled] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={{padding: 30, flexDirection: "row", alignItems: "center"}}>
                <Switch
                    trackColor={{ false: "#767577", true: Constants.GREEN_COLOR }}
                    thumbColor="#fff"
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                /> 
                <Text style={{fontSize: 18, marginLeft: 10}}>ألاشعارات داخل التطبيق</Text>
            </View>
             <View style={{padding: 30, flexDirection: "row", alignItems: "center"}}>
                <IonIcons name="download" size={30}/>
                <Text style={{fontSize: 18, marginLeft: 10}}>البحث عن تحديثات</Text>
            </View>
            <View style={{padding: 30, flexDirection: "row", alignItems: "center"}}>
                <IonIcons name="right" size={30}/>
                <Text style={{fontSize: 18, marginLeft: 10}}>تسجيل خروج</Text>
            </View>
        </View>
    );
}

export default Settings;