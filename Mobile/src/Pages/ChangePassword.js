import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import Header from '../AppHeader';
import {useChangePasswordMutation, useGetUserQuery, usePostUserMutation} from "../services/user/user";

export default ({navigation}) => {

    const {data} = useGetUserQuery();
    const initState = {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword:"",
    };
    const [inputState, setInputState] = useState(initState);
    const [changePassword] = useChangePasswordMutation();

    const handleInput = (type, value) => {
        setInputState({
            ...inputState,
            [type]: value,
        })
    }

    const handleSubmit = async () => {
        try {
            if(inputState.newPassword === inputState.currentPassword !== ""){
                const body = {
                    currentPassword: inputState.currentPassword,
                    newPassword: inputState.newPassword,
                }
                console.log(body);
                await changePassword(body).unwrap();
                console.log("change password")
                navigation.navigate("Home");
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <ScrollView>
            <Header title={""} navigation={navigation}/>
            <View>
                <Text style={styles.textName}>
                    Thông tin tài khoản
                </Text>

                <View style={styles.info}>
                    <View>
                        <Text style={styles.text}>
                            current password
                        </Text>
                        <TextInput style={styles.inputText}

                                   onChangeText={(value) => handleInput("currentPassword", value)}
                        />

                        <Text style={styles.text}>
                            new password
                        </Text>
                        <TextInput style={styles.inputText}

                                   onChangeText={(value) => handleInput("newPassword", value)}
                        />

                        <Text style={styles.text}>
                            confirm new password
                        </Text>
                        <TextInput style={styles.inputText}

                                   onChangeText={(value) => handleInput("confirmNewPassword", value)}

                        />


                        <View>
                            <Button title="Save" color="#FD9A3F" onPress={handleSubmit}/>
                        </View>
                    </View>
                </View>
            </View>

        </ScrollView>
    );

};

const styles = StyleSheet.create({
    inputText: {
        borderColor: "black",
        backgroundColor: "#FFF",
        width: 300,
        borderWidth: 0,
        borderStyle: "solid",
        fontSize: 15,
        borderRadius: 25,
        margin: 10,
        paddingLeft: 20,

    },
    textName: {
        marginBottom: 30,
        fontFamily: 'Roboto Mono',
        fontWeight: "bold",
        fontSize: 20,
        lineHeight: 50,
        color: '#9b7e67',
        alignItems: 'flex-start',
        marginLeft: 20,
    },

    info: {
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center",

    },
    text: {
        paddingLeft: 20,
        color: '#9b7e67',
        fontSize: 14,
        fontWeight: "bold",
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#397af8',
        marginBottom: 20,
        width: '100%',
        paddingVertical: 15,
    },
    heading: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    headerRight: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 5,
    },
    subheaderText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonSave: {
        marginLeft: '40px',
        marginRight: '40px',
    }
});
