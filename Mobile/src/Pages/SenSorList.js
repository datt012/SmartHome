import React, {useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import AppHeader from "../AppHeader";
import Add_button from "../Components/Button/AddButton";
import DeviceButton from "../Components/Button/DeviceButton";
import {Button, Icon, Overlay} from "react-native-elements";
import ModalSelector from 'react-native-modal-selector';

import {
    useAddDeviceMutation,
    useDeleteDeviceMutation,
    useGetDevicesQuery,
    usePutDeviceMutation
} from "../services/device/device";
import HouseButton from "../Components/Button/HouseButton";
import {useGetControllersQuery} from "../services/controller/controller";
import SensorButton from "../Components/Button/SensorButton";
import {useAddSensorMutation, useDeleteSensorMutation, useGetSensorsQuery} from "../services/sensor/sensor";


export default ({navigation,controllerId}) => {

    const {data} = useGetSensorsQuery({controllerId});
    const [inputState, setInputState] = useState({
        type: "",
        pin: "",
    });
    const [visible, setVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [sensorDeleteId, setSensorDeleteId] = useState("");
    const [addSensor] = useAddSensorMutation();
    const [deleteSensor] = useDeleteSensorMutation();

    const toggleDeleteOverlay = () => {
        setDeleteVisible(!deleteVisible);
    };
    const toggleOverlay = () => {
        setVisible(!visible);
    };
    const handleLongPressButton = (id) => {
        toggleDeleteOverlay();
        setSensorDeleteId(id);
    }
    const handleAddSensor = async () => {
        try {
            if (inputState.type && inputState.pin) {
                const body = {
                    type: inputState.type,
                    pin: inputState.pin,
                }
                2
                await addSensor({body, controllerId}).unwrap();
                toggleOverlay();
            }
        } catch (err) {
            console.log(err);
        }
    }
    const openDeviceDetail = (deviceId, deviceType) => {
        // navigation.navigate("DeviceWrap", {controllerId:controllerId,deviceId: deviceId, deviceType: deviceType});
    };

    const handleInput = (type, value) => {
        setInputState({
            ...inputState,
            [type]: value,
        })
    };


    const handleDeleteSensor = async () => {
        try {
            console.log();
            await deleteSensor({id: sensorDeleteId, controllerId}).unwrap();
            toggleDeleteOverlay();
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <View>
            <Text style={styles.text}>
                Sensor List
            </Text>
            <View style={styles.container}>
                <View style={styles.main}>
                    {
                        data?.map(sensor => {
                            return (
                                <TouchableOpacity key={sensor.id} style={styles.item}
                                                  onLongPress={() => handleLongPressButton(sensor.id)}>
                                    <SensorButton name={sensor.type}/>
                                </TouchableOpacity>
                            )
                        })
                    }
                    <TouchableOpacity style={styles.item} onPress={toggleOverlay}>
                        <Add_button/>
                    </TouchableOpacity>
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                        <View style={styles.form}>
                            <Text style={styles.textName}>
                                Add Sensor
                            </Text>
                            <TextInput style={styles.inputText}
                                       placeholder="Sensor type"
                                       onChangeText={(value) => handleInput("type", value)}
                            />
                            <TextInput style={styles.inputText}
                                       placeholder="Sensor pin"
                                       onChangeText={(value) => handleInput("pin", value)}
                            />
                            <View style={{
                                flexDirection: "row",
                                alignContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#FD9A3F',
                                borderRadius: 100 / 50
                            }}>
                                <Button
                                    buttonStyle={{
                                        backgroundColor: 'rgba(253, 154, 63, 1)',
                                        borderRadius: 30,
                                    }}
                                    borderRadius={100 / 50}
                                    icon={
                                        <Icon
                                            name="plus"
                                            type="font-awesome"
                                            color="white"
                                            size={25}
                                            iconStyle={{marginRight: 10}}
                                        />
                                    }
                                    title="Add"
                                    onPress={handleAddSensor}
                                />
                            </View>
                        </View>
                    </Overlay>
                    <Overlay isVisible={deleteVisible} onBackdropPress={toggleDeleteOverlay}>
                        <View style={styles.containerOverlay}>
                            <Text style={styles.textName}>Delete Device?</Text>
                            <View style={{
                                flexDirection: "row",
                            }}>
                                <Button
                                    title="Delete"
                                    onPress={handleDeleteSensor}
                                    containerStyle={{
                                        flex: 1,
                                        height: 40,
                                        width: 100,
                                        marginHorizontal: 20,
                                        marginVertical: 20,
                                    }}
                                    buttonStyle={{
                                        backgroundColor: '#FD9A3F',
                                        borderRadius: 100 / 2
                                    }}
                                    titleStyle={{
                                        color: 'white',
                                        marginHorizontal: 20,
                                    }}
                                />
                                <Button
                                    containerStyle={{
                                        flex: 1,
                                        width: 100,
                                        marginHorizontal: 20,
                                        marginVertical: 20,
                                    }}
                                    title="Cancel"
                                    onPress={toggleDeleteOverlay}
                                    type="clear"
                                    titleStyle={{color: '#FD9A3F'}}
                                />
                            </View>
                        </View>
                    </Overlay>
                </View>
            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100 / 5
    },
    main: {
        width: 500,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        padding: 50,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 20,
        color: "#FD9A3F"
    },
    inputText: {
        borderColor: "black",
        backgroundColor: "#FFFFFF",
        width: 300,
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
        color: '#FD9A3F',
        alignItems: 'flex-end',
        marginLeft: 20,
    },
    form: {
        alignItems: 'center',
        justifyContent: 'center',
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
})
