import React, {useEffect, useState} from "react";
import DeviceDetail from "./DeviceDetail";
import {useGetDeviceByIdQuery} from "../services/device/device";
import {View} from "react-native";

export  default ({route, navigation}) => {
    const {controllerId,deviceId, deviceType} = route.params;
    const {data} = useGetDeviceByIdQuery(deviceId);
    return (
        <>
            {
                data?
                    <DeviceDetail data={data} controllerId={controllerId} navigation={navigation}/>
                    :
                    <View/>
            }
        </>
    )
};
