import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from "@react-navigation/native";
import {MenuProvider} from 'react-native-popup-menu';
import DeviceList from "./Pages/DeviceList";
import RoomList from "./Pages/RoomList";
import HomeList from "./Pages/HomeList";
import UserInfo from "./Pages/UserInfo";
import Signup from "./Pages/Auth/SignUp";
import SignIn from "./Pages/Auth/SignIn";
import ChangePassword from "./Pages/ChangePassword";
import {Provider, useSelector} from 'react-redux';
import {store} from "./services/store";
import DeviceDetail from "./Pages/DeviceDetail";
import ControllerList from "./Pages/ControllerList";
import MQTT from 'sp-react-native-mqtt';
import DeviceItem from "./Pages/DeviceItem";
import ControllerItem from "./Pages/ControllerItem";


const Stack = createNativeStackNavigator();
const MyStack = () => {
    const isLogin = useSelector(state => state.loginInfo.isLogin);

    return (
        <MenuProvider>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                {
                    isLogin ? (
                        <>
                            <Stack.Screen name="Home" component={HomeList} />
                            <Stack.Screen name="User_info" component={UserInfo}/>
                            <Stack.Screen name="Change_password" component={ChangePassword}/>
                            <Stack.Screen name="Room" component={RoomList}/>
                            <Stack.Screen name="Controller" component={ControllerList}/>
                            <Stack.Screen name="ControllerItem" component={ControllerItem}/>
                            {/*<Stack.Screen name="Device" component={DeviceList}/>*/}
                            <Stack.Screen name="DeviceItem" component={DeviceItem}/>
                            {/*<Stack.Screen name="DeviceDetail" component={DeviceDetail}/>*/}
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="Log_in" component={SignIn}/>
                            <Stack.Screen name="Sign_up" component={Signup}/>
                        </>
                    )
                }
            </Stack.Navigator>
        </MenuProvider>
    );
}

const styles = StyleSheet.create({});

export default () => (
    <Provider store={store}>
        <NavigationContainer>
            <MyStack/>
        </NavigationContainer>
    </Provider>
)



