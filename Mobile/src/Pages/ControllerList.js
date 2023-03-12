import React, {useState} from "react";
import DeviceList from "./DeviceList";
import {
    useAddControllerMutation,
    useDeleteControllerMutation,
    useGetControllersQuery
} from "../services/controller/controller";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator} from "react-native";
import AppHeader from "../AppHeader";
import {Button, Icon, Overlay} from "react-native-elements";
import Header from "../AppHeader";
import AddButton from "../Components/Button/AddButton";
import ControllerButton from "../Components/Button/ControllerButton";
export default ({route, navigation}) => {
    const {roomId,roomName} = route.params;
    const {data} = useGetControllersQuery(roomId);
    const [visible, setVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [controllerDeleteId,setControllerDeleteId] = useState("");
    const [addController, {isLoading}] = useAddControllerMutation();
    const [deleteController] = useDeleteControllerMutation();
    const [controllerActive,setControllerActive] = useState("");
    const [controllerName,setControllerName] = useState("");
    const toggleDeleteOverlay = () => {
        setDeleteVisible(!deleteVisible);
    };
    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const handleAddController =  async () =>{
        console.log("run")
        try {
            console.log(controllerName);
            if(controllerName !== ""){
                const date = Date.now();
                console.log(date);
                const body = {
                    uuid:`${controllerName} - ${date}`
                }
                await addController({body,roomId}).unwrap();
                toggleOverlay();
            }
        }catch (e) {
            console.log(e)
        }
    }

    const openDeviceList = (controllerId,name) =>{
        navigation.navigate("ControllerItem",{controllerId:controllerId,controllerName:name})
    }
    const handleLongPressButton = (id) => {
        toggleDeleteOverlay();
        setControllerDeleteId(id)
    }

    const handleDeleteController =  async () => {
        try {
            await deleteController({id:controllerDeleteId,roomId}).unwrap();
            toggleDeleteOverlay();
        }catch (e) {
            console.log(e)
        }
    };

    return (
        <ScrollView>
            <Header title={roomName} navigation={navigation}/>
            <Text style={styles.text}>
                Controller
            </Text>
            {isLoading? <ActivityIndicator size={'large'}/> : null}
            <View style={styles.container}>
                <View style={styles.main}>
                    {
                        data?.map(controller =>{
                            const name = controller.uuid?.split("-")[0];
                            return(
                                <TouchableOpacity key={controller.id} style={styles.item}
                                                  onLongPress={() =>handleLongPressButton(controller.id)}
                                                  onPress={() => openDeviceList(controller.id,name)}>
                                    <ControllerButton  name={name}/>
                                </TouchableOpacity>
                            )
                        })
                    }
                    <TouchableOpacity style={styles.item} onPress={toggleOverlay}>
                        <AddButton/>
                    </TouchableOpacity>
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                        <View style={styles.form}>
                            <View style={styles.form}>
                                <View style={styles.form}>
                                    <Text style={styles.textName}>
                                        Add Controller
                                    </Text>
                                    <TextInput style={styles.inputText}
                                               placeholder="Controller name"
                                               onChangeText={(value) => setControllerName(value)}
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
                                            onPress={handleAddController}
                                        />

                                    </View>
                                </View>
                            </View>
                        </View>
                    </Overlay>
                    <Overlay isVisible={deleteVisible} onBackdropPress={toggleDeleteOverlay}>
                        <View style={styles.containerOverlay}>
                            <Text style={styles.textName}>Delete Controller</Text>
                            <View style={{
                                flexDirection: "row",
                            }}>
                                <Button
                                    title="Delete"
                                    onPress={handleDeleteController}
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
        </ScrollView>


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
        fontSize: 30,
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
