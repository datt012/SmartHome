import React, {useState} from "react";
import AppHeader from "../AppHeader";
import {Tab, TabView} from "react-native-elements";
import DeviceList from "./DeviceList";
import SenSorList from "./SensorList";


export default ({route, navigation}) => {
    const {controllerId, controllerName} = route.params;
    const [index, setIndex] = useState(0);


    console.log(controllerId);
    return (
        <>
            <AppHeader title={controllerName} navigation={navigation}/>
            <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                indicatorStyle={{
                    backgroundColor: 'white',
                    height: 3,
                }}
                variant="primary"
            >
                <Tab.Item
                    title="Devices"
                    titleStyle={{fontSize: 12}}
                    icon={{name: 'devices', type: 'material-community', color: 'white'}}
                />
                <Tab.Item
                    title="Sensors"
                    titleStyle={{fontSize: 12}}
                    icon={{name: 'leak', type: 'material-community', color: 'white'}}
                />
            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{width: '100%'}} active={index === 0}>
                    {index === 0 && <DeviceList navigation={navigation} controllerId={controllerId}/>}
                </TabView.Item>
                <TabView.Item style={{width: '100%'}} active={index === 1}>
                    {index === 1 && <SenSorList navigation={navigation} controllerId={controllerId} />}
                </TabView.Item>
            </TabView>
        </>
    )
};
