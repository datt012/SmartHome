import React, {useState} from "react";
import {ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Header from "../AppHeader";
import AddButton from "../Components/Button/AddButton";
import HouseButton from "../Components/Button/HouseButton";
import {Button, Icon, Overlay} from "react-native-elements";
import {useAddHomeMutation, useDeleteHomeMutation, useGetHomesQuery} from "../services/home/home";
import {useSelector} from "react-redux";


export default ({navigation}) => {
    const [visible, setVisible] = useState(false);

    const {data, isLoading1} = useGetHomesQuery();
    const initState = {
        name: "",
        location: "",
    };
    const [inputState, setInputState] = useState(initState);
    const [addHome, {isLoading}] = useAddHomeMutation();
    const [deleteHome] = useDeleteHomeMutation();
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [homeDeleteId, setHomeDeleteId] = useState("");
    const toggleDeleteOverlay = () => {
        setDeleteVisible(!deleteVisible);
    };
    const role = useSelector(state => state.loginInfo.role);
    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const handleInput = (type, value) => {
        setInputState({
            ...inputState,
            [type]: value,
        })
    }
    const handleAddHome = async () => {
        try {
            if (inputState.name && inputState.location) {
                await addHome(inputState).unwrap();
                toggleOverlay();
            }

        } catch (e) {
            console.log(e)
        }
    };
    const openRoomList = (homeId, homeName) => {
        navigation.navigate("Room", {homeId: homeId, homeName: homeName});
    };
    const handleLongPressButton = (id) => {
        toggleDeleteOverlay();
        setHomeDeleteId(id)
    }
    const handleDeleteHome = async () => {
        try {
            await deleteHome(homeDeleteId).unwrap();
            toggleDeleteOverlay();
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <ScrollView>
            <Header title={"House"} style={{backgroundColor: "#9BC8D1"}} /*backgroundColor="#9BC8D1"*/ back={false} navigation={navigation}/>
            <Text style={styles.text}>
                Home
            </Text>
            {isLoading? <ActivityIndicator size={'large'}/> : null}
            {isLoading1? <ActivityIndicator size={'large'}/> : null}

            <View style={styles.container}>
                <View style={styles.main}>
                    { data? (
                        data?.map(home => {
                            return (
                                <TouchableOpacity key={home.id} style={styles.item}
                                                  onLongPress={() => handleLongPressButton(home.id)}
                                                  onPress={() => openRoomList(home.id, home.name)}>
                                    <HouseButton name={home.name} homeId={home.id}/>
                                </TouchableOpacity>
                            )
                        })
                        ): <ActivityIndicator size={'large'}/>

                    }

                    <TouchableOpacity style={styles.item} onPress={toggleOverlay}>
                        <AddButton/>
                    </TouchableOpacity>
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                        <View style={styles.form}>
                            <Text style={styles.textName} onPress={handleAddHome}>
                                Add House
                            </Text>
                            <TextInput style={styles.inputText}
                                       placeholder="House name"
                                       onChangeText={(value) => handleInput("name", value)}
                            />
                            <TextInput style={styles.inputText}
                                       placeholder="Address"
                                       onChangeText={(value) => handleInput("location", value)}
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
                                    onPress={handleAddHome}
                                />
                            </View>
                        </View>
                    </Overlay>
                    <Overlay isVisible={deleteVisible} onBackdropPress={toggleDeleteOverlay}>
                        <View style={styles.containerOverlay}>
                            <Text style={styles.textName}>Delete Home?</Text>
                            <View style={{
                                flexDirection: "row",
                            }}>
                                <Button
                                    title="Delete"
                                    containerStyle={{
                                        flex: 1,
                                        height: 40,
                                        width: 100,
                                        marginHorizontal: 20,
                                        marginVertical: 20,
                                    }}
                                    onPress={handleDeleteHome}
                                    buttonStyle={{
                                        backgroundColor: '#9BC8D1',
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
                                    type="clear"
                                    onPress={toggleDeleteOverlay}
                                    titleStyle={{color: '#9BC8D1'}}
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
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100 / 5,

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