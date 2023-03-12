import React, {useEffect, useState} from "react";
import {StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from "react-native";
import AppHeader from "../AppHeader";
import DeviceController from "../Components/Button/DeviceController";
import {getClient} from "../setupMqtt"
import {
    useGetDeviceByIdQuery,
} from "../services/device/device";
import {useSelector} from "react-redux";
import jwtDecode from "jwt-decode";

export default (props) => {

    const {data,controllerId,navigation} = props;
    const {refetch} = useGetDeviceByIdQuery(data.id);
    const [isEnable, setIsEnable] = useState(data.status === "ON");
    const token = useSelector(state => state.loginInfo.token);
    const decodeToken = jwtDecode(token);

    console.log(data)

    const handleChangeStatus = async () => {
        const client = await getClient();
        try {
            const date = new Date();
            let newStatus;
            if (isEnable) {
                newStatus = "OFF"
            } else newStatus = "ON";
            console.log(newStatus);
            const payload = {
                device: data.type,
                data: {
                    status: newStatus,
                },
                time: date.toString(),
                pin:data.pin,
                creator: decodeToken.username,
            };
            console.log(controllerId);
            client.on('connect', function () {
                client.publish(`${controllerId}/devices/${data.id}`, JSON.stringify(payload), 0, false);
            });
        } catch (e) {
            console.log(e)
        } finally {
            setIsEnable(prev => !prev);
            // play around
            setTimeout(() => {
                refetch();
            }, 2000);

            client.disconnect();
        }
    };

    return (
        <View>
            <AppHeader title={data.type} navigation={navigation}/>
            <Text style={styles.text}>
            </Text>
            <View style={styles.container}>


                <View style={styles.main}>
                    <View style={styles.item}>
                        <DeviceController/>
                    </View>

                    <View style={styles.switch}>
                        <Text style={styles.text}>
                            {/*Off*/}
                            Lock
                        </Text>
                        <Switch
                            trackColor={{false: "#767577", true: "#81b0ff"}}
                            thumbColor={isEnable ? "#9BC8D1" : "#f4f3f4"}
                            onValueChange={handleChangeStatus}
                            value={isEnable}
                            style={{transform: [{scaleX: 1.5}, {scaleY: 1.5}]}}
                        />
                        <Text style={styles.text}>
                            {/*On*/}
                            Open
                        </Text>
                    </View>


                </View>
            </View>
        </View>


    )

};
const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100 / 5

    },
    main: {
        width: 500,
        alignItems: 'center',
        justifyContent: 'center',

    },
    item: {
        paddingTop: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 20,
        color: "#9BC8D1"
    },
    inputText: {
        borderColor: "black",
        backgroundColor: "#FFFFFF",
        width: 200,
        borderWidth: 0,
        borderStyle: "solid",
        fontSize: 15,
        borderRadius: 25,
        margin: 10,
        paddingLeft: 20,
    },
    textName: {

        fontFamily: 'Roboto Mono',
        fontWeight: "bold",
        fontSize: 25,
        lineHeight: 50,
        color: '#9BC8D1',
        alignItems: 'flex-end',
        marginLeft: 20,
    },
    form: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 250,
        borderRadius: 100 / 50
    },
    containerOverlay: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100 / 5,
        maxWidth: 300

    },
    switch: {

        flexDirection: "row",
        padding: 30,
    }
})
