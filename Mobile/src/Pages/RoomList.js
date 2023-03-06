import React, {useState} from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Header from "../AppHeader";
import AddButton from "../Components/Button/AddButton";
import RoomButton from "../Components/Button/RoomButton";
import {Button, Icon, Overlay} from "react-native-elements";
import {useAddRoomMutation, useDeleteRoomMutation, useGetRoomsQuery} from "../services/room/room";
import {useDeleteDeviceMutation} from "../services/device/device";

export default ({route,navigation}) => {

    const [inputState,setInputState] = useState({
        name:"",
    });

    const [visible, setVisible] = useState(false);
    const {homeId,homeName} = route.params;
    const [roomDeleteId,setRoomDeleteId] = useState("");
    const {data} = useGetRoomsQuery({homeId});
    const [addRoom] = useAddRoomMutation();
    const [deleteRoom] = useDeleteRoomMutation();
    const [deleteVisible, setDeleteVisible] = useState(false);
    const toggleDeleteOverlay = () => {
        setDeleteVisible(!deleteVisible);
    };
    const toggleOverlay = () => {
        setVisible(!visible);
    };
    const handleLongPressButton = (id) => {
        toggleDeleteOverlay();
        setRoomDeleteId(id);
    }

    const handleAddRoom =  async () =>{
        try{
            if(inputState.name){
                const body = inputState;
                await addRoom({body,homeId}).unwrap();
                toggleOverlay();
            }
        }catch (err){
            console.log(err);
        }
    }

    const handleInput = (type, value) => {
        setInputState({
            ...inputState,
            [type]: value,
        })
    };
    const openControllerList = (roomId,roomName) =>{
        navigation.navigate("Controller",{homeId:homeId,roomId:roomId,roomName:roomName});
    }
    const handleDeleteRoom =  async () => {
        try {
            console.log(roomDeleteId);
            await deleteRoom({id:roomDeleteId,homeId}).unwrap();
            toggleDeleteOverlay();
        }catch (e) {
            console.log(e)
        }
    };

    return (
        <ScrollView>
            <Header title={homeName} navigation={navigation}/>
            <Text style={styles.text}>
                Room
            </Text>
            <View style={styles.container}>
                <View style={styles.main}>
                    {
                        data?.map(room =>{
                            return(
                                <TouchableOpacity key={room.id} style={styles.item}
                                                  onLongPress={() =>handleLongPressButton(room.id)}
                                                  onPress={() => openControllerList(room.id,room.name)}>
                                    <RoomButton  name={room.name} roomId={room.id}/>
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
                                        Add Room
                                    </Text>
                                    <TextInput style={styles.inputText}
                                               placeholder="Room name"
                                               onChangeText={(value) =>handleInput("name",value)}
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
                                            onPress={handleAddRoom}
                                        />

                                    </View>
                                </View>
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
                                    onPress={handleDeleteRoom}
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
        color: "#9b7e67"
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
        color: '#9b7e67',
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