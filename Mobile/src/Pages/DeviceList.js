import React, {useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator} from "react-native";
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


export default ({navigation, controllerId}) => {


    const [inputState, setInputState] = useState({
        type: "",
        pin: "",
    });
    console.log(controllerId);
    const [visible, setVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [deviceDeleteId, setDeviceDeleteId] = useState("");
    const {data} = useGetDevicesQuery({controllerId});
    const [addDevice, {isLoading}] = useAddDeviceMutation();
    const [deleteDevice] = useDeleteDeviceMutation();
    const toggleDeleteOverlay = () => {
        setDeleteVisible(!deleteVisible);
    };
    const toggleOverlay = () => {
        setVisible(!visible);
    };
    const handleLongPressButton = (id) => {
        toggleDeleteOverlay();
        setDeviceDeleteId(id);
    }
    const handleAddDevice = async () => {
        try {
            if (inputState.type && inputState.pin) {
                const body = {
                    type: inputState.type,
                    pin: inputState.pin,
                    status: "OFF",
                }
                await addDevice({body, controllerId}).unwrap();
                toggleOverlay();
            }
        } catch (err) {
            console.log(err);
        }
    }
    const openDeviceDetail = (deviceId, deviceType) => {
        navigation.navigate("DeviceItem", {controllerId: controllerId, deviceId: deviceId, deviceType: deviceType});
    };

    const handleInput = (type, value) => {
        setInputState({
            ...inputState,
            [type]: value,
        })
    };


    const handleDeleteDevice = async () => {
        try {
            await deleteDevice({id:deviceDeleteId,controllerId}).unwrap();
            toggleDeleteOverlay();
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <View>
            <Text style={styles.text}>
                Device List
            </Text>
            {isLoading? <ActivityIndicator size={'large'}/> : null}
            <View style={styles.container}>
                <View style={styles.main}>
                    {
                        data?.map(device => {
                            return (
                                <TouchableOpacity key={device.id} style={styles.item}
                                                  onLongPress={() => handleLongPressButton(device.id)}
                                                  onPress={() => openDeviceDetail(device.id, device.type)}>
                                    <DeviceButton name={device.type} homeId={device.id}/>
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
                                Add Device
                            </Text>
                            <TextInput style={styles.inputText}
                                       placeholder="Device type"
                                       onChangeText={(value) => handleInput("type", value)}
                            />
                            <TextInput style={styles.inputText}
                                       placeholder="Device pin"
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
                                    onPress={handleAddDevice}
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
                                    onPress={handleDeleteDevice}
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
        color: "#9BC8D1"
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
